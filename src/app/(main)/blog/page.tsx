'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/data/mock-blog';

export default function BlogPage() {
  const [category, setCategory] = useState('Todos');

  const filtered = BLOG_POSTS.filter((p) => category === 'Todos' || p.category === category);

  return (
    <>
      <section className="bg-gradient-to-br from-violet-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[32px]">newspaper</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Blog</h1>
          </div>
          <p className="text-white/80 max-w-2xl">Artículos, noticias y tendencias del mundo dental.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {BLOG_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  category === c ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.coverImage} alt="" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">{post.category}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-2 mb-2 line-clamp-2 group-hover:text-violet-600 transition">{post.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                    <span>{post.author.name}</span>
                    <span>·</span>
                    <span>{post.readTime} min lectura</span>
                    <span>·</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
