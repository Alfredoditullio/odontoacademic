'use client';

import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  role: string;
  specialty: string | null;
  country: string | null;
  newsletter_subscribed: boolean;
  created_at: string;
  avatar_color: string;
}

type FilterStatus = 'all' | 'subscribed' | 'unsubscribed';

function initials(name: string | null) {
  return (name ?? 'OL').trim().split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'OL';
}

export function SubscribersTable({ profiles }: { profiles: Profile[] }) {
  const [data, setData]       = useState(profiles);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState<FilterStatus>('all');
  const [country, setCountry] = useState<string>('all');

  const countries = useMemo(() => {
    return Array.from(new Set(profiles.map((p) => p.country).filter(Boolean))).sort() as string[];
  }, [profiles]);

  const filtered = useMemo(() => {
    return data.filter((p) => {
      if (status === 'subscribed' && !p.newsletter_subscribed) return false;
      if (status === 'unsubscribed' && p.newsletter_subscribed) return false;
      if (country !== 'all' && p.country !== country) return false;
      if (search) {
        const q = search.toLowerCase();
        const hit =
          p.display_name?.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q) ||
          p.specialty?.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [data, search, status, country]);

  const stats = useMemo(() => ({
    total: data.length,
    subscribed: data.filter((p) => p.newsletter_subscribed).length,
    unsubscribed: data.filter((p) => !p.newsletter_subscribed).length,
  }), [data]);

  async function toggleSubscribed(id: string, current: boolean) {
    const { error } = await supabase
      .from('profiles')
      .update({ newsletter_subscribed: !current })
      .eq('id', id);
    if (!error) {
      setData((prev) => prev.map((p) => p.id === id ? { ...p, newsletter_subscribed: !current } : p));
    }
  }

  function exportCsv() {
    const subs = filtered.filter((p) => p.newsletter_subscribed);
    const rows = [
      ['email', 'nombre', 'rol', 'especialidad', 'pais', 'fecha_registro'],
      ...subs.map((p) => [p.email ?? '', p.display_name ?? '', p.role, p.specialty ?? '', p.country ?? '', p.created_at]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suscriptores-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-3">
          <div className="text-xs text-slate-500 font-medium">Total</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-3">
          <div className="text-xs text-emerald-600 font-medium">Suscritos</div>
          <div className="text-xl font-extrabold text-emerald-700">{stats.subscribed}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-3">
          <div className="text-xs text-slate-500 font-medium">Desuscritos</div>
          <div className="text-xl font-extrabold text-slate-600">{stats.unsubscribed}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-400">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email, especialidad..."
            className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as FilterStatus)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="all">Todos</option>
          <option value="subscribed">Suscritos</option>
          <option value="unsubscribed">Desuscritos</option>
        </select>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="all">Todos los países</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          Exportar CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">País</th>
                <th className="px-4 py-3">Registrado</th>
                <th className="px-4 py-3 text-center">Newsletter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                    No se encontraron usuarios con esos filtros.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`size-8 rounded-full bg-gradient-to-br ${p.avatar_color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                          {initials(p.display_name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{p.display_name || '—'}</p>
                          <p className="text-[11px] text-slate-400 truncate">{p.specialty ?? (p.role === 'student' ? 'Estudiante' : '—')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 truncate max-w-[220px]">{p.email ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                        p.role === 'student' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                      }`}>
                        {p.role === 'student' ? 'Estudiante' : 'Profesional'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{p.country ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(p.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleSubscribed(p.id, p.newsletter_subscribed)}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full transition ${
                          p.newsletter_subscribed
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Click para alternar estado"
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {p.newsletter_subscribed ? 'check_circle' : 'cancel'}
                        </span>
                        {p.newsletter_subscribed ? 'Suscrito' : 'Desuscrito'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 border-t border-slate-100 text-[11px] text-slate-400">
          Mostrando {filtered.length} de {data.length} usuarios
        </div>
      </div>
    </div>
  );
}
