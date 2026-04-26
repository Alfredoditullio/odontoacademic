/**
 * Lista de conversaciones del usuario actual. Server Component:
 *  - Una sola query a `conversations` con embed del otro participante.
 *  - Ordenada por `last_message_at desc`.
 *  - El badge de unread se lee de la columna mantenida por trigger
 *    (cero count() agregado).
 */

import Link from 'next/link';
import { getMyConversations } from '@/lib/queries/messaging';
import { initials, timeAgo } from '@/lib/utils';

export const metadata = { title: 'Mensajes' };

// Esta página es del usuario logueado, no se cachea entre usuarios.
export const dynamic = 'force-dynamic';

export default async function MensajesPage() {
  const conversations = await getMyConversations();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="material-symbols-outlined text-primary text-[28px]">mail</span>
          <h1 className="text-xl font-black text-slate-900">Mensajes</h1>
        </div>
        <p className="text-sm text-slate-500 ml-[40px]">
          Tus conversaciones privadas con colegas.
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-[40px] text-slate-300">forum</span>
          <p className="text-slate-500 mt-2">Todavía no tenés conversaciones.</p>
          <p className="text-sm text-slate-400 mt-1">
            Visitá el perfil de un colega y mandale un mensaje desde ahí.
          </p>
          <Link
            href="/comunidad/directorio"
            className="inline-flex items-center gap-1.5 mt-4 text-primary font-semibold text-sm hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            Explorar el directorio
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/comunidad/mensajes/${conv.other.handle}`}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition ${conv.unread > 0 ? 'bg-primary/5' : ''}`}
            >
              <div className={`size-12 rounded-full bg-gradient-to-br ${conv.other.avatar_color ?? 'from-sky-500 to-cyan-500'} flex items-center justify-center font-bold text-white shrink-0 overflow-hidden`}>
                {conv.other.avatar_url
                  ? <img src={conv.other.avatar_url} alt="" className="size-full object-cover" />
                  : initials(conv.other.display_name)
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm truncate ${conv.unread > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                    {conv.other.display_name}
                  </span>
                  {conv.last_message_at && (
                    <span className="text-[11px] text-slate-400 shrink-0">{timeAgo(conv.last_message_at)}</span>
                  )}
                </div>
                {conv.other.specialty && (
                  <div className="text-[11px] text-primary/70 font-medium">{conv.other.specialty}</div>
                )}
                {conv.last_message_preview ? (
                  <p className={`text-sm truncate mt-0.5 ${conv.unread > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                    {conv.last_sender_is_me && <span className="text-slate-400">Vos: </span>}
                    {conv.last_message_preview}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 italic mt-0.5">Sin mensajes todavía</p>
                )}
              </div>
              {conv.unread > 0 && (
                <span className="size-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {conv.unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
