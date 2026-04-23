'use client';

import { useRef, useState, useEffect } from 'react';

interface ImageUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  /** shown in the dropzone label */
  hint?: string;
  /** required visual indicator + validation hint */
  required?: boolean;
  /** Tailwind classes for the empty-state dropzone hover/drag highlight */
  dropzoneClass?: string;
}

export function ImageUpload({
  files,
  onChange,
  maxFiles = 8,
  hint,
  required = false,
  dropzoneClass = 'hover:border-primary/50 hover:bg-primary/5',
}: ImageUploadProps) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  // Revoke object URLs when files change or component unmounts
  const urlMapRef = useRef<Map<File, string>>(new Map());

  function getUrl(file: File): string {
    if (!urlMapRef.current.has(file)) {
      urlMapRef.current.set(file, URL.createObjectURL(file));
    }
    return urlMapRef.current.get(file)!;
  }

  useEffect(() => {
    const currentMap = urlMapRef.current;
    return () => {
      currentMap.forEach((url) => URL.revokeObjectURL(url));
      currentMap.clear();
    };
  }, []);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) => f.type.startsWith('image/'));
    const combined = [...files, ...valid].slice(0, maxFiles);
    onChange(combined);
  }

  function remove(index: number) {
    const removed = files[index];
    const url = urlMapRef.current.get(removed);
    if (url) { URL.revokeObjectURL(url); urlMapRef.current.delete(removed); }
    onChange(files.filter((_, i) => i !== index));
  }

  const canAddMore = files.length < maxFiles;

  /* ── Empty state ── */
  if (files.length === 0) {
    return (
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        className={`flex items-center gap-3 py-5 px-4 border-2 border-dashed rounded-xl transition cursor-pointer select-none ${
          dragging ? 'border-primary bg-primary/5 scale-[1.01]' : `border-slate-200 ${dropzoneClass}`
        }`}
      >
        <span className="material-symbols-outlined text-[30px] text-slate-300 shrink-0">add_photo_alternate</span>
        <div>
          <p className="text-sm font-semibold text-slate-600">
            Arrastrá {required ? '' : 'o hacé click para subir '}
            {required ? 'o hacé click para subir tu imagen' : 'imágenes'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {hint ?? `PNG, JPG, HEIC, GIF — hasta 10 MB · máx. ${maxFiles} imágenes`}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={maxFiles > 1}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>
    );
  }

  /* ── Has files ── */
  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {files.map((file, i) => (
          <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getUrl(file)}
              alt={`Preview ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 size-6 rounded-full bg-slate-900/60 hover:bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            >
              <span className="material-symbols-outlined text-white text-[14px]">close</span>
            </button>
            {/* Index badge */}
            <span className="absolute bottom-1 left-1 text-[10px] font-black text-white bg-slate-900/50 px-1.5 py-0.5 rounded-full leading-none">
              {i + 1}
            </span>
          </div>
        ))}

        {/* Add more cell */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition"
          >
            <span className="material-symbols-outlined text-[22px] text-slate-400">add_photo_alternate</span>
            <span className="text-[10px] font-bold text-slate-400">Agregar</span>
          </button>
        )}
      </div>

      {/* Count badge */}
      <p className="text-[11px] text-slate-400 mt-1.5">
        {files.length} / {maxFiles} imágenes · Pasá el cursor para eliminar
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
}
