import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
}

interface Session {
  user: User;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    userData: any,
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock implementation for development without Supabase
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for saved user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("mockUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as User;
      setUser(parsedUser);
      setSession({ user: parsedUser });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock successful login
      if (email && password) {
        // For demo purposes, any non-empty email/password works
        const mockUser: User = {
          id: "123456",
          email: email,
          user_metadata: {
            full_name: "Demo User",
          },
        };

        setUser(mockUser);
        setSession({ user: mockUser });
        localStorage.setItem("mockUser", JSON.stringify(mockUser));
        return { error: null };
      }
      return { error: { message: "Invalid login credentials" } };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    try {
      // Mock successful signup
      if (email && password) {
        // In a real app, we would create the user in Supabase
        // For demo, we'll just return success
        return { error: null };
      }
      return { error: { message: "Invalid signup data" } };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("mockUser");
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      // Mock password reset
      if (email) {
        return { error: null };
      }
      return { error: { message: "Invalid email" } };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
