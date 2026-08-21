import { createClient } from "@supabase/supabase-js";

const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(envUrl && envAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase 환경변수가 설정되지 않았어요. .env 파일에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY를 채워주세요."
  );
}

// 키가 없어도 앱 자체는 뜨도록, 형식만 유효한 자리표시자로 폴백 (실제 인증 호출은 에러로 반환됨)
export const supabase = createClient(
  envUrl || "https://placeholder.supabase.co",
  envAnonKey || "placeholder-anon-key"
);
