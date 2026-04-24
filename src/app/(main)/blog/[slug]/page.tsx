import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/data/mock-blog';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Artículo no encontrado' };
  return {
    title: post.title,
    description: post.seoDescription ?? post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.seoDescription ?? post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

/** Renders body text with ## headings, **bold**, > blockquote, - list items, and paragraphs */
function renderBody(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // h2 heading
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-10 mb-4 leading-snug">
          {trimmed.slice(3)}
        </h2>
      );
    }

    // h3 heading
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={i} className="text-lg font-bold text-slate-800 mt-7 mb-3">
          {trimmed.slice(4)}
        </h3>
      );
    }

    // blockquote / testimonial
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={i} className="border-l-4 border-sky-400 pl-5 py-1 my-6 bg-sky-50 rounded-r-xl">
          <p className="text-slate-700 italic leading-relaxed">{trimmed.slice(2)}</p>
        </blockquote>
      );
    }

    // unordered list (lines starting with - or •)
    if (trimmed.split('\n').every((l) => l.trim().startsWith('- ') || l.trim().startsWith('• '))) {
      const items = trimmed.split('\n').map((l) => l.replace(/^[-•]\s/, '').trim());
      return (
        <ul key={i} className="space-y-2 my-5 ml-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2.5 text-slate-600">
              <span className="material-symbols-outlined text-sky-500 text-[18px] mt-0.5 shrink-0">check_circle</span>
              <span className="leading-relaxed">{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    }

    // CTA box (starts with [CTA])
    if (trimmed.startsWith('[CTA]')) {
      const text = trimmed.slice(5).trim();
      const [label, ...rest] = text.split('|');
      const href = rest[0]?.trim() ?? '#';
      const desc = rest[1]?.trim() ?? '';
      return (
        <div key={i} className="my-8 bg-gradient-to-br from-sky-50 to-teal-50 border border-sky-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-base">{label.trim()}</p>
            {desc && <p className="text-sm text-slate-500 mt-1">{desc}</p>}
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition shrink-0"
          >
            Conocer más
            <span className="material-symbols-outlined text-[17px]">open_in_new</span>
          </a>
        </div>
      );
    }

    // comparison table (starts with [TABLE])
    if (trimmed.startsWith('[TABLE]')) {
      const rows = trimmed.slice(7).trim().split('\n');
      const headers = rows[0].split('|').map((h) => h.trim());
      const dataRows = rows.slice(1);
      return (
        <div key={i} className="my-8 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 text-white">
                {headers.map((h, j) => (
                  <th key={j} className="px-4 py-3 text-left font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => {
                const cells = row.split('|').map((c) => c.trim());
                return (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    {cells.map((cell, ci) => (
                      <td key={ci} className={`px-4 py-3 ${ci === 0 ? 'font-semibold text-slate-700' : 'text-slate-600'}`}>
                        {cell === '✓' ? <span className="text-emerald-600 font-bold">✓</span>
                          : cell === '✗' ? <span className="text-red-500 font-bold">✗</span>
                          : cell === '~' ? <span className="text-amber-500 font-bold">~</span>
                          : cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    // regular paragraph
    return (
      <p key={i} className="text-slate-600 leading-relaxed my-4">
        {renderInline(trimmed)}
      </p>
    );
  });
}

/** Render inline bold **text** */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article className="py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/blog" className="flex items-center gap-1 text-sm text-primary font-semibold mb-6 hover:underline">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al Blog
        </Link>

        <div className="aspect-[16/9] bg-slate-100 rounded-2xl overflow-hidden mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title} className="size-full object-cover" />
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold text-violet-600 uppercase tracking-wider bg-violet-50 px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          {post.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>

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

        <div className="text-base">
          {renderBody(post.body)}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full font-medium transition cursor-default">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share / back */}
        <div className="mt-8 flex items-center justify-between">
          <Link href="/blog" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-[17px]">arrow_back</span>
            Más artículos
          </Link>
          <Link href="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition">
            <span className="material-symbols-outlined text-[17px]">groups</span>
            Debatir en la Comunidad
          </Link>
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 pt-10 border-t border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">También te puede interesar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.coverImage} alt="" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">{p.category}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2 group-hover:text-primary transition">{p.title}</h3>
                  <p className="text-xs text-slate-400 mt-2">{p.readTime} min lectura</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
