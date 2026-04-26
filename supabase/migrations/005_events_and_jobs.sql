-- ============================================================
-- OdontoLatam — Migration 005 — Eventos, Bolsa de Trabajo, votar polls
-- ============================================================

create table if not exists public.events (
  id              uuid primary key default uuid_generate_v4(),
  author_id       uuid not null references public.profiles(id) on delete cascade,
  title           text not null check (char_length(title) between 5 and 200),
  description     text check (char_length(description) <= 5000),
  event_type      text not null check (event_type in ('webinar','congress','course','meetup','workshop','fair')),
  region          text not null check (region in ('Online','LATAM','España','Europa','Norteamérica','Asia')),
  country         text,
  city            text,
  specialty       text,
  starts_at       timestamptz not null,
  ends_at         timestamptz check (ends_at is null or ends_at >= starts_at),
  event_url       text,
  registration_url text,
  is_free         boolean not null default true,
  price           text,
  image_url       text,
  is_deleted      boolean not null default false,
  created_at      timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Eventos visibles para todos"
  on public.events for select using (is_deleted = false);

create policy "Usuario autenticado crea eventos"
  on public.events for insert with check (auth.uid() = author_id);

create policy "Autor edita su evento"
  on public.events for update using (auth.uid() = author_id);

create policy "Autor borra (soft) su evento"
  on public.events for delete using (auth.uid() = author_id);

create index events_starts_at_idx on public.events (starts_at) where is_deleted = false;
create index events_region_idx    on public.events (region, starts_at) where is_deleted = false;
create index events_specialty_idx on public.events (specialty) where is_deleted = false;

create table if not exists public.jobs (
  id           uuid primary key default uuid_generate_v4(),
  author_id    uuid not null references public.profiles(id) on delete cascade,
  title        text not null check (char_length(title) between 5 and 200),
  clinic       text,
  job_type     text not null check (job_type in ('empleado','socio','guardia','reemplazo','docente','investigacion')),
  modality     text not null check (modality in ('presencial','hibrido','remoto')),
  specialty    text,
  city         text not null,
  country      text not null,
  description  text not null check (char_length(description) between 20 and 5000),
  requirements text[] not null default '{}',
  contact      text not null,
  is_paid      boolean not null default true,
  salary_range text,
  is_filled    boolean not null default false,
  is_deleted   boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.jobs enable row level security;

create policy "Jobs visibles para todos"
  on public.jobs for select using (is_deleted = false);

create policy "Usuario autenticado crea ofertas"
  on public.jobs for insert with check (auth.uid() = author_id);

create policy "Autor edita su oferta"
  on public.jobs for update using (auth.uid() = author_id);

create policy "Autor borra (soft) su oferta"
  on public.jobs for delete using (auth.uid() = author_id);

create index jobs_created_idx   on public.jobs (created_at desc) where is_deleted = false;
create index jobs_country_idx   on public.jobs (country, created_at desc) where is_deleted = false;
create index jobs_type_idx      on public.jobs (job_type) where is_deleted = false;
create index jobs_specialty_idx on public.jobs (specialty) where is_deleted = false;

-- RPC para votar en una encuesta. Maneja single-choice (reemplaza voto previo)
-- y multiple_choice (toggle por opción).
create or replace function public.vote_poll(p_poll_id uuid, p_option_index int)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_me uuid;
  v_multi boolean;
  v_options text[];
  v_existed boolean;
begin
  v_me := auth.uid();
  if v_me is null then raise exception 'Not authenticated'; end if;

  select multiple_choice, options into v_multi, v_options
    from public.polls where id = p_poll_id;
  if v_multi is null then raise exception 'Poll not found'; end if;

  if p_option_index < 0 or p_option_index >= array_length(v_options, 1) then
    raise exception 'Invalid option_index';
  end if;

  if v_multi then
    delete from public.poll_votes
      where poll_id = p_poll_id and user_id = v_me and option_index = p_option_index
      returning true into v_existed;
    if v_existed is null then
      insert into public.poll_votes (poll_id, user_id, option_index)
        values (p_poll_id, v_me, p_option_index);
    end if;
  else
    delete from public.poll_votes
      where poll_id = p_poll_id and user_id = v_me;
    insert into public.poll_votes (poll_id, user_id, option_index)
      values (p_poll_id, v_me, p_option_index);
  end if;

  return json_build_object('ok', true);
end;
$$;

revoke all on function public.vote_poll(uuid, int) from public;
grant execute on function public.vote_poll(uuid, int) to authenticated;
