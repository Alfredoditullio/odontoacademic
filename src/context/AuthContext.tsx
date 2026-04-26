'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { type User, type Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  display_name: string;
  role: 'professional' | 'student';
  specialty: string | null;
  country: string | null;
  bio: string | null;
  avatar_url: string | null;
  avatar_color: string;
  handle: string | null;
  verified: boolean;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

const PROTECTED_PREFIXES = ['/comunidad', '/admin'];

function isProtectedRoute(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * Detecta si un error de Supabase indica que el refresh token ya no es válido
 * (vencido, rotado, o no existe en el server). En ese caso conviene limpiar
 * la sesión local y mandar al login si estamos en ruta protegida.
 */
function isInvalidRefreshTokenError(err: unknown): boolean {
  if (!err) return false;
  if (err instanceof AuthError) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes('refresh token') ||
      msg.includes('invalid_grant') ||
      msg.includes('jwt expired')
    );
  }
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return msg.includes('refresh token') || msg.includes('invalid_grant');
  }
  return false;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        // No bloqueamos la UI por errores de red al traer el perfil
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthContext] fetchProfile error:', error.message);
        }
        return;
      }
      if (data) setProfile(data as Profile);
    } catch (err) {
      // Network error o similar — silencioso, el SDK reintenta
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AuthContext] fetchProfile network error:', err);
      }
    }
  }

  /** Limpia la sesión local y, si estamos en ruta protegida, manda al login. */
  async function clearStaleSession() {
    try {
      // scope: 'local' → no llama al endpoint /logout (que también podría fallar),
      // sólo borra cookies y state del cliente.
      await supabase.auth.signOut({ scope: 'local' });
    } catch {
      /* no-op */
    }
    setSession(null);
    setUser(null);
    setProfile(null);

    if (typeof window !== 'undefined' && isProtectedRoute(window.location.pathname)) {
      window.location.href = '/login';
    }
  }

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;

        if (error) {
          if (isInvalidRefreshTokenError(error)) {
            await clearStaleSession();
          } else if (process.env.NODE_ENV === 'development') {
            console.warn('[AuthContext] getSession error:', error.message);
          }
          setLoading(false);
          return;
        }

        const s = data.session;
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) await fetchProfile(s.user.id);
      } catch (err) {
        // Network error en el primer getSession — no rompemos la UI
        if (isInvalidRefreshTokenError(err)) {
          await clearStaleSession();
        } else if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthContext] bootstrap network error:', err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    bootstrap();

    // El SDK emite SIGNED_OUT automáticamente cuando el refresh token es
    // inválido o el server lo rechaza. Lo aprovechamos para limpiar y redirigir.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_OUT') {
        setProfile(null);
        if (typeof window !== 'undefined' && isProtectedRoute(window.location.pathname)) {
          window.location.href = '/login';
        }
        return;
      }

      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    // Si la pestaña vuelve a estar visible después de un rato (laptop suspendida,
    // pestaña en background), forzamos un refresh proactivo para detectar
    // tokens inválidos antes de que el usuario haga una acción que falle.
    function onVisible() {
      if (document.visibilityState !== 'visible') return;
      supabase.auth.getSession().catch(async (err) => {
        if (isInvalidRefreshTokenError(err)) await clearStaleSession();
      });
    }
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch {
      // Si el server no responde igual queremos cerrar sesión local
      await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
    }
    window.location.href = '/';
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
