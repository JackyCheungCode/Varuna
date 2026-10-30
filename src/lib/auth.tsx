import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const supabaseClient: SupabaseClient | null = url && key ? createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
}) : null;

type AuthContextValue = {
  supabase: SupabaseClient | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session,setSession] = useState<Session | null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string | null>(null);
  useEffect(() => {
    if (!supabaseClient) { setLoading(false); return; }
    let active = true;
    supabaseClient.auth.getSession().then(({data,error:sessionError}) => {
      if (!active) return;
      if (sessionError) setError(sessionError.message);
      setSession(data.session);
      setLoading(false);
    }).catch((err: unknown) => {
      if (active) { setError(err instanceof Error ? err.message : "无法读取登录状态"); setLoading(false); }
    });
    const {data:{subscription}} = supabaseClient.auth.onAuthStateChange((_event,nextSession) => {
      setSession(nextSession);
      setError(null);
      setLoading(false);
    });
    return () => { active = false; subscription.unsubscribe(); };
  },[]);
  const value = useMemo<AuthContextValue>(() => ({
    supabase:supabaseClient, session, loading, error,
    signIn:async(email,password) => {
      if (!supabaseClient) return false;
      const {error:authError} = await supabaseClient.auth.signInWithPassword({email,password});
      setError(authError?.message ?? null);
      return !authError;
    },
    signUp:async(email,password) => {
      if (!supabaseClient) return false;
      const {error:authError} = await supabaseClient.auth.signUp({email,password});
      setError(authError?.message ?? null);
      return !authError;
    },
    signOut:async() => { if(supabaseClient) await supabaseClient.auth.signOut(); }
  }),[session,loading,error]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}