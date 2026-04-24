import { createSupabaseServerClient } from '@/lib/supabase-server';
import { SubscribersTable } from './SubscribersTable';

export default async function SuscriptoresPage() {
  const supabase = await createSupabaseServerClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, display_name, role, specialty, country, newsletter_subscribed, created_at, avatar_color')
    .order('created_at', { ascending: false });

return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Suscriptores</h1>
        <p className="text-sm text-slate-500 mt-0.5">Lista de todos los usuarios registrados y su estado de newsletter.</p>
      </div>

      <SubscribersTable profiles={profiles ?? []} />
    </div>
  );
}
