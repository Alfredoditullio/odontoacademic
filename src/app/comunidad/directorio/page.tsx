'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_PROFILES } from '@/data/mock-community';
import { initials } from '@/lib/utils';

const SPECIALTIES = ['Todas', 'Implantología', 'Periodoncia', 'Radiología Oral', 'Ortodoncia', 'Endodoncia', 'Estética Dental', 'Odontología General'];
const COUNTRIES = ['Todos', 'Argentina', 'México', 'Colombia', 'Chile', 'Perú', 'Ecuador'];

export default function DirectorioPage() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('Todas');
  const [country, setCountry] = useState('Todos');

  const filtered = MOCK_PROFILES.filter((p) => {
    if (search && !p.display_name.toLowerCase().includes(search.toLowerCase()) && !p.specialty?.toLowerCase().includes(search.toLowerCase())) return false;
    if (specialty !== 'Todas' && p.specialty !== specialty) return false;
    if (country !== 'Todos' && p.country !== country) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="material-symbols-outlined text-primary text-[28px]">group</span>
          <h1 className="text-xl font-black text-slate-900">Directorio de Profesionales</h1>
        </div>
        <p className="text-sm text-slate-500 ml-[40px]">
          Encontrá colegas por especialidad, país o ciudad. Ideal para derivaciones y networking.
        </p>

        <div className="mt-4 space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o especialidad..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              {SPECIALTIES.map((s) => <option key={s} value={s}>{s === 'Todas' ? 'Especialidad' : s}</option>)}
            </select>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              {COUNTRIES.map((c) => <option key={c} value={c}>{c === 'Todos' ? 'País' : c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-bold px-1">{filtered.length} profesionales</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((p) => (
          <Link
            key={p.user_id}
            href={`/comunidad/u/${p.handle}`}
            className="bg-white rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-sm transition p-5"
          >
            <div className="flex items-start gap-3">
              <div className="size-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                <span className="text-primary font-black text-base">{initials(p.display_name)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 truncate text-[15px]">{p.display_name}</h3>
                  {p.reputation_points >= 200 && (
                    <span className="material-symbols-outlined text-[16px] text-amber-500">military_tech</span>
                  )}
                </div>
                {p.specialty && (
                  <div className="text-xs text-primary font-semibold mt-0.5">{p.specialty}</div>
                )}
              </div>
              <div className="shrink-0 text-center pl-2">
                <div className="text-lg font-black text-primary leading-tight">{p.reputation_points}</div>
                <div className="text-[10px] text-slate-400 font-bold">pts</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400 flex-wrap">
              {p.country && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">location_on</span>
                  {p.city ? `${p.city}, ${p.country}` : p.country}
                </span>
              )}
              {p.accepts_referrals && (
                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                  <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                  Derivaciones
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">group</span>
                {p.follower_count}
              </span>
            </div>
            {p.bio && <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{p.bio}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
