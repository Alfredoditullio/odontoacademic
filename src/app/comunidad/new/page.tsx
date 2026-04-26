'use client';

import { useState, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MOCK_CATEGORIES } from '@/data/mock-community';
import { createPost } from '@/lib/actions/community';
import { ImageUpload } from '@/components/comunidad/ImageUpload';
import { uploadCommunityImage } from '@/lib/storage/community-images';

const POST_TYPES = [
  { value: 'help',     label: 'Pido ayuda',          icon: 'help',         color: 'bg-amber-100 text-amber-700',     desc: 'Busco opinión de colegas sobre un caso en curso' },
  { value: 'resolved', label: 'Caso resuelto',        icon: 'check_circle', color: 'bg-emerald-100 text-emerald-700', desc: 'Comparto un caso terminado y el plan aplicado'   },
  { value: 'debate',   label: 'Debate / pregunta',    icon: 'forum',        color: 'bg-indigo-100 text-indigo-700',   desc: 'Discusión teórica o pregunta abierta a la comunidad' },
] as const;

type PostType = typeof POST_TYPES[number]['value'];

// Wrapper requerido por Next.js 15: useSearchParams obliga a tener un boundary
// de Suspense para que el shell pueda pre-renderizarse independientemente.
export default function NewPostPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6">Cargando…</div>}>
      <NewPostForm />
    </Suspense>
  );
}

function NewPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categories = MOCK_CATEGORIES.filter((c) => c.post_policy === 'open');

  // Pre-selecciona la categoría si vino del query string (`?categoria=slug`).
  const presetSlug = searchParams.get('categoria');
  const initialSlug = presetSlug && categories.some((c) => c.slug === presetSlug)
    ? presetSlug
    : categories[0]?.slug ?? '';

  const [categorySlug, setCategorySlug] = useState(initialSlug);
  const [postType, setPostType]         = useState<PostType>('help');
  const [title, setTitle]               = useState('');
  const [body, setBody]                 = useState('');
  const [files, setFiles]               = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [pending, startTransition]      = useTransition();

  // Encuesta opcional
  const [hasPoll, setHasPoll]                 = useState(false);
  const [pollQuestion, setPollQuestion]       = useState('');
  const [pollOptions, setPollOptions]         = useState<string[]>(['', '']);
  const [pollMultiple, setPollMultiple]       = useState(false);

  function setPollOption(idx: number, val: string) {
    setPollOptions((prev) => prev.map((o, i) => i === idx ? val : o));
  }
  function addPollOption()  { if (pollOptions.length < 6) setPollOptions((prev) => [...prev, '']); }
  function removePollOption(idx: number) {
    if (pollOptions.length <= 2) return;
    setPollOptions((prev) => prev.filter((_, i) => i !== idx));
  }

  const isClinical = categorySlug === 'casos-clinicos';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!categorySlug) { setError('Elegí una categoría'); return; }

    startTransition(async () => {
      // 1. Subir las imágenes en paralelo y juntar URLs (si hay).
      let attachmentUrls: string[] = [];
      if (files.length > 0) {
        setUploadProgress(`Subiendo ${files.length} imagen${files.length > 1 ? 'es' : ''}...`);
        const results = await Promise.all(
          files.map((f) => uploadCommunityImage(f, { folder: 'posts' })),
        );
        const failed = results.find((r) => !r.ok);
        if (failed && !failed.ok) {
          setError(`No se pudo subir una imagen: ${failed.error}`);
          setUploadProgress(null);
          return;
        }
        attachmentUrls = results
          .filter((r): r is Extract<typeof r, { ok: true }> => r.ok)
          .map((r) => r.url);
        setUploadProgress(null);
      }

      // 2. Crear el post con las URLs ya disponibles + poll si vino.
      const res = await createPost({
        categorySlug,
        title,
        body,
        postType: isClinical ? postType : null,
        attachmentUrls,
        poll: hasPoll
          ? {
              question: pollQuestion,
              options:  pollOptions,
              multipleChoice: pollMultiple,
            }
          : undefined,
      });
      if (!res.ok) { setError(res.error); return; }
      router.push(`/comunidad/p/${res.data.id}`);
    });
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-6">Nuevo post</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Category picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Categoría</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.slug}
                  onClick={() => setCategorySlug(c.slug)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition ${
                    categorySlug === c.slug ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ color: c.color ?? '#64748b' }}>
                    {c.icon ?? 'tag'}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Clinical post type */}
          {isClinical && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Tipo de post</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {POST_TYPES.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setPostType(t.value)}
                    className={`px-3 py-3 rounded-lg border text-left transition ${
                      postType === t.value ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`size-6 rounded-full flex items-center justify-center ${t.color}`}>
                        <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                      </span>
                      <span className="text-sm font-bold text-slate-800">{t.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Título <span className="font-normal text-slate-400">({title.length}/200)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="Un título claro y conciso"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Contenido <span className="font-normal text-slate-400">({body.length}/10.000)</span>
            </label>
            <textarea
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={10_000}
              placeholder="Contenido del post..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Imágenes <span className="font-normal text-slate-400">(opcional, hasta 6)</span>
            </label>
            <ImageUpload
              files={files}
              onChange={setFiles}
              maxFiles={6}
              hint="JPG, PNG, WebP, GIF o HEIC — hasta 10 MB cada una"
            />
          </div>

          {/* Encuesta opcional */}
          <div className="border-t border-slate-100 pt-5">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPoll}
                onChange={(e) => setHasPoll(e.target.checked)}
                className="size-4"
              />
              <span className="material-symbols-outlined text-[18px] text-violet-600">ballot</span>
              Agregar una encuesta
            </label>

            {hasPoll && (
              <div className="mt-4 space-y-3 bg-violet-50/50 border border-violet-200 rounded-xl p-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Pregunta</label>
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    maxLength={200}
                    placeholder="¿Qué técnica preferís para…?"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Opciones (2–6)</label>
                  <div className="space-y-2">
                    {pollOptions.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => setPollOption(idx, e.target.value)}
                          maxLength={120}
                          placeholder={`Opción ${idx + 1}`}
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removePollOption(idx)}
                            className="size-9 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition flex items-center justify-center"
                            title="Eliminar opción"
                          >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {pollOptions.length < 6 && (
                    <button
                      type="button"
                      onClick={addPollOption}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      Agregar opción
                    </button>
                  )}
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={pollMultiple}
                    onChange={(e) => setPollMultiple(e.target.checked)}
                  />
                  Permitir seleccionar varias opciones
                </label>
              </div>
            )}
          </div>

          {uploadProgress && (
            <div className="bg-sky-50 border border-sky-200 text-sky-700 text-sm rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
              {uploadProgress}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link href="/comunidad" className="px-4 py-2 text-sm text-slate-600 font-semibold hover:text-slate-900">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={pending || title.trim().length < 5 || body.trim().length < 10}
              className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {pending && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
              {pending ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
