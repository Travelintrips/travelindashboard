import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    userData: any,
  ) => Promise<{ error: any; user: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  userRole: string | null;
  setUserRole: (role: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Using named export with const for consistent component exports
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    console.log("AuthProvider initializing...");

    // Track if the component is mounted to prevent state updates after unmount
    let isMounted = true;

    // Track the current user ID to prevent duplicate profile fetches
    let currentUserId: string | null = null;

    // Flag to track if we've already processed an auth state change
    let initialAuthProcessed = false;

    // Function to handle profile loading with retry logic
    const loadProfileWithRetry = async (userId: string, retryCount = 0) => {
      if (!isMounted) return;

      try {
        console.log(
          `Attempting to fetch profile (attempt ${retryCount + 1})...`,
        );
        const role = await fetchProfile(userId);

        if (!isMounted) return;

        if (role && role !== "Tamu") {
          console.log(`Profile fetched successfully with role: ${role}`);
          setLoading(false);
          initialAuthProcessed = true;
        } else if (retryCount < 2) {
          // Retry up to 3 times (0, 1, 2)
          console.log(
            `Role not found or is default, retrying... (${retryCount + 1}/3)`,
          );
          // Wait a bit before retrying
          setTimeout(() => loadProfileWithRetry(userId, retryCount + 1), 1000);
        } else {
          console.log("Max retries reached, proceeding with current role");
          setLoading(false);
          initialAuthProcessed = true;
        }
      } catch (error) {
        if (!isMounted) return;
        console.error(
          `Error in fetchProfile (attempt ${retryCount + 1}):`,
          error,
        );

        if (retryCount < 2) {
          // Retry up to 3 times
          console.log(`Retrying after error... (${retryCount + 1}/3)`);
          setTimeout(() => loadProfileWithRetry(userId, retryCount + 1), 1000);
        } else {
          console.log("Max retries reached after errors, using default role");
          setUserRole("Tamu");
          setLoading(false);
          initialAuthProcessed = true;
        }
      }
    };

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;

        console.log(
          "Initial session:",
          session ? "Session exists" : "No session",
        );
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Store the current user ID
          currentUserId = session.user.id;

          console.log("User found in session, fetching profile...");
          loadProfileWithRetry(session.user.id);
        } else {
          console.log("No user in session, setting loading to false");
          setLoading(false);
          initialAuthProcessed = true;
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Error getting session:", error);
        setLoading(false);
        initialAuthProcessed = true;
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      // Skip redundant auth state changes if we've already processed the initial auth
      // or if it's the same user we're already processing
      if (
        (initialAuthProcessed &&
          event === "SIGNED_IN" &&
          session?.user?.id === user?.id) ||
        (session?.user?.id && session.user.id === currentUserId)
      ) {
        console.log(
          "Skipping redundant auth state change for already signed-in user",
        );
        return;
      }

      console.log(
        "Auth state changed:",
        event,
        session ? "session exists" : "no session",
      );

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Update the current user ID to prevent duplicate fetches
        currentUserId = session.user.id;

        console.log("User found in auth state change, fetching profile...");
        // Use the retry logic for auth state changes too
        loadProfileWithRetry(session.user.id);
      } else {
        // Clear the current user ID
        currentUserId = null;

        console.log("No user in auth state change, clearing profile and role");
        setProfile(null);
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      // Direct query to get both profile and role information
      const { data, error } = await supabase
        .from("profiles")
        .select("*, roles(name)")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        // Set a default role even if there's an error to prevent getting stuck
        setUserRole("Tamu");
        return;
      }

      console.log("Profile data received:", data);
      setProfile(data);

      // Debug the profile data to see what's available
      console.log(
        "Full profile data structure:",
        JSON.stringify(data, null, 2),
      );

      // Determine the role with clear fallback logic
      let role = "Tamu"; // Default role

      // Check for role in the profile data - prioritize direct role field
      if (data?.role && typeof data.role === "string") {
        console.log("Setting role from direct role field:", data.role);
        role = data.role;
      } else if (data?.roles?.name && typeof data.roles.name === "string") {
        console.log("Setting role from roles relation:", data.roles.name);
        role = data.roles.name;
      } else {
        console.log("No valid role found, using default role: Tamu");

        // If no role is found, make a direct query to the roles table using role_id
        if (data?.role_id) {
          console.log("Attempting to fetch role using role_id:", data.role_id);
          const { data: roleData, error: roleError } = await supabase
            .from("roles")
            .select("name")
            .eq("id", data.role_id)
            .single();

          if (!roleError && roleData?.name) {
            console.log("Found role from direct query:", roleData.name);
            role = roleData.name;
          }
        }
      }

      // Set the role state
      setUserRole(role);
      console.log("Final user role set to:", role);

      // If no valid role was found in the profile, update the profile with the default role
      if (role === "Tamu" && (!data?.role || data.role === null)) {
        console.log("Updating profile with default role");
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: "Tamu" })
          .eq("id", userId);

        if (updateError) {
          console.error(
            "Error updating profile with default role:",
            updateError,
          );
        }
      }

      return role; // Return the role for immediate use
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Set a default role even if there's an error to prevent getting stuck
      setUserRole("Tamu");
      throw error; // Re-throw to be caught by the caller
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Check for placeholder URL in development
      if (!import.meta.env.PROD && (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder-url'))) {
        console.warn('Development mode using placeholder Supabase URL - authentication will fail');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Handle network errors specifically
      if (error?.message.includes('Failed to fetch')) {
        console.error('Network error - check Supabase connection');
        return { error: new Error('Unable to connect to authentication server') };
      }

      return { error };
    } catch (error) {
      console.error("Error signing in:", error);
      // Add retry logic for network errors
      if (error instanceof Error && error.message.includes('Network')) {
        console.log('Attempting network error retry...');
        return await signIn(email, password);
      }
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || "Tamu",
          },
        },
      });

      if (authError) {
        return { error: authError, user: null };
      }

      if (authData.user) {
        // The profile will be created automatically by the database trigger
        // We'll update the user's metadata with additional information
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            name: userData.name,
            role: userData.role || "Tamu",
            status: userData.status || "active",
          },
        });

        if (updateError) {
          console.error("Error updating user metadata:", updateError);
          return { error: updateError, user: authData.user };
        }

        return { error: null, user: authData.user };
      }

      return { error: new Error("User creation failed"), user: null };
    } catch (error) {
      console.error("Error signing up:", error);
      return { error, user: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setUserRole(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    session,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    loading,
    userRole,
    setUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Using named export with const for consistent hook exports
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
