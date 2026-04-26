-- ============================================================
-- OdontoLatam — Migration 002
-- Alinea schema con los types.ts del frontend, agrega categorías,
-- notificaciones, polls, triggers de counters, y habilita realtime.
--
-- IMPORTANTE: esta migration es destructiva. Asume que NO hay datos
-- de producción aún (la app vive de mocks). Si en el futuro hay datos
-- reales, escribir una migration aditiva en su lugar.
-- ============================================================

-- ── Limpieza de objetos viejos (en orden inverso de dependencias) ──
drop trigger if exists on_like_change on public.likes;
drop function  if exists public.update_likes_count();
drop table     if exists public.likes              cascade;
drop table     if exists public.comments           cascade;
drop table     if exists public.posts              cascade;

-- ── Extensiones extra (uuid-ossp ya está) ──
create extension if not exists "pg_trgm";   -- search en title/body si lo querés a futuro

-- ============================================================
-- CATEGORIES
-- ============================================================
create table public.categories (
  slug         text primary key,
  name         text not null,
  description  text,
  icon         text,
  color        text,
  sort_order   int  not null default 0,
  post_policy  text not null default 'open' check (post_policy in ('open', 'admin_only')),
  created_at   timestamptz not null default now()
);

alter table public.categories enable row level security;
create policy "Categories visibles para todos"
  on public.categories for select using (true);

-- Seed inicial (alineado con MOCK_CATEGORIES)
insert into public.categories (slug, name, description, icon, color, sort_order, post_policy) values
  ('presentaciones',        'Presentaciones',        'Presentate a la comunidad',                     'waving_hand', '#0ea5e9', 1, 'open'),
  ('casos-clinicos',        'Casos Clínicos',        'Compartí casos clínicos con colegas',           'stethoscope', '#10b981', 2, 'open'),
  ('marketing-dental',      'Marketing Dental',      'Tips y estrategias de marketing',               'campaign',    '#f59e0b', 3, 'open'),
  ('ia-tecnologia',         'IA y Tecnología',       'Inteligencia artificial y tecnología dental',   'smart_toy',   '#8b5cf6', 4, 'open'),
  ('novedades-odontolatam', 'Novedades OdontoLatam', 'Actualizaciones de la plataforma',              'new_releases','#ef4444', 5, 'admin_only'),
  ('mercado',               'Mercado',               'Comprá, vendé o permutá instrumental',          'storefront',  '#059669', 6, 'open'),
  ('sala-de-espera',        'Sala de Espera',        'Memes, humor y todo lo que hace que la odontología sea más llevadera.', 'weekend', '#f97316', 7, 'open'),
  ('carrera-estudios',      'Carrera & Estudios',    'El espacio de los estudiantes de odontología de LATAM.', 'school', '#6366f1', 8, 'open');

-- ============================================================
-- PROFILES — agrega columnas que usa la UI pero faltan
-- ============================================================
alter table public.profiles
  add column if not exists city               text,
  add column if not exists phone              text,
  add column if not exists website            text,
  add column if not exists accepts_referrals  boolean not null default false,
  add column if not exists reputation_points  int     not null default 0,
  add column if not exists follower_count     int     not null default 0,
  add column if not exists following_count    int     not null default 0,
  add column if not exists rules_accepted_at  timestamptz,
  add column if not exists study_year         int,
  add column if not exists university         text,
  add column if not exists newsletter_subscribed boolean not null default true,
  add column if not exists is_admin           boolean not null default false;

-- Ajustar el role check para incluir 'student' / 'moderator' / 'admin' / 'member'
do $$ begin
  alter table public.profiles drop constraint if exists profiles_role_check;
exception when others then null; end $$;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('member', 'moderator', 'admin', 'student', 'professional'));

-- ============================================================
-- POSTS  (alineado con types.ts > Post)
-- ============================================================
create table public.posts (
  id               uuid primary key default uuid_generate_v4(),
  author_id        uuid not null references public.profiles(id) on delete cascade,
  category_slug    text not null references public.categories(slug),
  title            text not null,
  body             text not null,
  attachment_urls  text[] not null default '{}',
  post_type        text   check (post_type in ('help', 'resolved', 'debate', 'general')),
  metadata         jsonb  not null default '{}'::jsonb,   -- mercado / encuesta / urgencia / etc
  like_count       int    not null default 0,
  comment_count    int    not null default 0,
  view_count       int    not null default 0,
  is_pinned        boolean not null default false,
  is_deleted       boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Posts no borrados visibles para todos"
  on public.posts for select using (is_deleted = false);

create policy "Usuario autenticado crea su post"
  on public.posts for insert
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.categories c
      where c.slug = posts.category_slug
        and (c.post_policy = 'open' or exists (
          select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true
        ))
    )
  );

create policy "Autor edita su post"
  on public.posts for update using (auth.uid() = author_id);

create policy "Autor borra (soft) su post"
  on public.posts for delete using (auth.uid() = author_id);

create index posts_category_created_idx on public.posts (category_slug, created_at desc) where is_deleted = false;
create index posts_author_idx            on public.posts (author_id);
create index posts_created_idx           on public.posts (created_at desc) where is_deleted = false;

-- ============================================================
-- COMMENTS
-- ============================================================
create table public.comments (
  id          uuid primary key default uuid_generate_v4(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  author_id   uuid not null references public.profiles(id) on delete cascade,
  body        text not null,
  is_deleted  boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "Comentarios no borrados visibles"
  on public.comments for select using (is_deleted = false);

create policy "Usuario autenticado puede comentar"
  on public.comments for insert with check (auth.uid() = author_id);

create policy "Autor borra (soft) su comentario"
  on public.comments for update using (auth.uid() = author_id);

create index comments_post_idx on public.comments (post_id, created_at) where is_deleted = false;

-- ============================================================
-- LIKES
-- ============================================================
create table public.likes (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

alter table public.likes enable row level security;

-- Diseño escalable: NO hacemos los likes públicos via select (cada usuario consulta sus
-- propios likes). El like_count agregado vive en posts.like_count, mantenido por trigger.
create policy "Usuario ve sus propios likes"
  on public.likes for select using (auth.uid() = user_id);

create policy "Usuario da like"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Usuario quita su like"
  on public.likes for delete using (auth.uid() = user_id);

create index likes_post_idx on public.likes (post_id);

-- ============================================================
-- POLLS  (1 poll opcional por post)
-- ============================================================
create table public.polls (
  id               uuid primary key default uuid_generate_v4(),
  post_id          uuid not null unique references public.posts(id) on delete cascade,
  question         text not null,
  options          text[] not null check (array_length(options, 1) between 2 and 6),
  multiple_choice  boolean not null default false,
  closes_at        timestamptz,
  created_at       timestamptz not null default now()
);

alter table public.polls enable row level security;
create policy "Polls visibles para todos"
  on public.polls for select using (true);
create policy "Autor del post crea su poll"
  on public.polls for insert with check (
    exists (select 1 from public.posts p where p.id = polls.post_id and p.author_id = auth.uid())
  );

-- Votos (1 por user x poll si single-choice; varias rows si multiple_choice)
create table public.poll_votes (
  id            uuid primary key default uuid_generate_v4(),
  poll_id       uuid not null references public.polls(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  option_index  int  not null check (option_index >= 0),
  created_at    timestamptz not null default now()
);

-- Constraint: sin duplicados (user, poll, option).
create unique index poll_votes_unique_idx on public.poll_votes (poll_id, user_id, option_index);
create index poll_votes_poll_idx          on public.poll_votes (poll_id);

alter table public.poll_votes enable row level security;
create policy "Votos visibles agregados (cualquiera)"
  on public.poll_votes for select using (true);
create policy "Usuario vota"
  on public.poll_votes for insert with check (auth.uid() = user_id);
create policy "Usuario cambia su voto"
  on public.poll_votes for delete using (auth.uid() = user_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
-- type = 'comment_on_post' | 'like_on_post' | 'mention' | 'follow' | 'system'
create table public.notifications (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,  -- destinatario
  actor_id     uuid          references public.profiles(id) on delete set null, -- quien la causó
  type         text not null check (type in ('comment_on_post', 'like_on_post', 'mention', 'follow', 'system')),
  post_id      uuid          references public.posts(id) on delete cascade,
  comment_id   uuid          references public.comments(id) on delete cascade,
  metadata     jsonb not null default '{}'::jsonb,
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.notifications enable row level security;

-- Cada usuario SOLO ve y modifica sus propias notificaciones — clave para
-- que el realtime de notifications escale: cada cliente filtra por user_id
-- y RLS lo enforza, así un usuario nunca recibe notificaciones ajenas.
create policy "Usuario ve sus notificaciones"
  on public.notifications for select using (auth.uid() = user_id);
create policy "Usuario marca como leídas sus notificaciones"
  on public.notifications for update using (auth.uid() = user_id);
create policy "Usuario borra sus notificaciones"
  on public.notifications for delete using (auth.uid() = user_id);

-- Insert: solo via SECURITY DEFINER en triggers (no policy de insert para clientes).

create index notifications_user_unread_idx on public.notifications (user_id, read_at, created_at desc);

-- ============================================================
-- TRIGGERS — counters y notificaciones
-- ============================================================

-- Like count + notificación al autor del post
create or replace function public.handle_like_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_post_author uuid;
begin
  if tg_op = 'INSERT' then
    update public.posts set like_count = like_count + 1 where id = new.post_id;

    -- Notificación al autor (si no es el mismo usuario)
    select author_id into v_post_author from public.posts where id = new.post_id;
    if v_post_author is not null and v_post_author <> new.user_id then
      insert into public.notifications (user_id, actor_id, type, post_id)
      values (v_post_author, new.user_id, 'like_on_post', new.post_id);
    end if;
    return null;

  elsif tg_op = 'DELETE' then
    update public.posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
    return null;
  end if;
  return null;
end;
$$;

create trigger on_like_change
  after insert or delete on public.likes
  for each row execute procedure public.handle_like_change();

-- Comment count + notificación al autor del post
create or replace function public.handle_comment_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_post_author uuid;
begin
  if tg_op = 'INSERT' then
    update public.posts set comment_count = comment_count + 1 where id = new.post_id;

    select author_id into v_post_author from public.posts where id = new.post_id;
    if v_post_author is not null and v_post_author <> new.author_id then
      insert into public.notifications (user_id, actor_id, type, post_id, comment_id)
      values (v_post_author, new.author_id, 'comment_on_post', new.post_id, new.id);
    end if;
    return null;

  elsif tg_op = 'UPDATE' and new.is_deleted = true and old.is_deleted = false then
    update public.posts set comment_count = greatest(comment_count - 1, 0) where id = new.post_id;
    return null;
  end if;
  return null;
end;
$$;

create trigger on_comment_change
  after insert or update on public.comments
  for each row execute procedure public.handle_comment_change();

-- Follower / following counts
create or replace function public.handle_follow_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.profiles set follower_count = follower_count + 1   where id = new.following_id;
    update public.profiles set following_count = following_count + 1 where id = new.follower_id;

    if new.following_id <> new.follower_id then
      insert into public.notifications (user_id, actor_id, type)
      values (new.following_id, new.follower_id, 'follow');
    end if;
    return null;

  elsif tg_op = 'DELETE' then
    update public.profiles set follower_count  = greatest(follower_count  - 1, 0) where id = old.following_id;
    update public.profiles set following_count = greatest(following_count - 1, 0) where id = old.follower_id;
    return null;
  end if;
  return null;
end;
$$;

drop trigger if exists on_follow_change on public.follows;
create trigger on_follow_change
  after insert or delete on public.follows
  for each row execute procedure public.handle_follow_change();

-- ============================================================
-- REALTIME publication
-- ------------------------------------------------------------
-- Diseño para escala (miles de usuarios concurrent):
--  - notifications  → SÍ (1 conn por user logueado, multiplexable con futuro
--                         chat/presence; postgres_changes filtrado por
--                         user_id=eq.${uid} + RLS asegura aislamiento total).
--  - comments       → NO (polling incremental cada 10s en el cliente,
--                         pausado cuando la pestaña está oculta. Evita 1 conn
--                         por user × post abierto, que escalaría linealmente
--                         con la actividad).
--  - posts          → NO (feed se refetchea on-demand / SSR con revalidate).
--  - likes          → NO (counter agregado vive en posts, mantenido por trigger).
--  - messages (Fase 2) → SÍ (chat directo, latencia importa).
-- ============================================================

-- Realtime publication: usamos un bloque defensivo porque alter publication
-- no soporta `drop table if exists` (sintaxis Postgres). Encapsulamos cada
-- drop en su propio block exception-handler para que la migration sea idempotente.
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;

  begin
    alter publication supabase_realtime drop table public.notifications;
  exception when others then null; end;
end $$;

alter publication supabase_realtime add table public.notifications;

-- Realtime requiere replica identity full para enviar la fila completa en updates
alter table public.notifications replica identity full;
