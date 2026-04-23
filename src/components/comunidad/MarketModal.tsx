'use client';

import { useState, useEffect } from 'react';
import { ImageUpload } from '@/components/comunidad/ImageUpload';

/* ─── Static data ─── */
const LISTING_TYPES = [
  {
    value: 'sell',
    label: 'Vendo',
    icon: 'sell',
    color: 'from-emerald-400 to-teal-500',
    selectedBorder: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300',
    border: 'border-emerald-200 bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-800',
    desc: 'Publicá un artículo que querés vender.',
  },
  {
    value: 'buy',
    label: 'Compro',
    icon: 'shopping_cart',
    color: 'from-blue-400 to-indigo-500',
    selectedBorder: 'border-blue-500 bg-blue-50 ring-2 ring-blue-300',
    border: 'border-blue-200 bg-blue-50',
    badge: 'bg-blue-100 text-blue-800',
    desc: 'Buscás algo específico y querés que te contacten.',
  },
  {
    value: 'trade',
    label: 'Permuto',
    icon: 'swap_horiz',
    color: 'from-amber-400 to-orange-500',
    selectedBorder: 'border-amber-500 bg-amber-50 ring-2 ring-amber-300',
    border: 'border-amber-200 bg-amber-50',
    badge: 'bg-amber-100 text-amber-800',
    desc: 'Tenés algo para ofrecer a cambio de otra cosa.',
  },
];

const ITEM_CATEGORIES = [
  { value: 'instrumental',  label: 'Instrumental',          icon: 'medical_services' },
  { value: 'materiales',    label: 'Materiales Dentales',   icon: 'science' },
  { value: 'equipamiento',  label: 'Equipamiento',          icon: 'settings' },
  { value: 'mobiliario',    label: 'Mobiliario',            icon: 'chair' },
  { value: 'libros',        label: 'Libros / Bibliografía', icon: 'menu_book' },
  { value: 'tecnologia',    label: 'Tecnología / Software', icon: 'computer' },
  { value: 'indumentaria',  label: 'Indumentaria',          icon: 'checkroom' },
  { value: 'otro',          label: 'Otro',                  icon: 'category' },
];

const CONDITIONS = [
  { value: 'new',       label: 'Nuevo',          desc: 'Sin uso, en caja o embalaje original' },
  { value: 'like_new',  label: 'Como nuevo',     desc: 'Muy poco uso, impecable' },
  { value: 'good',      label: 'Buen estado',    desc: 'Uso normal, funciona perfectamente' },
  { value: 'fair',      label: 'Uso visible',    desc: 'Desgaste estético, funciona bien' },
];

const CURRENCIES = ['USD', 'ARS', 'MXN', 'CLP', 'COP', 'PEN', 'UYU', 'BRL', 'EUR'];

const COUNTRIES = [
  'Argentina', 'México', 'Colombia', 'Chile', 'Venezuela', 'Perú',
  'Uruguay', 'Ecuador', 'Bolivia', 'Paraguay', 'Brasil', 'España', 'Otro',
];

/* ─── Types ─── */
interface Props { onClose: () => void; }

export function MarketModal({ onClose }: Props) {
  const [listingType, setListingType] = useState<'sell' | 'buy' | 'trade'>('sell');
  const [title, setTitle] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [price, setPrice] = useState('');
  const [priceConvenir, setPriceConvenir] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [condition, setCondition] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [tradeFor, setTradeFor] = useState('');
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function resetTypeFields() {
    setPrice(''); setPriceConvenir(false); setCondition(''); setTradeFor('');
  }

  const selectedType = LISTING_TYPES.find((t) => t.value === listingType)!;
  const isSell  = listingType === 'sell';
  const isBuy   = listingType === 'buy';
  const isTrade = listingType === 'trade';

  const canSubmit =
    title.trim() &&
    itemCategory &&
    country &&
    city.trim() &&
    description.trim() &&
    disclaimerAccepted &&
    (isBuy || condition) &&
    (isTrade ? tradeFor.trim() : true);

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl animate-fade-in-up">
          <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-emerald-600 text-[36px]">
              {isSell ? 'sell' : isBuy ? 'shopping_cart' : 'swap_horiz'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">¡Publicación enviada!</h2>
          <p className="text-slate-500 text-sm mb-4">
            Tu aviso de <strong>{selectedType.label}</strong> fue publicado en el Mercado de OdontoLatam.
          </p>
          <div className="bg-slate-50 rounded-xl px-4 py-3 text-left mb-5">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <span className="material-symbols-outlined text-[13px] align-middle text-slate-400 mr-0.5">info</span>
              Los interesados se contactarán con vos directamente. OdontoLatam no participa en la transacción.
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            Ver el Mercado
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh] animate-fade-in-up">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Publicar en el Mercado</h2>
            <p className="text-xs text-slate-400 mt-0.5">Instrumental, materiales y equipamiento entre colegas</p>
          </div>
          <button onClick={onClose} className="size-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition">
            <span className="material-symbols-outlined text-[22px] text-slate-500">close</span>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* ── Disclaimer banner (siempre visible, arriba) ── */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5">gavel</span>
            <div>
              <p className="text-xs font-bold text-amber-800 mb-1">Aviso importante</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                OdontoLatam es un espacio de encuentro entre compradores y vendedores de la comunidad odontológica.
                <strong> No verificamos la autenticidad de los anuncios, no intervenimos en las transacciones ni nos responsabilizamos</strong> por
                acuerdos, pagos, envíos, calidad del producto o disputas entre las partes.
                Acordá los términos directamente con el otro usuario y actuá con precaución.
              </p>
            </div>
          </div>

          {/* ── Tipo de publicación ── */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">¿Qué querés hacer?</label>
            <div className="grid grid-cols-3 gap-2.5">
              {LISTING_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => { setListingType(t.value as typeof listingType); resetTypeFields(); }}
                  className={`relative flex flex-col items-center text-center px-3 py-4 rounded-xl border-2 transition-all duration-200 ${
                    listingType === t.value ? t.selectedBorder : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`size-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center mb-2 shadow-sm`}>
                    <span className="material-symbols-outlined text-white text-[20px]">{t.icon}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{t.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{t.desc}</span>
                  {listingType === t.value && (
                    <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[13px]">check</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Título ── */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              {isSell ? '¿Qué vendés?' : isBuy ? '¿Qué buscás?' : '¿Qué ofrecés?'} *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isSell  ? 'Ej: Motor de implantes NSK Surgic Pro2' :
                isBuy   ? 'Ej: Ultrasonido Piezon Master 700' :
                          'Ej: Kit de instrumental de periodoncia Hu-Friedy'
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
            />
          </div>

          {/* ── Categoría del artículo ── */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Categoría *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ITEM_CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setItemCategory(itemCategory === c.value ? '' : c.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition ${
                    itemCategory === c.value
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-400">{c.icon}</span>
                  <span className="text-xs font-semibold text-slate-700">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Precio (solo Vendo/Permuto) ── */}
          {!isBuy && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                {isSell ? 'Precio' : 'Valor estimado del artículo'}
              </label>
              <div className="flex gap-2 items-center">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={priceConvenir}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-40"
                >
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={priceConvenir}
                  placeholder="0"
                  min="0"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-40 disabled:bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => { setPriceConvenir(!priceConvenir); setPrice(''); }}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition whitespace-nowrap ${
                    priceConvenir ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  A convenir
                </button>
              </div>
            </div>
          )}

          {/* ── Presupuesto máximo (solo Compro) ── */}
          {isBuy && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Presupuesto máximo <span className="font-normal text-slate-300 normal-case tracking-normal">(opcional)</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Dejar en blanco si es flexible"
                  min="0"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
                />
              </div>
            </div>
          )}

          {/* ── Condición (Vendo y Permuto) ── */}
          {!isBuy && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Estado del artículo *</label>
              <div className="grid grid-cols-2 gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCondition(condition === c.value ? '' : c.value)}
                    className={`flex flex-col items-start px-3 py-2.5 rounded-xl border-2 transition text-left ${
                      condition === c.value
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-sm font-bold text-slate-800">{c.label}</span>
                    <span className="text-[11px] text-slate-400 leading-tight">{c.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Qué pedís a cambio (Permuto) ── */}
          {isTrade && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">¿Qué buscás a cambio? *</label>
              <input
                value={tradeFor}
                onChange={(e) => setTradeFor(e.target.value)}
                placeholder="Ej: Instrumental de implantes, materiales de composite, etc."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
              />
            </div>
          )}

          {/* ── Ubicación ── */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Ubicación * <span className="font-normal text-slate-400 normal-case tracking-normal">— importante para coordinar</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-slate-700"
              >
                <option value="">País...</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ciudad *"
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">info</span>
              Indicar la ciudad ayuda al comprador/vendedor a saber si el intercambio es posible y cómo coordinar.
            </p>
          </div>

          {/* ── Descripción ── */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              {isSell ? 'Descripción del artículo' : isBuy ? 'Descripción de lo que buscás' : 'Descripción del artículo y del intercambio'} *
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isSell
                  ? 'Describí el artículo: marca, modelo, uso, estado detallado, qué incluye (accesorios, garantía, factura), motivo de venta...'
                  : isBuy
                  ? 'Describí lo que buscás: marca preferida, modelo, estado aceptable, si se pueden hacer envíos, forma de pago...'
                  : 'Describí el artículo que ofrecés y lo que buscás a cambio. Aclará si podés sumar dinero a favor...'
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y placeholder:text-slate-300"
            />
          </div>

          {/* ── Imágenes ── */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Fotos {isSell ? 'del artículo' : isBuy ? '(referencia)' : 'del artículo'}
              <span className="font-normal text-slate-400 normal-case tracking-normal ml-1">
                {isSell ? '(hasta 8, muy recomendado)' : '(opcional)'}
              </span>
            </label>
            <ImageUpload
              files={images}
              onChange={setImages}
              maxFiles={8}
              hint={isSell ? 'Incluí fotos reales — aumenta mucho las consultas. PNG, JPG' : 'Referencia opcional. PNG, JPG'}
              dropzoneClass="hover:border-emerald-400/50 hover:bg-emerald-50"
            />
          </div>

          {/* ── Disclaimer checkbox ── */}
          <div className={`rounded-xl border-2 px-4 py-4 transition ${disclaimerAccepted ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="sr-only"
                />
                <div className={`size-5 rounded flex items-center justify-center border-2 transition ${disclaimerAccepted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                  {disclaimerAccepted && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 mb-1">Acepto los términos de uso del Mercado *</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Entiendo que <strong>OdontoLatam no es parte de esta transacción</strong>. La plataforma no verifica vendedores, no intermedia pagos, no gestiona envíos y no se responsabiliza por el resultado de ningún acuerdo entre usuarios. Me comprometo a actuar de buena fe y a no publicar artículos falsos, robados o que infrinjan derechos de terceros.
                </p>
              </div>
            </label>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-white sm:rounded-b-2xl">
          {/* Preview tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${selectedType.badge}`}>
              <span className="material-symbols-outlined text-[12px]">{selectedType.icon}</span>
              {selectedType.label}
            </span>
            {itemCategory && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {ITEM_CATEGORIES.find((c) => c.value === itemCategory)?.label}
              </span>
            )}
            {city && country && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                <span className="material-symbols-outlined text-[12px]">location_on</span>
                {city}, {country}
              </span>
            )}
            {!isBuy && condition && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {CONDITIONS.find((c) => c.value === condition)?.label}
              </span>
            )}
            {!isBuy && (priceConvenir ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-white">A convenir</span>
            ) : price ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-white">{currency} {parseInt(price).toLocaleString('es-AR')}</span>
            ) : null)}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
              Cancelar
            </button>
            <button
              onClick={() => { if (canSubmit) setSubmitted(true); }}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              Publicar aviso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
