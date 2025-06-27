// hooks/auth/use-auth.ts
"use client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import supabase from "@/lib/supabase/supabase-client";

interface AuthUser extends User {
  first_name?: string;
  last_name?: string;
  user_type?: "client" | "expert";
}

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isClient: boolean;
  isExpert: boolean;
  userInitials: string;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setUser(null);
        } else if (session?.user) {
          // Fetch additional user data from your users table
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await fetchUserProfile(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data from your database
  const fetchUserProfile = async (authUser: User) => {
    try {
      // First check user_metadata for user_type (most reliable)
      const userTypeFromMetadata = authUser.user_metadata?.user_type;

      if (userTypeFromMetadata === "expert") {
        // Get expert data
        let { data: expertData, error: expertError } = await supabase
          .from("experts")
          .select("first_name, last_name, email, profile_picture_url, status")
          .eq("auth_user_id", authUser.id)
          .single();

        if (expertData && !expertError) {
          setUser({
            ...authUser,
            first_name: expertData.first_name,
            last_name: expertData.last_name,
            user_type: "expert",
          });
          return;
        }
      }

      // If not expert or metadata says client, check clients table
      let { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("first_name, last_name, email, profile_picture_url")
        .eq("id", authUser.id)
        .single();

      if (clientData && !clientError) {
        setUser({
          ...authUser,
          first_name: clientData.first_name,
          last_name: clientData.last_name,
          user_type: "client",
        });
        return;
      }

      // Fallback: check if they're an expert without metadata
      let { data: expertData, error: expertError } = await supabase
        .from("experts")
        .select("first_name, last_name, email, profile_picture_url, status")
        .eq("auth_user_id", authUser.id)
        .single();

      if (expertData && !expertError) {
        setUser({
          ...authUser,
          first_name: expertData.first_name,
          last_name: expertData.last_name,
          user_type: "expert",
        });
        return;
      }

      // If not found in either table, default to client
      setUser({
        ...authUser,
        first_name: authUser.user_metadata?.first_name || "",
        last_name: authUser.user_metadata?.last_name || "",
        user_type: "client",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Fallback to auth user data
      setUser({
        ...authUser,
        first_name: authUser.user_metadata?.first_name || "",
        last_name: authUser.user_metadata?.last_name || "",
        user_type: "client",
      });
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error in signOut:", error);
    }
  };

  // Get user initials
  const getUserInitials = (): string => {
    if (!user) return "U";

    const firstName = user.first_name || "";
    const lastName = user.last_name || "";

    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isClient: user?.user_type === "client",
    isExpert: user?.user_type === "expert",
    userInitials: getUserInitials(),
    signOut,
  };
};
