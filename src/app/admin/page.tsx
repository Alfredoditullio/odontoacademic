import { createSupabaseServerClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();

  // Métricas
  const [
    { count: totalUsers },
    { count: subscribedUsers },
    { count: totalCampaigns },
    { count: sentCampaigns },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('newsletter_subscribed', true),
    supabase.from('newsletter_campaigns').select('*', { count: 'exact', head: true }),
    supabase.from('newsletter_campaigns').select('*', { count: 'exact', head: true }).eq('status', 'sent'),
  ]);

  const unsubscribed = (totalUsers ?? 0) - (subscribedUsers ?? 0);
  const subscribeRate = totalUsers ? Math.round((subscribedUsers ?? 0) / totalUsers * 100) : 0;

  // Últimos usuarios
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, display_name, role, country, specialty, newsletter_subscribed, created_at, avatar_color')
    .order('created_at', { ascending: false })
    .limit(5);

  // Últimas campañas
  const { data: recentCampaigns } = await supabase
    .from('newsletter_campaigns')
    .select('id, subject, status, sent_count, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const metrics = [
    { label: 'Usuarios totales', value: totalUsers ?? 0, icon: 'group', gradient: 'from-sky-500 to-cyan-500' },
    { label: 'Suscriptores activos', value: subscribedUsers ?? 0, icon: 'mark_email_read', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Desuscritos', value: unsubscribed, icon: 'unsubscribe', gradient: 'from-slate-400 to-slate-500' },
    { label: 'Tasa de suscripción', value: `${subscribeRate}%`, icon: 'trending_up', gradient: 'from-violet-500 to-purple-500' },
    { label: 'Campañas creadas', value: totalCampaigns ?? 0, icon: 'campaign', gradient: 'from-amber-500 to-orange-500' },
    { label: 'Campañas enviadas', value: sentCampaigns ?? 0, icon: 'send', gradient: 'from-rose-500 to-pink-500' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Métricas generales del CRM de newsletter.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className={`size-10 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center mb-3`}>
              <span className="material-symbols-outlined text-white text-[20px]">{m.icon}</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{m.value}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Campañas + Usuarios recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campañas recientes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Últimas campañas</h2>
            <Link href="/admin/campaigns" className="text-xs text-primary font-semibold hover:underline">
              Ver todas →
            </Link>
          </div>
          {(recentCampaigns?.length ?? 0) === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              <span className="material-symbols-outlined text-[36px] text-slate-300 mb-2 block">mail</span>
              Todavía no creaste ninguna campaña
            </div>
          ) : (
            <div className="space-y-2">
              {recentCampaigns?.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/campaigns/${c.id}`}
                  className="block px-3 py-2.5 rounded-xl hover:bg-slate-50 transition border border-slate-100"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 truncate">{c.subject}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
                      c.status === 'sent' ? 'bg-emerald-100 text-emerald-700' :
                      c.status === 'draft' ? 'bg-slate-100 text-slate-600' :
                      c.status === 'sending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {c.status === 'sent' ? 'Enviada' : c.status === 'draft' ? 'Borrador' : c.status === 'sending' ? 'Enviando' : 'Error'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{c.sent_count} enviados · {new Date(c.created_at).toLocaleDateString('es-AR')}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Usuarios recientes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Usuarios recientes</h2>
            <Link href="/admin/suscriptores" className="text-xs text-primary font-semibold hover:underline">
              Ver todos →
            </Link>
          </div>
          {(recentUsers?.length ?? 0) === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              <span className="material-symbols-outlined text-[36px] text-slate-300 mb-2 block">person</span>
              No hay usuarios registrados todavía
            </div>
          ) : (
            <div className="space-y-2">
              {recentUsers?.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-100">
                  <div className={`size-8 rounded-full bg-gradient-to-br ${u.avatar_color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                    {u.display_name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'OL'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{u.display_name || 'Sin nombre'}</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {u.specialty ?? (u.role === 'student' ? 'Estudiante' : 'Odontólogo/a')} · {u.country ?? '—'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
                    u.newsletter_subscribed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {u.newsletter_subscribed ? 'Newsletter ON' : 'Newsletter OFF'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
