'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const SPECIALTIES = [
  'Odontología General', 'Implantología', 'Periodoncia', 'Endodoncia',
  'Ortodoncia', 'Cirugía Oral y Maxilofacial', 'Rehabilitación Oral',
  'Estética Dental', 'Odontopediatría', 'Radiología Oral', 'Docencia / Investigación',
];

const COUNTRIES = [
  'Argentina', 'México', 'Colombia', 'Chile', 'Venezuela', 'Perú',
  'Uruguay', 'Ecuador', 'Bolivia', 'Paraguay', 'Brasil', 'España', 'Otro',
];

export default function LoginPage() {
  const [mode, setMode]           = useState<'login' | 'register' | 'confirm'>('login');
  const [role, setRole]           = useState<'professional' | 'student'>('professional');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [name, setName]           = useState('');
  const [specialty, setSpecialty] = useState('');
  const [country, setCountry]     = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/comunidad';
      } else {
        if (!name.trim()) throw new Error('El nombre es obligatorio.');
        if (password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.');

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              display_name: name.trim(),
              role,
              specialty: specialty || null,
              country: country || null,
              newsletter_subscribed: newsletter,
            },
          },
        });
        if (error) throw error;
        setMode('confirm');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ocurrió un error. Intentá de nuevo.';
      if (msg.includes('Invalid login credentials')) setError('Email o contraseña incorrectos.');
      else if (msg.includes('User already registered')) setError('Ya existe una cuenta con ese email. Iniciá sesión.');
      else if (msg.includes('Email not confirmed')) setError('Confirmá tu email antes de ingresar.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300';

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">

      {/* ── Left branding panel (desktop only) ── */}
      <div className="hidden lg:flex w-[420px] shrink-0 relative bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-600 flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
        </div>

        <div className="relative">
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div className="size-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[24px]">public</span>
            </div>
            <div>
              <div className="text-lg font-extrabold text-white tracking-tight">OdontoLatam</div>
              <div className="text-xs text-white/70">La comunidad dental de LATAM</div>
            </div>
          </Link>

          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">
            La comunidad de odontólogos más grande de Latinoamérica
          </h1>
          <p className="text-white/75 leading-relaxed mb-8 text-sm">
            Casos clínicos, recursos exclusivos, networking profesional y mucho más. Todo en un solo lugar, gratis.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { value: '5.000+', label: 'Miembros', icon: 'group' },
              { value: '15',     label: 'Países',   icon: 'public' },
              { value: '10k+',   label: 'Casos',    icon: 'stethoscope' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center border border-white/15">
                <span className="material-symbols-outlined text-white/50 text-[18px] mb-1 block">{s.icon}</span>
                <div className="text-xl font-extrabold text-white">{s.value}</div>
                <div className="text-[10px] text-white/60 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4">
          <div className="flex items-center gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="material-symbols-outlined text-amber-300 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            ))}
          </div>
          <p className="text-white/85 text-xs leading-relaxed italic mb-3">
            "OdontoLatam transformó la forma en que me mantengo actualizado. Los debates con colegas de otros países me abrieron perspectivas únicas."
          </p>
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold shrink-0">MR</div>
            <div>
              <p className="text-white text-[11px] font-bold">Dr. Martín Rodríguez</p>
              <p className="text-white/55 text-[10px]">Implantólogo · Buenos Aires</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">

        {/* Mobile logo bar */}
        <div className="lg:hidden bg-gradient-to-r from-sky-600 to-teal-600 px-5 py-3.5 flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">public</span>
            </div>
            <span className="text-base font-extrabold text-white tracking-tight">OdontoLatam</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-6 sm:px-8">
          <div className="w-full max-w-[420px]">

            {/* ── Pantalla de confirmación ── */}
            {mode === 'confirm' ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
                <div className="size-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-teal-500 text-[36px]">mark_email_unread</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-2">Revisá tu email</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-1">
                  Te enviamos un link de confirmación a
                </p>
                <p className="text-sm font-bold text-slate-800 mb-4">{email}</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Hacé click en el link del email para activar tu cuenta y acceder a la comunidad. Revisá también la carpeta de spam.
                </p>
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Volver al inicio de sesión
                </button>
              </div>
            ) : (
              <>
                {/* Mode toggle */}
                <div className="bg-white border border-slate-200 rounded-2xl p-1 flex mb-4 shadow-sm">
                  <button
                    onClick={() => { setMode('login'); setError(''); }}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition ${mode === 'login' ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={() => { setMode('register'); setError(''); }}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition ${mode === 'register' ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Registrarse
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {mode === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta gratis'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {mode === 'login' ? 'Ingresá a tu cuenta para continuar.' : 'Únete a la comunidad dental más grande de LATAM.'}
                    </p>
                  </div>

                  {error && (
                    <div className="mb-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                      <span className="material-symbols-outlined text-red-500 text-[16px] mt-0.5 shrink-0">error</span>
                      <p className="text-xs text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3">

                    {mode === 'register' && (
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Soy...</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'professional', icon: 'stethoscope', label: 'Odontólogo/a' },
                            { value: 'student',      icon: 'school',      label: 'Estudiante'   },
                          ].map((r) => (
                            <button
                              key={r.value}
                              type="button"
                              onClick={() => setRole(r.value as 'professional' | 'student')}
                              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border-2 text-xs font-bold transition ${
                                role === r.value
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[16px]">{r.icon}</span>
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {mode === 'register' && (
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Nombre completo *</label>
                        <input
                          type="text" value={name} onChange={(e) => setName(e.target.value)}
                          placeholder={role === 'professional' ? 'Ej: Dra. María González' : 'Ej: Juan López'}
                          required className={inputCls}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Email *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-400">mail</span>
                        <input
                          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="tu@email.com" required
                          className={`${inputCls} pl-9`}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Contraseña *</label>
                        {mode === 'login' && (
                          <button type="button" className="text-[11px] text-primary font-semibold hover:underline">
                            ¿Olvidaste la contraseña?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-400">lock</span>
                        <input
                          type={showPw ? 'text' : 'password'} value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={mode === 'register' ? 'Mín. 8 caracteres' : '••••••••'}
                          required className={`${inputCls} pl-9 pr-10`}
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <span className="material-symbols-outlined text-[16px]">{showPw ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      </div>
                    </div>

                    {mode === 'register' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                            {role === 'student' ? 'Interés' : 'Especialidad'}
                          </label>
                          <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-slate-700"
                          >
                            <option value="">Seleccioná...</option>
                            {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">País</label>
                          <select value={country} onChange={(e) => setCountry(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-slate-700"
                          >
                            <option value="">País...</option>
                            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Newsletter checkbox — register only */}
                    {mode === 'register' && (
                      <label className="flex items-start gap-2.5 bg-sky-50/50 border border-sky-100 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-sky-50 transition">
                        <input
                          type="checkbox"
                          checked={newsletter}
                          onChange={(e) => setNewsletter(e.target.checked)}
                          className="mt-0.5 size-4 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer shrink-0"
                        />
                        <span className="text-[11px] text-slate-600 leading-snug">
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-primary">mail</span>
                            Quiero recibir la newsletter
                          </span>
                          <span className="block text-slate-500 mt-0.5">Novedades del mundo dental, casos clínicos y recursos gratis. Podés desuscribirte cuando quieras.</span>
                        </span>
                      </label>
                    )}

                    {mode === 'register' && (
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Al registrarte aceptás nuestros{' '}
                        <Link href="/terminos" className="text-primary font-semibold hover:underline">Términos</Link>
                        {' '}y la{' '}
                        <Link href="/privacidad" className="text-primary font-semibold hover:underline">Política de privacidad</Link>.
                      </p>
                    )}

                    <button
                      type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm disabled:opacity-70"
                    >
                      {loading ? (
                        <><span className="material-symbols-outlined text-[17px] animate-spin">progress_activity</span>
                        {mode === 'login' ? 'Ingresando...' : 'Creando cuenta...'}</>
                      ) : (
                        <><span className="material-symbols-outlined text-[17px]">{mode === 'login' ? 'login' : 'person_add'}</span>
                        {mode === 'login' ? 'Iniciar sesión' : 'Crear mi cuenta gratis'}</>
                      )}
                    </button>
                  </form>

                  <p className="text-center text-xs text-slate-500 mt-3">
                    {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
                    <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                      className="text-primary font-bold hover:underline"
                    >
                      {mode === 'login' ? 'Registrate gratis' : 'Iniciá sesión'}
                    </button>
                  </p>
                </div>

                <div className="text-center mt-4">
                  <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition">
                    <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                    Volver al inicio
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
