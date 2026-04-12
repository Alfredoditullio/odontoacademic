import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_POSTS } from '@/data/mock-blog';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  return { title: post?.title ?? 'Artículo' };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/blog" className="flex items-center gap-1 text-sm text-primary font-semibold mb-6 hover:underline">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al Blog
        </Link>

        <div className="aspect-[16/9] bg-slate-100 rounded-2xl overflow-hidden mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt="" className="size-full object-cover" />
        </div>

        <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">{post.category}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4 leading-tight">{post.title}</h1>

        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-200">
          <div className="size-10 rounded-full bg-gradient-to-br from-sky-100 to-teal-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">{post.author.name}</div>
            <div className="text-xs text-slate-400">
              {post.author.role} · {new Date(post.publishedAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} · {post.readTime} min lectura
            </div>
          </div>
        </div>

        <div className="prose-post text-slate-700 text-base leading-relaxed">
          {post.body}
        </div>
      </div>
    </article>
  );
}
