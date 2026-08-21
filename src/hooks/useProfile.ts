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

    // 로그인 직후에는 세션 토큰이 아직 완전히 준비되지 않아 첫 요청이 401로 실패할 수 있어 한 번 재시도
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email")
        .eq("id", userId)
        .single();
      if (!error) {
        setProfile(data);
        setLoading(false);
        return;
      }
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setProfile(null);
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
