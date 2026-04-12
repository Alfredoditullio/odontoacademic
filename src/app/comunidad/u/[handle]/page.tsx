import Link from 'next/link';
import { MOCK_PROFILES, MOCK_POSTS } from '@/data/mock-community';
import { PostCard } from '@/components/comunidad/PostCard';
import { initials, timeAgo } from '@/lib/utils';

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const profile = MOCK_PROFILES.find((p) => p.handle === handle);

  if (!profile) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Perfil no encontrado</p>
        <Link href="/comunidad" className="text-primary font-semibold mt-4 inline-block">Volver al feed</Link>
      </div>
    );
  }

  const posts = MOCK_POSTS.filter((p) => p.author_id === profile.user_id);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-4">
          <div className="size-20 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-2xl">
            {initials(profile.display_name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{profile.display_name}</h1>
              {profile.reputation_points >= 200 && (
                <span className="material-symbols-outlined text-[18px] text-amber-500" title={`${profile.reputation_points} pts`}>military_tech</span>
              )}
            </div>
            <p className="text-sm text-slate-500">@{profile.handle}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
              {profile.specialty && <span>{profile.specialty}</span>}
              {profile.country && <span>· {profile.city ? `${profile.city}, ${profile.country}` : profile.country}</span>}
              <span>· Se unió {timeAgo(profile.created_at)}</span>
              {profile.accepts_referrals && (
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  · <span className="material-symbols-outlined text-[13px]">swap_horiz</span> Acepta derivaciones
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm">
                <span className="font-bold text-slate-900">{profile.follower_count}</span>{' '}
                <span className="text-slate-500">{profile.follower_count === 1 ? 'seguidor' : 'seguidores'}</span>
              </span>
              <span className="text-sm">
                <span className="font-bold text-slate-900">{profile.following_count}</span>{' '}
                <span className="text-slate-500">siguiendo</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition">
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                Seguir
              </button>
              <button className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition border border-slate-200">
                <span className="material-symbols-outlined text-[16px]">mail</span>
                Mensaje
              </button>
            </div>
          </div>
          <div className="shrink-0 text-center">
            <div className="text-2xl font-black text-primary">{profile.reputation_points}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Reputación</div>
          </div>
        </div>
        {profile.bio && <p className="text-sm text-slate-700 mt-4 whitespace-pre-wrap">{profile.bio}</p>}
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-slate-900 px-1">Posts</h2>
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-400">
            Todavía no publicó nada.
          </div>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>

      <div className="text-center">
        <Link href="/comunidad" className="text-sm text-primary font-semibold hover:underline">
          ← Volver al feed
        </Link>
      </div>
    </div>
  );
}
