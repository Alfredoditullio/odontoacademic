-- ============================================================
-- OdontoLatam — Migration 003 — Mensajería privada (chat 1:1)
--
-- Diseño escalable:
--  - Tabla `conversations` materializa cada par único de usuarios.
--    Constraint `user_a < user_b` evita duplicados (A↔B y B↔A).
--    Counters `unread_for_a` / `unread_for_b` mantenidos por trigger →
--    listar conversaciones con su badge cuesta UN select indexado, no
--    un count() agregado contra `messages`.
--  - Tabla `messages` con FK a `conversations`. Una sola query traer todo
--    el chat con index (conversation_id, created_at).
--  - Realtime SOLO sobre `messages` filtrada por conversation_id (un canal
--    por chat abierto). El badge global del TopNav usa polling cheap
--    (cada 30s contra `conversations`), no consume conexiones.
-- ============================================================

create table if not exists public.conversations (
  id              uuid primary key default uuid_generate_v4(),
  user_a          uuid not null references public.profiles(id) on delete cascade,
  user_b          uuid not null references public.profiles(id) on delete cascade,
  last_message_at timestamptz,
  last_message_preview text,
  last_sender_id  uuid references public.profiles(id) on delete set null,
  unread_for_a    int not null default 0,
  unread_for_b    int not null default 0,
  created_at      timestamptz not null default now(),

  -- A <-> B = B <-> A: forzamos orden canónico para que el unique funcione
  constraint conversations_pair_order check (user_a < user_b),
  constraint conversations_pair_unique unique (user_a, user_b),
  constraint conversations_pair_distinct check (user_a <> user_b)
);

alter table public.conversations enable row level security;

-- Solo los participantes ven la conversación
create policy "Participantes ven la conversación"
  on public.conversations for select
  using (auth.uid() in (user_a, user_b));

-- Insert: cualquier user autenticado puede crear una conversación con otro
-- (validamos en el server action que el otro user existe y user_a < user_b).
create policy "Usuario crea conversación donde participa"
  on public.conversations for insert
  with check (auth.uid() in (user_a, user_b));

-- Update: solo participantes (para resetear unread_count cuando lee)
create policy "Participantes actualizan la conversación"
  on public.conversations for update
  using (auth.uid() in (user_a, user_b));

-- Index para listar mis conversations ordenadas por última actividad
create index conversations_user_a_idx on public.conversations (user_a, last_message_at desc nulls last);
create index conversations_user_b_idx on public.conversations (user_b, last_message_at desc nulls last);

-- ============================================================
-- MESSAGES
-- ============================================================
create table if not exists public.messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  body            text not null check (char_length(body) > 0 and char_length(body) <= 4000),
  attachment_url  text,           -- preparado para Fase 3 (Storage)
  read_at         timestamptz,    -- cuándo el otro user marcó como leído
  created_at      timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Participantes de la conversación ven los mensajes
create policy "Participantes ven mensajes de su conversación"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and auth.uid() in (c.user_a, c.user_b)
    )
  );

-- Insert: solo si soy participante Y soy el sender
create policy "Participantes mandan mensajes a su conversación"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and auth.uid() in (c.user_a, c.user_b)
    )
  );

-- Update: solo el receptor puede marcar como leído (read_at)
create policy "Receptor marca como leído"
  on public.messages for update
  using (
    auth.uid() <> sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and auth.uid() in (c.user_a, c.user_b)
    )
  );

create index messages_conv_idx on public.messages (conversation_id, created_at);

-- ============================================================
-- TRIGGERS — mantener last_message_at + unread_for_X
-- ============================================================
create or replace function public.handle_message_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_user_a uuid;
  v_user_b uuid;
  v_preview text;
begin
  if tg_op = 'INSERT' then
    select user_a, user_b into v_user_a, v_user_b
      from public.conversations where id = new.conversation_id;

    v_preview := left(new.body, 200);

    update public.conversations set
      last_message_at      = new.created_at,
      last_message_preview = v_preview,
      last_sender_id       = new.sender_id,
      -- Sumamos unread al receptor (el que NO es el sender)
      unread_for_a = unread_for_a + (case when new.sender_id <> v_user_a then 1 else 0 end),
      unread_for_b = unread_for_b + (case when new.sender_id <> v_user_b then 1 else 0 end)
    where id = new.conversation_id;

    return null;
  end if;
  return null;
end;
$$;

drop trigger if exists on_message_change on public.messages;
create trigger on_message_change
  after insert on public.messages
  for each row execute procedure public.handle_message_change();

-- ============================================================
-- HELPER: get_or_create_conversation(other_user_id)
-- Idempotente: devuelve la conversation_id existente o la crea.
-- Usa el orden canónico (user_a < user_b) para evitar duplicados.
-- ============================================================
create or replace function public.get_or_create_conversation(other_user_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_me uuid;
  v_a  uuid;
  v_b  uuid;
  v_id uuid;
begin
  v_me := auth.uid();
  if v_me is null then raise exception 'Not authenticated'; end if;
  if v_me = other_user_id then raise exception 'Cannot start conversation with yourself'; end if;

  if v_me < other_user_id then
    v_a := v_me; v_b := other_user_id;
  else
    v_a := other_user_id; v_b := v_me;
  end if;

  -- Verificamos que el otro user exista (security: no leak)
  if not exists (select 1 from public.profiles where id = other_user_id) then
    raise exception 'Other user does not exist';
  end if;

  insert into public.conversations (user_a, user_b)
    values (v_a, v_b)
    on conflict (user_a, user_b) do update set user_a = excluded.user_a
    returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.get_or_create_conversation(uuid) from public;
grant execute on function public.get_or_create_conversation(uuid) to authenticated;

-- ============================================================
-- HELPER: mark_conversation_read(conversation_id)
-- Resetea el contador de unread del usuario actual + actualiza read_at
-- de los mensajes que recibió.
-- ============================================================
create or replace function public.mark_conversation_read(conv_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_me uuid;
  v_a  uuid;
  v_b  uuid;
begin
  v_me := auth.uid();
  if v_me is null then raise exception 'Not authenticated'; end if;

  select user_a, user_b into v_a, v_b
    from public.conversations where id = conv_id and v_me in (user_a, user_b);

  if v_a is null then return; end if;

  -- Reset del contador correspondiente
  if v_me = v_a then
    update public.conversations set unread_for_a = 0 where id = conv_id;
  else
    update public.conversations set unread_for_b = 0 where id = conv_id;
  end if;

  -- Marcar mensajes recibidos como leídos
  update public.messages
    set read_at = now()
    where conversation_id = conv_id
      and sender_id <> v_me
      and read_at is null;
end;
$$;

revoke all on function public.mark_conversation_read(uuid) from public;
grant execute on function public.mark_conversation_read(uuid) to authenticated;

-- ============================================================
-- REALTIME publication — agregar messages
-- ============================================================
do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; end $$;

alter table public.messages replica identity full;
