import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Profile } from "../types";

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, name, email")
      .eq("id", userId)
      .single();
    setProfile(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const updateName = useCallback(
    async (name: string) => {
      if (!userId) return "로그인이 필요해요";
      const { error } = await supabase.from("profiles").update({ name }).eq("id", userId);
      if (error) return error.message;
      setProfile((prev) => (prev ? { ...prev, name } : prev));
      return null;
    },
    [userId]
  );

  return { profile, loading, updateName };
}
