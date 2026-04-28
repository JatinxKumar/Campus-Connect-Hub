import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { apiUrl, parseApiError } from "@/lib/api";

interface AuthUser {
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isAdmin: boolean;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  registerWithCredentials: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "campus-connect-auth";
const AUTH_USER_STORAGE_KEY = "campus-connect-auth-user";
const parseJwtPayload = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) {
      return null;
    }
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = window.atob(base64);
    return JSON.parse(payload) as { name?: string; email?: string; picture?: string };
  } catch {
    return null;
  }
};

const getInitialAuthState = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
};

const getInitialUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const savedUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!savedUser) {
      return null;
    }
    return JSON.parse(savedUser) as AuthUser;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getInitialAuthState);
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);
  const isAdmin = Boolean(user?.email?.toLowerCase().endsWith("@chitkara.edu.in"));

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      }
    }
  }, [user]);

  const loginWithGoogle = async (credential: string) => {
    if (!credential) {
      return false;
    }

    const payload = parseJwtPayload(credential);
    if (!payload?.email || !payload?.name) {
      return false;
    }

    const response = await fetch(apiUrl("/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        provider: "google",
      }),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    setUser({
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    });
    setIsAuthenticated(true);
    return true;
  };

  const loginWithCredentials = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    const response = await fetch(apiUrl("/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password: password.trim(),
        provider: "credentials",
      }),
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as { user?: AuthUser };

    setUser(payload.user || { name: "Campus User", email: normalizedEmail });
    setIsAuthenticated(true);
    return true;
  };

  const registerWithCredentials = async (name: string, email: string, password: string) => {
    const response = await fetch(apiUrl("/auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAdmin,
        loginWithGoogle,
        loginWithCredentials,
        registerWithCredentials,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
