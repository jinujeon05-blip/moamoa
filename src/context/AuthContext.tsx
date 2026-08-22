import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signInWithProvider: (provider: "google" | "kakao") => Promise<string | null>;
  logout: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<string | null>;
  updatePassword: (newPassword: string) => Promise<string | null>;
  deleteAccount: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toUser(supabaseUser: SupabaseUser | null | undefined): User | null {
  if (!supabaseUser || !supabaseUser.email) return null;
  return {
    id: supabaseUser.id,
    name: supabaseUser.email.split("@")[0],
    email: supabaseUser.email,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setUser(toUser(data.session?.user));
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session?.user));
      setLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return { error: error.message, needsConfirmation: false };
        return { error: null, needsConfirmation: !data.session };
      },
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error?.message ?? null;
      },
      signInWithProvider: async (provider) => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: `${window.location.origin}/mypage` },
        });
        return error?.message ?? null;
      },
      logout: async () => {
        await supabase.auth.signOut();
      },
      resetPasswordForEmail: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        return error?.message ?? null;
      },
      updatePassword: async (newPassword) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        return error?.message ?? null;
      },
      deleteAccount: async () => {
        if (!user) return "로그인이 필요해요";
        const { data: files } = await supabase.storage.from("receipt-pdfs").list(user.id);
        if (files && files.length > 0) {
          await supabase.storage
            .from("receipt-pdfs")
            .remove(files.map((f) => `${user.id}/${f.name}`));
        }
        const { error } = await supabase.rpc("delete_own_account");
        if (error) return error.message;
        await supabase.auth.signOut();
        return null;
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
