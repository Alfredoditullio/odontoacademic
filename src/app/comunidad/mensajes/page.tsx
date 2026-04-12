import Link from 'next/link';
import { MOCK_PROFILES } from '@/data/mock-community';
import { initials, timeAgo } from '@/lib/utils';

export const metadata = { title: 'Mensajes' };

const MOCK_CONVERSATIONS = [
  {
    other: MOCK_PROFILES[1],
    lastMessage: 'Hola Martín, te escribo por el caso que compartiste. Muy interesante la técnica de elevación bilateral.',
    lastAt: '2026-04-10T16:00:00Z',
    isSelf: false,
    unread: 2,
  },
  {
    other: MOCK_PROFILES[2],
    lastMessage: 'Gracias por el dato del paper de IA. Lo estoy revisando ahora.',
    lastAt: '2026-04-09T10:00:00Z',
    isSelf: true,
    unread: 0,
  },
  {
    other: MOCK_PROFILES[3],
    lastMessage: '¿Podrías compartir el protocolo que usás para mordida abierta con alineadores?',
    lastAt: '2026-04-07T14:30:00Z',
    isSelf: true,
    unread: 0,
  },
];

export default function MensajesPage() {
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

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {MOCK_CONVERSATIONS.map((conv) => (
          <Link
            key={conv.other.user_id}
            href={`/comunidad/u/${conv.other.handle}`}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition ${conv.unread > 0 ? 'bg-primary/5' : ''}`}
          >
            <div className="size-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
              <span className="text-primary font-black text-sm">{initials(conv.other.display_name)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm truncate ${conv.unread > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                  {conv.other.display_name}
                </span>
                <span className="text-[11px] text-slate-400 shrink-0">{timeAgo(conv.lastAt)}</span>
              </div>
              {conv.other.specialty && (
                <div className="text-[11px] text-primary/70 font-medium">{conv.other.specialty}</div>
              )}
              <p className={`text-sm truncate mt-0.5 ${conv.unread > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                {conv.isSelf && <span className="text-slate-400">Vos: </span>}
                {conv.lastMessage}
              </p>
            </div>
            {conv.unread > 0 && (
              <span className="size-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                {conv.unread}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
