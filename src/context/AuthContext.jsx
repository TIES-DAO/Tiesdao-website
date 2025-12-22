import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState({ current: 0, best: 0, lastCheckIn: null });

  // Fetch profile
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
    if (!error) setProfile(data);
  };

  // Fetch streak
  const fetchStreak = async (userId) => {
    const { data, error } = await supabase.from("daily_streaks").select("*").eq("user_id", userId).single();
    if (!error && data) setStreak({ current: data.current_streak, best: data.best_streak, lastCheckIn: data.last_check_in });
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        await fetchProfile(sessionUser.id);
        await fetchStreak(sessionUser.id);
      }
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        await fetchProfile(sessionUser.id);
        await fetchStreak(sessionUser.id);
      } else {
        setProfile(null);
        setStreak({ current: 0, best: 0, lastCheckIn: null });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // SIGN UP
  const signUp = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };

    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: data.user.id,
      username,
      role: "user",
    });

    // Initialize streak
    await supabase.from("daily_streaks").insert({
      user_id: data.user.id,
      current_streak: 0,
      best_streak: 0,
    });

    if (profileError) return { error: profileError };

    await fetchProfile(data.user.id);
    await fetchStreak(data.user.id);
    return { user: data.user };
  };

  // SIGN IN
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };

    await fetchProfile(data.user.id);
    await fetchStreak(data.user.id);
    return { user: data.user };
  };

  // SIGN OUT
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setStreak({ current: 0, best: 0, lastCheckIn: null });
  };

  return (
    <AuthContext.Provider value={{ user, profile, streak, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
