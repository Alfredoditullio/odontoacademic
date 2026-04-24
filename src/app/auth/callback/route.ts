import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request & { cookies: { getAll: () => { name: string; value: string }[] } }) {
  const { searchParams, origin } = new URL(request.url);

  const code       = searchParams.get('code');        // OAuth PKCE
  const token_hash = searchParams.get('token_hash');  // Email confirmation
  const type       = searchParams.get('type');        // 'email' | 'recovery' | etc.

  const redirectTo = NextResponse.redirect(`${origin}/comunidad`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            redirectTo.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // ── Confirmación de email (signup, recovery, etc.) ──
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as EmailOtpType,
    });
    if (!error) return redirectTo;
  }

  // ── OAuth PKCE (Google, etc.) ──
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return redirectTo;
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
