"use client";

import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/supabase-client";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loadingAuth?: boolean;
  updateUserSession: () => Promise<unknown>;
  signOut: () => Promise<unknown>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loadingAuth: true,
  updateUserSession: () =>
    new Promise((res) => {
      res(false);
    }),
  signOut: () =>
    new Promise((res) => {
      res(false);
    }),
});

type AuthProviderProps = {
  children: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // to prevent flickering of auth state

  const router = useRouter();

  const supabase = createSupabaseClient();

  async function updateUserSession() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    setSession(session);
    setLoadingAuth(false);
  }

  useEffect(() => {
    // update session and user on mount
    updateUserSession();
  }, []);

  //   useEffect(() => {
  //     const { data: authListener } = supabase.auth.onAuthStateChange(
  //       async (event: AuthChangeEvent, currentSession: Session | null) => {
  //         if (event !== "SIGNED_IN") {
  //           updateUserSession();
  //         }
  //       }
  //     );

  //     return () => {
  //       authListener?.subscription.unsubscribe();
  //     };
  //   }, []);

  // store session, user, updateUserSession, and signOut function in context
  const value = useMemo(
    () => ({
      session,
      user,
      loadingAuth,
      updateUserSession,
      signOut: () =>
        supabase.auth
          .signOut({ scope: "local" })
          .then((res) => {
            if (res.error) throw new Error(res.error.message);

            router.replace("/");

            // reset session and user state
            setSession(null);
            setUser(null);

            // send toast
            toast("Signed out successfully", {
              description: "You have been signed out.",
              duration: 5000,
              action: {
                label: "Sign in",
                onClick: () => {
                  router.push("/auth/signin");
                },
              },
            });
          })
          .catch(async (err) => {
            const { error } = await supabase.auth.refreshSession();

            if (error) {
              router.refresh();
            }
          }),
    }),
    [session, supabase.auth, user, loadingAuth, router]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
