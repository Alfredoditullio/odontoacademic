import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { AdminSidebar } from './AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, display_name, avatar_color')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-5">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-red-500 text-[36px]">lock</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Acceso denegado</h2>
          <p className="text-sm text-slate-500 mb-5">No tenés permisos para acceder al panel de administración.</p>
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar displayName={profile.display_name ?? ''} avatarColor={profile.avatar_color ?? 'from-sky-500 to-cyan-500'} />
      <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
    </div>
  );
}
