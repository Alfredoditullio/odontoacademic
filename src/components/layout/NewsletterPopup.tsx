'use client';

import { useState, useEffect } from 'react';

export function NewsletterPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('newsletter-dismissed');
    if (dismissed) return;

    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setShow(false);
    localStorage.setItem('newsletter-dismissed', 'true');
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in-up">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 size-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
        >
          <span className="material-symbols-outlined text-slate-400">close</span>
        </button>

        <div className="text-center mb-6">
          <div className="size-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-white text-[32px]">mail</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">
            No te pierdas nada
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Suscribite a nuestro newsletter y recibí las últimas noticias, artículos y recursos del mundo dental directamente en tu casilla.
          </p>
        </div>

        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); dismiss(); }}>
          <input
            type="email"
            required
            placeholder="tu@email.com"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-600 to-teal-600 text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition"
          >
            Suscribirme al Newsletter
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-3">
          Sin spam. Podés desuscribirte en cualquier momento.
        </p>
      </div>
    </div>
  );
}
