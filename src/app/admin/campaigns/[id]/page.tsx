import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function CampaignDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: campaign } = await supabase
    .from('newsletter_campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (!campaign) notFound();

  const { data: sends } = await supabase
    .from('newsletter_sends')
    .select('email, status, sent_at, opened_at, error')
    .eq('campaign_id', id)
    .order('sent_at', { ascending: false })
    .limit(100);

  const failed   = sends?.filter((s) => s.status === 'failed').length ?? 0;
  const openRate = campaign.sent_count > 0 ? Math.round(campaign.open_count / campaign.sent_count * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      <div>
        <Link href="/admin/campaigns" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mb-1">
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          Volver a campañas
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900">{campaign.subject}</h1>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
            campaign.status === 'sent' ? 'bg-emerald-100 text-emerald-700' :
            campaign.status === 'draft' ? 'bg-slate-100 text-slate-600' :
            campaign.status === 'sending' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            {campaign.status === 'sent' ? 'Enviada' : campaign.status === 'draft' ? 'Borrador' : campaign.status === 'sending' ? 'Enviando' : 'Error'}
          </span>
          <span className="text-xs text-slate-400">
            {campaign.sent_at ? `Enviada el ${new Date(campaign.sent_at).toLocaleString('es-AR')}` : `Creada el ${new Date(campaign.created_at).toLocaleString('es-AR')}`}
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Enviados', value: campaign.sent_count, icon: 'send', color: 'text-sky-600' },
          { label: 'Aperturas', value: `${openRate}%`,      icon: 'visibility', color: 'text-emerald-600' },
          { label: 'Clicks',   value: campaign.click_count, icon: 'ads_click',  color: 'text-violet-600' },
          { label: 'Fallidos', value: failed,               icon: 'error',      color: 'text-red-600' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`material-symbols-outlined text-[16px] ${m.color}`}>{m.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{m.label}</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Vista previa</h2>
        <div
          className="border border-slate-100 rounded-xl p-6 bg-slate-50 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: campaign.content_html }}
        />
      </div>

      {/* Log de envíos */}
      {(sends?.length ?? 0) > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Log de envíos (últimos 100)</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Estado</th>
                <th className="px-4 py-2.5">Enviado</th>
                <th className="px-4 py-2.5">Abierto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sends?.map((s, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 text-slate-700 font-mono text-xs">{s.email}</td>
                  <td className="px-4 py-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      s.status === 'sent' ? 'bg-emerald-100 text-emerald-700' :
                      s.status === 'failed' ? 'bg-red-100 text-red-700' :
                      s.status === 'bounced' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {s.sent_at ? new Date(s.sent_at).toLocaleString('es-AR') : '—'}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {s.opened_at ? new Date(s.opened_at).toLocaleString('es-AR') : '—'}
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
