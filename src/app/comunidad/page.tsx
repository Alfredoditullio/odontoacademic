import { MOCK_POSTS } from '@/data/mock-community';
import { PostCard } from '@/components/comunidad/PostCard';

export const metadata = { title: 'Comunidad' };

export default function CommunityFeedPage() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-600 rounded-2xl p-6 text-white shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Bienvenido a la Comunidad OdontoLatam</h1>
        <p className="text-sm text-white/90 max-w-xl">
          El lugar donde los odontólogos de Latinoamérica compartimos casos, dudas, aprendemos y crecemos juntos.
        </p>
      </div>

      {MOCK_POSTS.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
