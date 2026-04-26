/**
 * Página de chat 1:1 con un colega.
 *
 * Server Component:
 *  - Resuelve handle → perfil + conversation_id (la crea si no existe via
 *    server action `getOrCreateConversation`).
 *  - Trae los últimos 50 mensajes.
 *  - Pasa todo al client island <ChatView/> que maneja Realtime + envío.
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  getConversationContextByHandle,
  getMessages,
} from '@/lib/queries/messaging';
import { getOrCreateConversation } from '@/lib/actions/messaging';
import { ChatView } from '@/components/comunidad/ChatView';

export const dynamic = 'force-dynamic';

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const ctx = await getConversationContextByHandle(handle);
  if (!ctx.other) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Usuario no encontrado</p>
        <Link href="/comunidad/mensajes" className="text-primary font-semibold mt-4 inline-block">
          Volver a mensajes
        </Link>
      </div>
    );
  }

  // Si no hay conversación todavía, la creamos via RPC (atómico, idempotente).
  let conversationId = ctx.conversationId;
  if (!conversationId) {
    const res = await getOrCreateConversation(ctx.other.user_id);
    if (!res.ok) {
      // Probablemente no autenticado → middleware ya redirige; defensivo:
      redirect('/login');
    }
    conversationId = res.data.conversationId;
  }

  const messages = await getMessages(conversationId, { limit: 50 });

  return (
    <ChatView
      conversationId={conversationId}
      other={ctx.other}
      initialMessages={messages}
    />
  );
}
