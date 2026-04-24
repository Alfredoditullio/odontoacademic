'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  const [mode, setMode]         = useState<'login' | 'register'>('login');
  const [role, setRole]         = useState<'professional' | 'student'>('professional');
  const [loading, setLoading]   = useState(false);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [specialty, setSpecialty] = useState('');
  const [country, setCountry]   = useState('');
  const [showPw, setShowPw]     = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { window.location.href = '/comunidad'; }, 1200);
  }

  /* Shared input class */
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

      {/* ── Right form panel ── */}
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

        {/* Form area — centered, compact */}
        <div className="flex-1 flex items-center justify-center px-5 py-6 sm:px-8">
          <div className="w-full max-w-[420px]">

            {/* Mode toggle */}
            <div className="bg-white border border-slate-200 rounded-2xl p-1 flex mb-4 shadow-sm">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition ${mode === 'login' ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition ${mode === 'register' ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Registrarse
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">

              {/* Header */}
              <div className="mb-4">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {mode === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta gratis'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mode === 'login' ? 'Ingresá a tu cuenta para continuar.' : 'Únete a la comunidad dental más grande de LATAM.'}
                </p>
              </div>

              {/* Google button */}
              <button className="w-full flex items-center justify-center gap-2.5 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition mb-3 shadow-sm">
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[11px] text-slate-400 font-medium">o con email</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Role selector — register only */}
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

                {/* Name — register only */}
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

                {/* Email */}
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

                {/* Password */}
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

                {/* Specialty + Country — register only */}
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

                {/* Terms — register only */}
                {mode === 'register' && (
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Al registrarte aceptás nuestros{' '}
                    <Link href="/terminos" className="text-primary font-semibold hover:underline">Términos</Link>
                    {' '}y la{' '}
                    <Link href="/privacidad" className="text-primary font-semibold hover:underline">Política de privacidad</Link>.
                  </p>
                )}

                {/* Submit */}
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

              {/* Switch mode */}
              <p className="text-center text-xs text-slate-500 mt-3">
                {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
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

          </div>
        </div>
      </div>
    </div>
  );
}
