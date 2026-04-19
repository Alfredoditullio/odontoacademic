'use client';

import { useState, useEffect, useRef } from 'react';

/* ─── Static data ─── */
const SPECIALTIES = [
  'Odontología General', 'Implantología', 'Periodoncia', 'Endodoncia',
  'Ortodoncia', 'Cirugía Oral y Maxilofacial', 'Rehabilitación Oral',
  'Estética Dental', 'Odontopediatría', 'Radiología Oral', 'Docencia / Investigación', 'Otra',
];

const STUDENT_INTERESTS = [
  'Sin definir aún', 'Odontología General', 'Implantología', 'Periodoncia',
  'Endodoncia', 'Ortodoncia', 'Cirugía Oral', 'Rehabilitación Oral',
  'Estética Dental', 'Odontopediatría', 'Investigación',
];

const STUDY_YEARS = ['1° año', '2° año', '3° año', '4° año', '5° año', '6° año'];

const COUNTRIES = [
  'Argentina', 'México', 'Colombia', 'Chile', 'Venezuela', 'Perú',
  'Uruguay', 'Ecuador', 'Bolivia', 'Paraguay', 'Brasil', 'España', 'Otro',
];

const TABS = [
  { id: 'perfil',          icon: 'person',        label: 'Mi Perfil'      },
  { id: 'cuenta',          icon: 'lock',           label: 'Cuenta'         },
  { id: 'notificaciones',  icon: 'notifications',  label: 'Notificaciones' },
  { id: 'privacidad',      icon: 'shield',         label: 'Privacidad'     },
];

const LS_KEY = 'ol_profile';

interface ProfileData {
  displayName: string; handle: string; specialty: string;
  licenseNumber: string; bio: string; country: string; city: string;
  phone: string; website: string; acceptsReferrals: boolean;
  avatarInitials: string; avatarColor: string;
  // Student / Professional role
  accountRole: 'professional' | 'student';
  studyYear: string;
  university: string;
}

interface NotifData {
  comments: boolean; mentions: boolean; messages: boolean;
  specialistAlerts: boolean; categoryUpdates: boolean; news: boolean;
  emailDigest: boolean; emailMentions: boolean;
}

interface PrivacyData {
  profilePublic: boolean; showPhone: boolean;
  showInDirectory: boolean; allowMessages: boolean; showOnline: boolean;
}

const AVATAR_COLORS = [
  'from-sky-500 to-cyan-500', 'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-500', 'from-indigo-500 to-blue-600',
];

const DEFAULT_PROFILE: ProfileData = {
  displayName: '', handle: '', specialty: '', licenseNumber: '',
  bio: '', country: '', city: '', phone: '', website: '',
  acceptsReferrals: true, avatarInitials: 'MR', avatarColor: AVATAR_COLORS[0],
  accountRole: 'professional', studyYear: '', university: '',
};

const DEFAULT_NOTIF: NotifData = {
  comments: true, mentions: true, messages: true,
  specialistAlerts: true, categoryUpdates: false, news: false,
  emailDigest: false, emailMentions: true,
};

const DEFAULT_PRIVACY: PrivacyData = {
  profilePublic: true, showPhone: false,
  showInDirectory: true, allowMessages: true, showOnline: true,
};

/* ─── Helper components ─── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-primary' : 'bg-slate-300'}`}
    >
      <div className={`absolute top-1 size-4 rounded-full bg-white shadow transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

function SaveBar({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
      {saved && (
        <span className="text-sm text-emerald-600 font-semibold flex items-center gap-1 animate-fade-in-up">
          <span className="material-symbols-outlined text-[17px]">check_circle</span>
          Guardado
        </span>
      )}
      <button
        onClick={onSave}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm"
      >
        <span className="material-symbols-outlined text-[18px]">save</span>
        Guardar cambios
      </button>
    </div>
  );
}

/* ─── Main page ─── */
export default function ConfiguracionPage() {
  const [tab, setTab] = useState('perfil');
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [notif, setNotif] = useState<NotifData>(DEFAULT_NOTIF);
  const [privacy, setPrivacy] = useState<PrivacyData>(DEFAULT_PRIVACY);
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bioLen, setBioLen] = useState(0);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwSaved, setPwSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* Load from localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.profile)  setProfile({ ...DEFAULT_PROFILE, ...data.profile });
        if (data.notif)    setNotif({ ...DEFAULT_NOTIF, ...data.notif });
        if (data.privacy)  setPrivacy({ ...DEFAULT_PRIVACY, ...data.privacy });
        if (data.avatar)   setAvatarPreview(data.avatar);
        setBioLen((data.profile?.bio ?? '').length);
      }
    } catch { /* ignore */ }
  }, []);

  function persist(p = profile, n = notif, pr = privacy, av = avatarPreview) {
    localStorage.setItem(LS_KEY, JSON.stringify({ profile: p, notif: n, privacy: pr, avatar: av }));
  }

  function save() {
    persist(); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function setP<K extends keyof ProfileData>(k: K, v: ProfileData[K]) {
    setProfile((prev) => ({ ...prev, [k]: v }));
  }

  function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setAvatarPreview(url);
    };
    reader.readAsDataURL(file);
  }

  function initials(name: string) {
    return name.trim().split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'YO';
  }

  const displayInitials = profile.displayName ? initials(profile.displayName) : 'YO';

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Page header */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600" />
        <div className="px-6 pb-6 -mt-10 flex items-end gap-5">
          {/* Avatar */}
          <div className="relative group">
            <div className={`size-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br ${profile.avatarColor} flex items-center justify-center`}>
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" className="size-full object-cover" />
                : <span className="text-white text-2xl font-extrabold">{displayInitials}</span>
              }
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-white text-[22px]">photo_camera</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
          </div>

          <div className="flex-1 min-w-0 mb-1">
            <h1 className="text-xl font-extrabold text-slate-900 truncate">
              {profile.displayName || 'Tu nombre'}
            </h1>
            <p className="text-sm text-slate-500">
              {profile.accountRole === 'student'
                ? `${profile.studyYear || 'Estudiante'}${profile.university ? ` · ${profile.university}` : ''}${profile.city ? ` · ${profile.city}` : ''}`
                : `${profile.specialty || 'Tu especialidad'}${profile.city ? ` · ${profile.city}` : ''}`
              }
            </p>
          </div>

          {/* Color picker for avatar background */}
          <div className="hidden sm:flex items-center gap-1.5 mb-1">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c}
                title="Color del avatar"
                onClick={() => setP('avatarColor', c)}
                className={`size-6 rounded-full bg-gradient-to-br ${c} transition ring-offset-1 ${profile.avatarColor === c ? 'ring-2 ring-slate-400' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSaved(false); }}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ════════════ PERFIL ════════════ */}
          {tab === 'perfil' && (
            <div className="space-y-5">

              {/* ── Selector de rol ── */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">Soy...</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: 'professional',
                      icon: 'stethoscope',
                      label: 'Odontólogo/a',
                      desc: 'Profesional graduado o en residencia',
                      color: 'border-sky-400 bg-sky-50 ring-2 ring-sky-200',
                      iconColor: 'text-sky-600',
                    },
                    {
                      value: 'student',
                      icon: 'school',
                      label: 'Estudiante',
                      desc: 'Cursando la carrera de odontología',
                      color: 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200',
                      iconColor: 'text-indigo-600',
                    },
                  ].map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setP('accountRole', r.value as 'professional' | 'student')}
                      className={`relative flex flex-col items-center text-center px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
                        profile.accountRole === r.value ? r.color : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[28px] mb-1.5 ${profile.accountRole === r.value ? r.iconColor : 'text-slate-400'}`}>
                        {r.icon}
                      </span>
                      <span className="text-sm font-bold text-slate-800">{r.label}</span>
                      <span className="text-[11px] text-slate-400 mt-0.5 leading-tight">{r.desc}</span>
                      {profile.accountRole === r.value && (
                        <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-sky-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-[13px]">check</span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Campos exclusivos de estudiante ── */}
              {profile.accountRole === 'student' && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-4">
                  <p className="text-[11px] font-black uppercase tracking-widest text-indigo-400">Datos académicos</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Año de cursada *</label>
                      <select
                        value={profile.studyYear}
                        onChange={(e) => setP('studyYear', e.target.value)}
                        className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-slate-700"
                      >
                        <option value="">Seleccioná tu año...</option>
                        {STUDY_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Facultad / Universidad</label>
                      <input
                        value={profile.university}
                        onChange={(e) => setP('university', e.target.value)}
                        placeholder="Ej: UBA, UNAM, U. de Chile..."
                        className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Nombre completo *</label>
                  <input
                    value={profile.displayName}
                    onChange={(e) => setP('displayName', e.target.value)}
                    placeholder="Ej: Dra. María González"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
                  />
                </div>
                {/* Handle */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Usuario (@handle)</label>
                  <div className="flex">
                    <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 flex items-center text-slate-400 text-sm font-semibold">@</span>
                    <input
                      value={profile.handle}
                      onChange={(e) => setP('handle', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="tu-usuario"
                      className="flex-1 border border-slate-200 rounded-r-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Solo letras minúsculas, números y guiones</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Especialidad / Área de interés */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    {profile.accountRole === 'student' ? 'Área de interés' : 'Especialidad *'}
                  </label>
                  <select
                    value={profile.specialty}
                    onChange={(e) => setP('specialty', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-slate-700"
                  >
                    <option value="">
                      {profile.accountRole === 'student' ? '¿Qué te interesa más?' : 'Seleccioná tu especialidad...'}
                    </option>
                    {(profile.accountRole === 'student' ? STUDENT_INTERESTS : SPECIALTIES).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {/* Matrícula — solo para profesionales */}
                {profile.accountRole === 'professional' && (
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Número de Matrícula
                      <span className="ml-1.5 inline-flex items-center gap-0.5 text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full normal-case tracking-normal">
                        <span className="material-symbols-outlined text-[10px]">schedule</span>
                        Pendiente verificación
                      </span>
                    </label>
                    <input
                      value={profile.licenseNumber}
                      onChange={(e) => setP('licenseNumber', e.target.value)}
                      placeholder="Ej: 12345 (Colegio Odontológico)"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Cuando esté verificada, aparecerá un badge en tu perfil.</p>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400">Biografía</label>
                  <span className={`text-[10px] font-semibold ${bioLen > 260 ? 'text-red-500' : 'text-slate-400'}`}>{bioLen}/280</span>
                </div>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => { if (e.target.value.length <= 280) { setP('bio', e.target.value); setBioLen(e.target.value.length); } }}
                  placeholder="Contale a la comunidad quién sos, tu experiencia y en qué te especializás..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none placeholder:text-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* País */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">País</label>
                  <select
                    value={profile.country}
                    onChange={(e) => setP('country', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-slate-700"
                  >
                    <option value="">Seleccioná tu país...</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {/* Ciudad */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Ciudad</label>
                  <input
                    value={profile.city}
                    onChange={(e) => setP('city', e.target.value)}
                    placeholder="Ej: Buenos Aires"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Teléfono */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    WhatsApp / Teléfono
                  </label>
                  <div className="flex">
                    <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 flex items-center">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">phone</span>
                    </span>
                    <input
                      value={profile.phone}
                      onChange={(e) => setP('phone', e.target.value)}
                      placeholder="+54 9 11 1234-5678"
                      className="flex-1 border border-slate-200 rounded-r-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
                    />
                  </div>
                </div>
                {/* Website */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Sitio web / Instagram</label>
                  <div className="flex">
                    <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 flex items-center">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">link</span>
                    </span>
                    <input
                      value={profile.website}
                      onChange={(e) => setP('website', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 border border-slate-200 rounded-r-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Acepta derivaciones — solo profesionales */}
              {profile.accountRole === 'professional' && (
              <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-200">
                <div>
                  <p className="text-sm font-bold text-slate-800">Acepto derivaciones</p>
                  <p className="text-xs text-slate-500 mt-0.5">Aparecerás en el directorio como disponible para recibir derivaciones de colegas.</p>
                </div>
                <Toggle checked={profile.acceptsReferrals} onChange={(v) => setP('acceptsReferrals', v)} />
              </div>
              )}

              <SaveBar onSave={save} saved={saved} />
            </div>
          )}

          {/* ════════════ CUENTA ════════════ */}
          {tab === 'cuenta' && (
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Correo electrónico</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">mail</span>
                  <span className="text-sm text-slate-600 flex-1">tu@email.com</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Verificado</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Para cambiar tu email contactá al soporte.</p>
              </div>

              {/* Cambiar contraseña */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">lock</span>
                  Cambiar contraseña
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Contraseña actual</label>
                    <input
                      type="password"
                      value={pw.current}
                      onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Nueva contraseña</label>
                      <input
                        type="password"
                        value={pw.next}
                        onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
                        placeholder="Mín. 8 caracteres"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Confirmar contraseña</label>
                      <input
                        type="password"
                        value={pw.confirm}
                        onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
                        placeholder="Repetí la nueva"
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                          pw.confirm && pw.next !== pw.confirm ? 'border-red-300 bg-red-50' : 'border-slate-200'
                        } focus:border-primary`}
                      />
                      {pw.confirm && pw.next !== pw.confirm && (
                        <p className="text-[10px] text-red-500 mt-1">Las contraseñas no coinciden</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 mt-4">
                  {pwSaved && (
                    <span className="text-sm text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[17px]">check_circle</span>
                      Contraseña actualizada
                    </span>
                  )}
                  <button
                    onClick={() => {
                      if (pw.current && pw.next && pw.next === pw.confirm) {
                        setPwSaved(true); setPw({ current: '', next: '', confirm: '' });
                        setTimeout(() => setPwSaved(false), 3000);
                      }
                    }}
                    disabled={!pw.current || !pw.next || pw.next !== pw.confirm}
                    className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Actualizar contraseña
                  </button>
                </div>
              </div>

              {/* Danger zone */}
              <div className="border border-red-200 rounded-xl p-5 bg-red-50">
                <h3 className="text-sm font-bold text-red-700 mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  Zona de peligro
                </h3>
                <p className="text-xs text-red-600 mb-4">Estas acciones son irreversibles. Pensalo bien antes de continuar.</p>
                <button className="text-xs font-bold text-red-600 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-100 transition">
                  Eliminar mi cuenta
                </button>
              </div>
            </div>
          )}

          {/* ════════════ NOTIFICACIONES ════════════ */}
          {tab === 'notificaciones' && (
            <div className="space-y-6">
              {/* Push */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">notifications</span>
                  Notificaciones push
                </h3>
                <p className="text-xs text-slate-500 mb-4">Las que ves en la campanita dentro de la comunidad.</p>
                <div className="space-y-3">
                  {[
                    { key: 'comments',        label: 'Comentarios en mis posts',       desc: 'Cuando alguien comenta en algo que publicaste.' },
                    { key: 'mentions',         label: 'Menciones (@handle)',             desc: 'Cuando alguien te menciona en un post o comentario.' },
                    { key: 'messages',         label: 'Mensajes privados',              desc: 'Cuando recibís un mensaje directo de otro usuario.' },
                    { key: 'specialistAlerts', label: 'Alertas de especialidad',        desc: 'Cuando alguien pide ayuda en tu área de especialidad.' },
                    { key: 'categoryUpdates', label: 'Novedades en categorías',        desc: 'Posts nuevos en las categorías que seguís.' },
                    { key: 'news',             label: 'Novedades de OdontoLatam',       desc: 'Anuncios y actualizaciones de la plataforma.' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{label}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                      <Toggle
                        checked={notif[key as keyof NotifData] as boolean}
                        onChange={(v) => setNotif((n) => ({ ...n, [key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">mail</span>
                  Notificaciones por email
                </h3>
                <p className="text-xs text-slate-500 mb-4">Resúmenes y alertas enviadas a tu correo.</p>
                <div className="space-y-3">
                  {[
                    { key: 'emailMentions', label: 'Menciones y respuestas', desc: 'Te avisamos por email cuando te mencionan.' },
                    { key: 'emailDigest',   label: 'Resumen semanal',         desc: 'Un resumen de los mejores casos y debates de la semana.' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{label}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                      <Toggle
                        checked={notif[key as keyof NotifData] as boolean}
                        onChange={(v) => setNotif((n) => ({ ...n, [key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <SaveBar onSave={save} saved={saved} />
            </div>
          )}

          {/* ════════════ PRIVACIDAD ════════════ */}
          {tab === 'privacidad' && (
            <div className="space-y-3">
              {[
                {
                  key: 'profilePublic',
                  icon: 'public',
                  label: 'Perfil público',
                  desc: 'Tu perfil es visible para todos, incluso usuarios no registrados.',
                  warn: false,
                },
                {
                  key: 'showInDirectory',
                  icon: 'group',
                  label: 'Aparecer en el Directorio',
                  desc: 'Tu nombre y especialidad serán visibles en el directorio de profesionales.',
                  warn: false,
                },
                {
                  key: 'allowMessages',
                  icon: 'mail',
                  label: 'Recibir mensajes directos',
                  desc: 'Otros usuarios de la comunidad pueden enviarte mensajes privados.',
                  warn: false,
                },
                {
                  key: 'showPhone',
                  icon: 'phone',
                  label: 'Mostrar teléfono en mi perfil',
                  desc: 'Tu número de WhatsApp/teléfono será visible para otros miembros.',
                  warn: true,
                },
                {
                  key: 'showOnline',
                  icon: 'circle',
                  label: 'Mostrar estado en línea',
                  desc: 'Otros usuarios verán cuando estás activo en la plataforma.',
                  warn: false,
                },
              ].map(({ key, icon, label, desc, warn }) => (
                <div key={key} className={`flex items-center justify-between py-4 px-4 rounded-xl border transition ${
                  warn && privacy[key as keyof PrivacyData] ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <span className={`material-symbols-outlined text-[20px] mt-0.5 ${warn && privacy[key as keyof PrivacyData] ? 'text-amber-500' : 'text-slate-400'}`}>
                      {icon}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                      {warn && privacy[key as keyof PrivacyData] && (
                        <p className="text-[10px] text-amber-600 font-semibold mt-1">
                          <span className="material-symbols-outlined text-[11px] align-middle">warning</span>
                          {' '}Tu teléfono será visible para todos los miembros verificados.
                        </p>
                      )}
                    </div>
                  </div>
                  <Toggle
                    checked={privacy[key as keyof PrivacyData] as boolean}
                    onChange={(v) => setPrivacy((p) => ({ ...p, [key]: v }))}
                  />
                </div>
              ))}

              <SaveBar onSave={save} saved={saved} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
