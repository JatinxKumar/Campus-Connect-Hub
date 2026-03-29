import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { clubs as initialClubs, Club } from '@/data/clubsData';
import { events as initialEvents, Event } from '@/data/eventsData';
import { apiUrl, parseApiError } from '@/lib/api';

interface AppContextType {
  clubs: Club[];
  events: Event[];
  addClub: (club: Club) => Promise<void>;
  updateClub: (club: Club) => Promise<void>;
  deleteClub: (clubId: number) => Promise<void>;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: number) => void;
  registerForEvent: (eventId: number) => Promise<void>;
  joinClub: (clubId: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getNextId = (items: { id: number }[]) => {
  if (items.length === 0) {
    return 1;
  }
  return Math.max(...items.map(item => item.id)) + 1;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [events, setEvents] = useState<Event[]>(initialEvents);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(apiUrl('/api/clubs'));
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

  const addClub = async (club: Club) => {
    const response = await fetch(apiUrl('/api/clubs'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(club),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    const payload = (await response.json()) as { club?: Club };
    if (!payload.club) {
      throw new Error('Club creation failed');
    }

    setClubs(prev => [...prev, payload.club!]);
  };

  const updateClub = async (updatedClub: Club) => {
    const response = await fetch(apiUrl(`/api/clubs/${updatedClub.id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedClub),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    const payload = (await response.json()) as { club?: Club };
    if (!payload.club) {
      throw new Error('Club update failed');
    }

    setClubs(prev => prev.map(club => (
      club.id === payload.club!.id
        ? payload.club!
        : club
    )));
  };

  const deleteClub = async (clubId: number) => {
    const response = await fetch(apiUrl(`/api/clubs/${clubId}`), {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    setClubs(prev => prev.filter(club => club.id !== clubId));
  };

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, { ...event, id: getNextId(prev) }]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event =>
      event.id === updatedEvent.id
        ? updatedEvent
        : event
    ));
  };

  const deleteEvent = (eventId: number) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const registerForEvent = async (eventId: number) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId && event.currentParticipants < event.maxParticipants
        ? { ...event, currentParticipants: event.currentParticipants + 1 }
        : event
    ));
  };

  const joinClub = async (clubId: number) => {
    const response = await fetch(apiUrl(`/api/clubs/${clubId}/join`), {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    const payload = (await response.json()) as { club?: Club };
    if (!payload.club) {
      return;
    }

    setClubs(prev => prev.map(club => (
      club.id === payload.club!.id
        ? payload.club!
        : club
    )));
  };

  return (
    <AppContext.Provider value={{ clubs, events, addClub, updateClub, deleteClub, addEvent, updateEvent, deleteEvent, registerForEvent, joinClub }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
