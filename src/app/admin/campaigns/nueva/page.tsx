'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const DEFAULT_TEMPLATE = `<p>Hola {{nombre}},</p>

<p>Acá va el contenido del email. Podés usar HTML básico: <strong>negrita</strong>, <em>cursiva</em>, <a href="https://odontolatam.com">enlaces</a>.</p>

<p>Saludos,<br/>El equipo de OdontoLatam</p>`;

export default function NuevaCampañaPage() {
  const router = useRouter();
  const [subject, setSubject]   = useState('');
  const [content, setContent]   = useState(DEFAULT_TEMPLATE);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [subCount, setSubCount] = useState(0);
  const [preview, setPreview]   = useState(false);

  useEffect(() => {
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('newsletter_subscribed', true)
      .then(({ count }) => setSubCount(count ?? 0));
  }, []);

  async function saveDraft() {
    setError('');
    setLoading(true);
    try {
      if (!subject.trim()) throw new Error('El asunto es obligatorio.');
      const { data, error } = await supabase
        .from('newsletter_campaigns')
        .insert({ subject: subject.trim(), content_html: content, status: 'draft' })
        .select('id')
        .single();
      if (error) throw error;
      router.push(`/admin/campaigns/${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar.');
    } finally {
      setLoading(false);
    }
  }

  async function sendNow() {
    if (!confirm(`¿Enviar esta campaña a ${subCount} suscriptores? Esta acción no se puede deshacer.`)) return;
    setError('');
    setLoading(true);
    try {
      if (!subject.trim()) throw new Error('El asunto es obligatorio.');

      // 1. Crear la campaña
      const { data: campaign, error: createErr } = await supabase
        .from('newsletter_campaigns')
        .insert({ subject: subject.trim(), content_html: content, status: 'draft' })
        .select('id')
        .single();
      if (createErr) throw createErr;

      // 2. Enviar via API
      const res = await fetch('/api/admin/send-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campaign.id }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Falló el envío');
      }

      router.push(`/admin/campaigns/${campaign.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/campaigns" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mb-1">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Volver a campañas
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Nueva campaña</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <span className="material-symbols-outlined text-red-500 text-[18px] shrink-0">error</span>
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-100 rounded-2xl px-5 py-4 flex items-center gap-4">
        <div className="size-10 rounded-xl bg-white flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[22px]">group</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{subCount} suscriptores activos</p>
          <p className="text-xs text-slate-500">Recibirán esta campaña cuando presiones "Enviar ahora".</p>
        </div>
      </div>

      {/* Subject */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Asunto *</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ej: Novedades de OdontoLatam - Semana del 24/04"
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <p className="text-[11px] text-slate-400 mt-1">Aparece en la bandeja de entrada. Máx. 80 caracteres recomendado.</p>
        </div>
      </div>

      {/* Content editor */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Contenido HTML *</label>
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-[14px]">{preview ? 'edit' : 'visibility'}</span>
            {preview ? 'Editar' : 'Vista previa'}
          </button>
        </div>

        {preview ? (
          <div
            className="border border-slate-200 rounded-xl p-6 bg-slate-50 min-h-[300px] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: content.replace(/{{nombre}}/g, 'Dr. Ejemplo'),
            }}
          />
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        )}

        <p className="text-[11px] text-slate-400">
          Variables disponibles: <code className="bg-slate-100 px-1 rounded">{'{{nombre}}'}</code> se reemplaza por el nombre del suscriptor.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={saveDraft}
          disabled={loading}
          className="flex items-center gap-2 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          Guardar borrador
        </button>
        <button
          onClick={sendNow}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? (
            <><span className="material-symbols-outlined text-[17px] animate-spin">progress_activity</span> Enviando...</>
          ) : (
            <><span className="material-symbols-outlined text-[17px]">send</span> Enviar ahora</>
          )}
        </button>
      </div>
    </div>
  );
}
