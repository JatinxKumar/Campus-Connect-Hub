import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { clubs as initialClubs, Club } from "@/data/clubsData";
import { events as initialEvents, Event } from "@/data/eventsData";
import { apiUrl, parseApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface SocialLinks {
  github: string;
  linkedin: string;
  portfolio: string;
}

interface EventRegistrationRecord {
  eventId: number;
  ticketCode: string;
  registeredAt: string;
  attendanceConfirmed: boolean;
  certificateIssuedAt?: string;
}

export interface UserActivityProfile {
  email: string;
  displayName: string;
  bio: string;
  interests: string[];
  socialLinks: SocialLinks;
  joinedClubIds: number[];
  eventRegistrations: EventRegistrationRecord[];
}

export interface RegisteredEventActivity extends EventRegistrationRecord {
  event: Event;
}

interface AppContextType {
  clubs: Club[];
  events: Event[];
  userProfile: UserActivityProfile | null;
  joinedClubs: Club[];
  registeredEvents: RegisteredEventActivity[];
  attendanceScore: number;
  recommendedClubs: Club[];
  addClub: (club: Club) => Promise<void>;
  updateClub: (club: Club) => Promise<void>;
  deleteClub: (clubId: number) => Promise<void>;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: number) => void;
  registerForEvent: (eventId: number) => Promise<void>;
  joinClub: (clubId: number) => Promise<void>;
  updateUserProfile: (updates: Partial<UserActivityProfile>) => void;
  markEventAttendance: (eventId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const PROFILE_STORAGE_KEY = "campus-connect-user-profiles";

const getNextId = (items: { id: number }[]) => {
  if (items.length === 0) {
    return 1;
  }
  return Math.max(...items.map((item) => item.id)) + 1;
};

const getStoredProfiles = () => {
  if (typeof window === "undefined") {
    return {} as Record<string, UserActivityProfile>;
  }

  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      return {} as Record<string, UserActivityProfile>;
    }

    return JSON.parse(raw) as Record<string, UserActivityProfile>;
  } catch {
    return {} as Record<string, UserActivityProfile>;
  }
};

const createDefaultProfile = (email: string, displayName?: string): UserActivityProfile => ({
  email,
  displayName: displayName || "Campus User",
  bio: "",
  interests: [],
  socialLinks: {
    github: "",
    linkedin: "",
    portfolio: "",
  },
  joinedClubIds: [],
  eventRegistrations: [],
});

const createTicketCode = (eventId: number) =>
  `CCH-${eventId}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [profilesByEmail, setProfilesByEmail] = useState<Record<string, UserActivityProfile>>(getStoredProfiles);
  const { user } = useAuth();

  const currentEmail = user?.email?.trim().toLowerCase() || "";
  const userProfile = currentEmail ? profilesByEmail[currentEmail] || null : null;
  const joinedClubs = (userProfile?.joinedClubIds || [])
    .map((clubId) => clubs.find((club) => club.id === clubId))
    .filter((club): club is Club => Boolean(club));
  const registeredEvents = (userProfile?.eventRegistrations || [])
    .map((registration) => {
      const event = events.find((entry) => entry.id === registration.eventId);
      return event ? { ...registration, event } : null;
    })
    .filter((registration): registration is RegisteredEventActivity => Boolean(registration));
  const attendanceScore = registeredEvents.length
    ? Math.round(
        (registeredEvents.filter((registration) => registration.attendanceConfirmed).length /
          registeredEvents.length) *
          100
      )
    : 0;
  const recommendedClubs = clubs
    .filter((club) => !joinedClubs.some((joinedClub) => joinedClub.id === club.id))
    .map((club) => {
      const interestMatches = (userProfile?.interests || []).filter((interest) => {
        const normalizedInterest = interest.toLowerCase();
        return (
          club.category.toLowerCase().includes(normalizedInterest) ||
          club.name.toLowerCase().includes(normalizedInterest) ||
          club.description.toLowerCase().includes(normalizedInterest)
        );
      }).length;

      return { club, score: interestMatches + (club.featured ? 1 : 0) };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.club);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(apiUrl("/api/clubs"));
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { clubs?: Club[] };
        if (Array.isArray(payload.clubs)) {
          setClubs(payload.clubs);
        }
      } catch {
        // Keep fallback data if backend is unavailable.
      }
    };

    void fetchClubs();
  }, []);

  useEffect(() => {
    if (!currentEmail) {
      return;
    }

    setProfilesByEmail((prev) => {
      const existing = prev[currentEmail];
      const nextProfile = existing
        ? {
            ...existing,
            displayName: user?.name || existing.displayName,
          }
        : createDefaultProfile(currentEmail, user?.name);

      return {
        ...prev,
        [currentEmail]: nextProfile,
      };
    });
  }, [currentEmail, user?.name]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profilesByEmail));
    }
  }, [profilesByEmail]);

  const updateCurrentProfile = (
    updater: (profile: UserActivityProfile) => UserActivityProfile
  ) => {
    if (!currentEmail) {
      return;
    }

    setProfilesByEmail((prev) => {
      const baseProfile = prev[currentEmail] || createDefaultProfile(currentEmail, user?.name);
      return {
        ...prev,
        [currentEmail]: updater(baseProfile),
      };
    });
  };

  const addClub = async (club: Club) => {
    const response = await fetch(apiUrl("/api/clubs"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(club),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    const payload = (await response.json()) as { club?: Club };
    if (!payload.club) {
      throw new Error("Club creation failed");
    }

    setClubs((prev) => [...prev, payload.club as Club]);
  };

  const updateClub = async (updatedClub: Club) => {
    const response = await fetch(apiUrl(`/api/clubs/${updatedClub.id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedClub),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    const payload = (await response.json()) as { club?: Club };
    if (!payload.club) {
      throw new Error("Club update failed");
    }

    setClubs((prev) =>
      prev.map((club) => (club.id === payload.club!.id ? payload.club! : club))
    );
  };

  const deleteClub = async (clubId: number) => {
    const response = await fetch(apiUrl(`/api/clubs/${clubId}`), {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    setClubs((prev) => prev.filter((club) => club.id !== clubId));
  };

  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, { ...event, id: getNextId(prev) }]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  const deleteEvent = (eventId: number) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const registerForEvent = async (eventId: number) => {
    const existingRegistration = userProfile?.eventRegistrations.some(
      (registration) => registration.eventId === eventId
    );
    if (existingRegistration) {
      throw new Error("You are already registered for this event.");
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId && event.currentParticipants < event.maxParticipants
          ? { ...event, currentParticipants: event.currentParticipants + 1 }
          : event
      )
    );

    updateCurrentProfile((profile) => ({
      ...profile,
      eventRegistrations: [
        {
          eventId,
          ticketCode: createTicketCode(eventId),
          registeredAt: new Date().toISOString(),
          attendanceConfirmed: false,
        },
        ...profile.eventRegistrations,
      ],
    }));
  };

  const joinClub = async (clubId: number) => {
    const response = await fetch(apiUrl(`/api/clubs/${clubId}/join`), {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    const payload = (await response.json()) as { club?: Club };
    if (payload.club) {
      setClubs((prev) =>
        prev.map((club) => (club.id === payload.club!.id ? payload.club! : club))
      );
    }

    updateCurrentProfile((profile) => {
      if (profile.joinedClubIds.includes(clubId)) {
        return profile;
      }

      return {
        ...profile,
        joinedClubIds: [...profile.joinedClubIds, clubId],
      };
    });
  };

  const updateUserProfile = (updates: Partial<UserActivityProfile>) => {
    updateCurrentProfile((profile) => ({
      ...profile,
      ...updates,
      displayName: updates.displayName ?? profile.displayName,
      bio: updates.bio ?? profile.bio,
      interests: updates.interests ?? profile.interests,
      joinedClubIds: updates.joinedClubIds ?? profile.joinedClubIds,
      eventRegistrations: updates.eventRegistrations ?? profile.eventRegistrations,
      socialLinks: {
        ...profile.socialLinks,
        ...updates.socialLinks,
      },
    }));
  };

  const markEventAttendance = (eventId: number) => {
    updateCurrentProfile((profile) => ({
      ...profile,
      eventRegistrations: profile.eventRegistrations.map((registration) =>
        registration.eventId === eventId
          ? {
              ...registration,
              attendanceConfirmed: true,
              certificateIssuedAt:
                registration.certificateIssuedAt || new Date().toISOString(),
            }
          : registration
      ),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        clubs,
        events,
        userProfile,
        joinedClubs,
        registeredEvents,
        attendanceScore,
        recommendedClubs,
        addClub,
        updateClub,
        deleteClub,
        addEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        joinClub,
        updateUserProfile,
        markEventAttendance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
