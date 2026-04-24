import { createBrowserClient } from '@supabase/ssr';

// Browser client que guarda la sesión en cookies (compatible con middleware SSR)
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
