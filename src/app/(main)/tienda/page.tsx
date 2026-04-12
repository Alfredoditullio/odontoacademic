'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, PRODUCT_CATEGORIES } from '@/data/mock-products';
import { useCartStore } from '@/lib/cart-store';
import { formatCurrency } from '@/lib/utils';

export default function TiendaPage() {
  const [category, setCategory] = useState('Todos');
  const addItem = useCartStore((s) => s.addItem);
  const totalItems = useCartStore((s) => s.totalItems);

  const filtered = PRODUCTS.filter((p) => category === 'Todos' || p.category === category);

  return (
    <>
      <section className="bg-gradient-to-br from-amber-500 to-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[32px]">storefront</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Tienda</h1>
          </div>
          <p className="text-white/80 max-w-2xl">Instrumental y materiales dentales de las mejores marcas.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {PRODUCT_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  category === c ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-lg transition">
                <Link href={`/tienda/${product.id}`}>
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt="" className="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white font-bold text-xs px-3 py-1 rounded-full uppercase">Agotado</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">{product.category}</span>
                  <Link href={`/tienda/${product.id}`}>
                    <h3 className="font-bold text-slate-900 text-sm mt-1 line-clamp-2 group-hover:text-amber-600 transition">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-slate-400 mt-1">{product.brand}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-extrabold text-slate-900">{formatCurrency(product.price, product.currency)}</span>
                    <button
                      onClick={() => addItem(product)}
                      disabled={!product.inStock}
                      className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating cart button */}
      {totalItems() > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-full shadow-lg hover:bg-primary/90 transition">
            <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
            <span className="font-bold">{totalItems()}</span>
          </button>
        </div>
      )}
    </>
  );
}
