import { createSupabaseServerClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function CampaignsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: campaigns } = await supabase
    .from('newsletter_campaigns')
    .select('id, subject, status, sent_count, open_count, click_count, created_at, sent_at')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Campañas</h1>
          <p className="text-sm text-slate-500 mt-0.5">Creá y gestioná los envíos de newsletter.</p>
        </div>
        <Link
          href="/admin/campaigns/nueva"
          className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nueva campaña
        </Link>
      </div>

      {(campaigns?.length ?? 0) === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
          <div className="size-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-slate-400 text-[28px]">mail</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Todavía no creaste ninguna campaña</h3>
          <p className="text-sm text-slate-500 mb-5">Creá tu primera campaña para enviar un email a tus suscriptores.</p>
          <Link
            href="/admin/campaigns/nueva"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Crear mi primera campaña
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Asunto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Enviados</th>
                <th className="px-4 py-3 text-right">Apertura</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns?.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <Link href={`/admin/campaigns/${c.id}`} className="text-sm font-semibold text-slate-800 hover:text-primary transition">
                      {c.subject}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      c.status === 'sent' ? 'bg-emerald-100 text-emerald-700' :
                      c.status === 'draft' ? 'bg-slate-100 text-slate-600' :
                      c.status === 'sending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {c.status === 'sent' ? 'Enviada' : c.status === 'draft' ? 'Borrador' : c.status === 'sending' ? 'Enviando' : 'Error'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-700">{c.sent_count}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-600">
                    {c.sent_count > 0 ? `${Math.round(c.open_count / c.sent_count * 100)}%` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-600">
                    {c.sent_count > 0 ? `${Math.round(c.click_count / c.sent_count * 100)}%` : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {c.sent_at
                      ? new Date(c.sent_at).toLocaleDateString('es-AR')
                      : new Date(c.created_at).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
