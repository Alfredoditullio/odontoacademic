import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let status: 'ok' | 'error' | 'notoken' = 'notoken';
  let email = '';

  if (token) {
    const { data } = await supabase
      .from('profiles')
      .select('email')
      .eq('unsubscribe_token', token)
      .single();

    if (data) {
      email = data.email ?? '';
      const { error } = await supabase
        .from('profiles')
        .update({ newsletter_subscribed: false })
        .eq('unsubscribe_token', token);
      status = error ? 'error' : 'ok';
    } else {
      status = 'error';
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-5 py-10">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        {status === 'ok' && (
          <>
            <div className="size-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-emerald-500 text-[32px]">check_circle</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mb-2">Te diste de baja correctamente</h1>
            <p className="text-sm text-slate-500 mb-1">Ya no recibirás más newsletters de OdontoLatam.</p>
            {email && <p className="text-xs text-slate-400 mb-6">{email}</p>}
            <p className="text-xs text-slate-400 mb-6">
              Si cambiás de opinión, podés volver a suscribirte desde tu perfil en cualquier momento.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-500 text-[32px]">error</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mb-2">Link inválido</h1>
            <p className="text-sm text-slate-500 mb-6">
              El link de desuscripción no es válido o ya expiró. Si querés darte de baja, contactanos.
            </p>
          </>
        )}

        {status === 'notoken' && (
          <>
            <div className="size-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-amber-500 text-[32px]">warning</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mb-2">Token faltante</h1>
            <p className="text-sm text-slate-500 mb-6">
              Para darte de baja necesitás usar el link que viene en los emails.
            </p>
          </>
        )}

        <Link href="/" className="inline-flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
