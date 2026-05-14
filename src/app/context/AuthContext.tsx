import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { supabase } from '@/app/lib/supabase';
import type { AuthContextType, Profile } from '@/app/types/auth.types';

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Preia profilul din tabela `profiles` după email ───────────────────────
  const fetchProfile = useCallback(async (email: string): Promise<Profile | null> => {
  const normalizedEmail = email.toLowerCase().trim();
  
  console.log('[fetchProfile] Caut emailul:', normalizedEmail);

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', normalizedEmail)
    .single();

  console.log('[fetchProfile] data:', data);
  console.log('[fetchProfile] error:', error);

  if (error || !data) {
    console.error('[AuthContext] fetchProfile error:', error?.message);
    return null;
  }

  return data as Profile;
}, []);

  // ── Inițializare sesiune la pornirea aplicației ───────────────────────────
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        // Supabase citește automat sesiunea din localStorage
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user?.email && mounted) {
          const userProfile = await fetchProfile(session.user.email);
          if (mounted) setProfile(userProfile);
        }
      } catch (err) {
        console.error('[AuthContext] initSession error:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initSession();

    // Ascultă schimbările de sesiune (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          setProfile(null);
          setIsLoading(false);
          return;
        }

        if (session?.user?.email) {
          const userProfile = await fetchProfile(session.user.email);
          if (mounted) {
            setProfile(userProfile);
            setIsLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const normalizedEmail = email.toLowerCase().trim();

    // Pasul 1: cross-check în tabela `profiles`
    const existingProfile = await fetchProfile(normalizedEmail);
    if (!existingProfile) {
      throw new Error('Emailul nu există în baza de date.');
    }

    // Pasul 2: autentificare prin Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Parolă incorectă. Te rog încearcă din nou.');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Emailul nu a fost confirmat. Verifică căsuța de email.');
      }
      throw new Error(error.message);
    }

    if (!data.session) {
      throw new Error('Autentificarea a eșuat. Te rog încearcă din nou.');
    }

    // Pasul 3: setează profilul direct (onAuthStateChange îl setează și el,
    // dar îl setăm și direct pentru răspuns instant în UI)
    setProfile(existingProfile);
  }, [fetchProfile]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    } finally {
      setProfile(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      profile,
      isAuthenticated: !!profile,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth() trebuie folosit în interiorul unui <AuthProvider>');
  }
  return context;
}
