-- ============================================================
-- OdontoLatam — Schema inicial
-- ============================================================

-- Extensiones
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extiende auth.users de Supabase)
-- ============================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null,
  role          text not null default 'professional' check (role in ('professional', 'student')),
  specialty     text,
  country       text,
  bio           text,
  avatar_url    text,
  avatar_color  text default 'from-sky-500 to-cyan-500',
  handle        text unique,           -- ej: dr-rodriguez
  verified      boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Profiles públicos visibles para todos"
  on public.profiles for select using (true);

create policy "Usuario actualiza su propio perfil"
  on public.profiles for update using (auth.uid() = id);

create policy "Usuario inserta su propio perfil"
  on public.profiles for insert with check (auth.uid() = id);

-- Trigger: auto-crear profile al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, role, specialty, country)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'professional'),
    new.raw_user_meta_data->>'specialty',
    new.raw_user_meta_data->>'country'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- POSTS (feed de la comunidad)
-- ============================================================
create table public.posts (
  id          uuid primary key default uuid_generate_v4(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  category    text not null default 'general',
  title       text not null,
  content     text not null,
  images      text[] default '{}',
  tags        text[] default '{}',
  likes_count int default 0,
  views_count int default 0,
  is_pinned   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.posts enable row level security;

create policy "Posts visibles para todos"
  on public.posts for select using (true);

create policy "Autor puede crear posts"
  on public.posts for insert with check (auth.uid() = author_id);

create policy "Autor puede editar sus posts"
  on public.posts for update using (auth.uid() = author_id);

create policy "Autor puede borrar sus posts"
  on public.posts for delete using (auth.uid() = author_id);

-- ============================================================
-- COMMENTS
-- ============================================================
create table public.comments (
  id         uuid primary key default uuid_generate_v4(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  author_id  uuid not null references public.profiles(id) on delete cascade,
  content    text not null,
  created_at timestamptz default now()
);

alter table public.comments enable row level security;

create policy "Comentarios visibles para todos"
  on public.comments for select using (true);

create policy "Usuario autenticado puede comentar"
  on public.comments for insert with check (auth.uid() = author_id);

create policy "Autor puede borrar su comentario"
  on public.comments for delete using (auth.uid() = author_id);

-- ============================================================
-- LIKES
-- ============================================================
create table public.likes (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  post_id  uuid not null references public.posts(id) on delete cascade,
  primary key (user_id, post_id)
);

alter table public.likes enable row level security;

create policy "Likes visibles para todos"
  on public.likes for select using (true);

create policy "Usuario puede dar like"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Usuario puede quitar like"
  on public.likes for delete using (auth.uid() = user_id);

-- Trigger: mantener likes_count actualizado
create or replace function public.update_likes_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set likes_count = likes_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.posts set likes_count = likes_count - 1 where id = old.post_id;
  end if;
  return null;
end;
$$;

create trigger on_like_change
  after insert or delete on public.likes
  for each row execute procedure public.update_likes_count();

-- ============================================================
-- FOLLOWS
-- ============================================================
create table public.follows (
  follower_id  uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz default now(),
  primary key (follower_id, following_id)
);

alter table public.follows enable row level security;

create policy "Follows visibles"
  on public.follows for select using (true);

create policy "Usuario puede seguir"
  on public.follows for insert with check (auth.uid() = follower_id);

create policy "Usuario puede dejar de seguir"
  on public.follows for delete using (auth.uid() = follower_id);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
create table public.newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  confirmed  boolean default false,
  created_at timestamptz default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Solo insertar (anon puede suscribirse)"
  on public.newsletter_subscribers for insert with check (true);

-- ============================================================
-- Índices para performance
-- ============================================================
create index on public.posts(author_id);
create index on public.posts(category);
create index on public.posts(created_at desc);
create index on public.comments(post_id);
create index on public.likes(post_id);
create index on public.follows(following_id);
