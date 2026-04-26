/**
 * Directorio de profesionales. Server Component:
 *  - Lectura paginada de `profiles` ordenada por reputación + followers.
 *  - Filtros via search params (?search=&specialty=&country=).
 *  - Cada card linkea al perfil real y al chat directo.
 */

import Link from 'next/link';
import { searchDirectory } from '@/lib/queries/community';
import { initials } from '@/lib/utils';

export const metadata = { title: 'Directorio de Profesionales' };
export const revalidate = 60;

const SPECIALTIES = ['Implantología', 'Periodoncia', 'Radiología Oral', 'Ortodoncia', 'Endodoncia', 'Estética Dental', 'Odontología General', 'Cirugía Oral y Maxilofacial', 'Rehabilitación Oral', 'Odontopediatría'];
const COUNTRIES   = ['Argentina', 'México', 'Colombia', 'Chile', 'Perú', 'Ecuador', 'Uruguay', 'Bolivia', 'Paraguay', 'Brasil', 'España', 'Venezuela'];

interface SearchParams {
  search?: string;
  specialty?: string;
  country?: string;
}

export default async function DirectorioPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const profiles = await searchDirectory({
    search:    sp.search    || undefined,
    specialty: sp.specialty || undefined,
    country:   sp.country   || undefined,
    limit:     60,
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

        {/* Form GET — filtros via URL params (cacheable + shareable). */}
        <form className="mt-4 space-y-3" action="/comunidad/directorio" method="get">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              name="search"
              defaultValue={sp.search ?? ''}
              placeholder="Nombre o handle…"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              name="specialty"
              defaultValue={sp.specialty ?? ''}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todas las especialidades</option>
              {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              name="country"
              defaultValue={sp.country ?? ''}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todos los países</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              type="submit"
              className="bg-primary text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition"
            >
              Filtrar
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <p className="text-sm text-slate-500 px-1">
        {profiles.length === 0 ? 'Sin resultados' : `${profiles.length} ${profiles.length === 1 ? 'profesional' : 'profesionales'}`}
      </p>

      {profiles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-[40px] text-slate-300">person_search</span>
          <p className="text-slate-500 mt-2">No hay profesionales con esos filtros.</p>
          <Link href="/comunidad/directorio" className="text-primary font-semibold text-sm hover:underline mt-2 inline-block">
            Limpiar filtros
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profiles.map((p) => (
            <Link
              key={p.user_id}
              href={`/comunidad/u/${p.handle}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition group"
            >
              <div className="flex items-start gap-3">
                <div className={`size-14 rounded-2xl bg-gradient-to-br ${p.role === 'student' ? 'from-indigo-500 to-violet-600' : 'from-sky-500 to-teal-600'} flex items-center justify-center font-black text-white text-lg shrink-0 overflow-hidden`}>
                  {p.avatar_url
                    /* eslint-disable-next-line @next/next/no-img-element */
                    ? <img src={p.avatar_url} alt="" className="size-full object-cover" />
                    : initials(p.display_name)
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate group-hover:text-primary transition">
                    {p.display_name}
                  </h3>
                  {p.handle && <p className="text-xs text-slate-400 truncate">@{p.handle}</p>}
                  <p className="text-xs text-slate-600 truncate mt-1">
                    {p.role === 'student'
                      ? `${p.university ?? 'Estudiante'}${p.study_year ? ` · ${p.study_year}° año` : ''}`
                      : (p.specialty ?? 'Sin especialidad')
                    }
                  </p>
                  {(p.country || p.city) && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      {[p.city, p.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <span><strong className="text-slate-900">{p.follower_count}</strong> seguidores</span>
                {p.accepts_referrals && (
                  <span className="text-emerald-600 font-semibold flex items-center gap-0.5 ml-auto">
                    <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                    Acepta derivaciones
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
