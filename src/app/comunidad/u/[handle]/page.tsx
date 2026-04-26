/**
 * Perfil público de usuario. Server Component:
 *  - Resuelve handle → perfil + is_following + últimos 5 posts (one-shot via getProfileByHandle).
 *  - <FollowButton> es un client island con optimistic UI + RPC toggle_follow.
 *  - "Pedir derivación" se mantiene como UI mock — pendiente conectar al
 *    sistema de mensajes prefilled o a un nuevo flow específico.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProfileByHandle } from '@/lib/queries/community';
import { PostCard } from '@/components/comunidad/PostCard';
import { FollowButton } from '@/components/comunidad/FollowButton';
import { initials, timeAgo } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const { profile, isFollowing, recentPosts } = await getProfileByHandle(handle);

  if (!profile) notFound();

  const isStudent = profile.role === 'student';

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Cover */}
        <div className={`h-24 ${isStudent
          ? 'bg-gradient-to-r from-indigo-500 to-violet-600'
          : 'bg-gradient-to-r from-sky-500 to-teal-600'
        }`} />

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className={`size-20 rounded-full border-4 border-white shadow-md flex items-center justify-center font-black text-white text-2xl overflow-hidden ${
              isStudent ? 'bg-gradient-to-br from-indigo-500 to-violet-600' : 'bg-gradient-to-br from-sky-500 to-teal-600'
            }`}>
              {profile.avatar_url
                /* eslint-disable-next-line @next/next/no-img-element */
                ? <img src={profile.avatar_url} alt="" className="size-full object-cover" />
                : initials(profile.display_name)
              }
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mb-1">
              <FollowButton
                targetUserId={profile.user_id}
                targetHandle={profile.handle}
                initialIsFollowing={isFollowing}
                initialFollowerCount={profile.follower_count}
                compact
              />

              <Link
                href={`/comunidad/mensajes/${profile.handle}`}
                className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition border border-slate-200"
              >
                <span className="material-symbols-outlined text-[16px]">mail</span>
                Mensaje
              </Link>
            </div>
          </div>

          {/* Name & info */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{profile.display_name}</h1>
              {profile.reputation_points >= 200 && !isStudent && (
                <span className="material-symbols-outlined text-[18px] text-amber-500" title={`${profile.reputation_points} pts`}>
                  military_tech
                </span>
              )}
              {isStudent && (
                <span className="inline-flex items-center gap-1 text-[11px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  <span className="material-symbols-outlined text-[12px]">school</span>
                  {profile.study_year ? `Estudiante · ${profile.study_year}° año` : 'Estudiante'}
                </span>
              )}
            </div>

            {profile.handle && <p className="text-sm text-slate-400 mt-0.5">@{profile.handle}</p>}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-2">
              {isStudent ? (
                <>
                  {profile.university && (
                    <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                      <span className="material-symbols-outlined text-[13px]">school</span>
                      {profile.university}
                    </span>
                  )}
                  {profile.country && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      {profile.city ? `${profile.city}, ${profile.country}` : profile.country}
                    </span>
                  )}
                </>
              ) : (
                <>
                  {profile.specialty && <span className="font-medium text-slate-700">{profile.specialty}</span>}
                  {profile.country && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      {profile.city ? `${profile.city}, ${profile.country}` : profile.country}
                    </span>
                  )}
                  {profile.accepts_referrals && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                      Acepta derivaciones
                    </span>
                  )}
                </>
              )}
              <span>· Se unió {timeAgo(profile.created_at)}</span>
            </div>

            <div className="flex items-center gap-5 mt-3">
              <span className="text-sm">
                <span className="font-bold text-slate-900">{profile.follower_count}</span>{' '}
                <span className="text-slate-500">{profile.follower_count === 1 ? 'seguidor' : 'seguidores'}</span>
              </span>
              <span className="text-sm">
                <span className="font-bold text-slate-900">{profile.following_count}</span>{' '}
                <span className="text-slate-500">siguiendo</span>
              </span>
              {!isStudent && profile.reputation_points > 0 && (
                <span className="text-sm">
                  <span className="font-bold text-primary">{profile.reputation_points}</span>{' '}
                  <span className="text-slate-500">pts reputación</span>
                </span>
              )}
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm text-slate-700 mt-4 whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        <h2 className="font-bold text-slate-900 px-1">
          Posts {recentPosts.length > 0 && <span className="text-slate-400 font-normal text-sm">({recentPosts.length})</span>}
        </h2>
        {recentPosts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-400">
            Todavía no publicó nada.
          </div>
        ) : (
          recentPosts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>

      <div className="text-center pb-4">
        <Link href="/comunidad" className="text-sm text-primary font-semibold hover:underline">
          ← Volver al feed
        </Link>
      </div>
    </div>
  );
}
