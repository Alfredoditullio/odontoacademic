-- ============================================================
-- OdontoLatam — Migration 004
-- Storage bucket público para imágenes de posts/mensajes + RPC follow
-- ============================================================

-- Bucket público para imágenes de la comunidad. Subida desde el cliente
-- autenticado vía signed POST; lectura pública (CDN-friendly).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community',
  'community',
  true,
  10 * 1024 * 1024, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Policy: cualquier user autenticado puede subir, pero el path tiene que
-- empezar con su user_id (`{auth.uid}/...`). Esto previene que un usuario
-- pisotee archivos de otro.
do $$ begin
  drop policy if exists "Auth users upload to their own folder" on storage.objects;
exception when others then null; end $$;

create policy "Auth users upload to their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'community'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

do $$ begin
  drop policy if exists "Owners delete their files" on storage.objects;
exception when others then null; end $$;

create policy "Owners delete their files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'community'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Lectura pública vía CDN (el bucket es público, la policy es redundante pero explícita).
do $$ begin
  drop policy if exists "Community files publicly readable" on storage.objects;
exception when others then null; end $$;

create policy "Community files publicly readable"
  on storage.objects for select
  using (bucket_id = 'community');

-- ============================================================
-- RPC: toggle_follow(target_user_id)
-- Idempotente: si no seguís → seguís; si seguís → dejás de seguir.
-- Devuelve { is_following, follower_count }.
-- ============================================================
create or replace function public.toggle_follow(target_user_id uuid)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_me     uuid;
  v_existed boolean;
  v_count   int;
begin
  v_me := auth.uid();
  if v_me is null then raise exception 'Not authenticated'; end if;
  if v_me = target_user_id then raise exception 'Cannot follow yourself'; end if;

  if not exists (select 1 from public.profiles where id = target_user_id) then
    raise exception 'Target user does not exist';
  end if;

  delete from public.follows
    where follower_id = v_me and following_id = target_user_id
    returning true into v_existed;

  if v_existed is null then
    insert into public.follows (follower_id, following_id) values (v_me, target_user_id);
    -- El trigger handle_follow_change ya actualizó el counter
  end if;

  select follower_count into v_count from public.profiles where id = target_user_id;

  return json_build_object(
    'is_following', v_existed is null,   -- si no existía antes y ahora insertamos = following
    'follower_count', coalesce(v_count, 0)
  );
end;
$$;

revoke all  on function public.toggle_follow(uuid) from public;
grant execute on function public.toggle_follow(uuid) to authenticated;
