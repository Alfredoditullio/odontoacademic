'use client';

import { use } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/mock-products';
import { useCartStore } from '@/lib/cart-store';
import { formatCurrency } from '@/lib/utils';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Producto no encontrado</p>
        <Link href="/tienda" className="text-primary font-semibold mt-4 inline-block">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/tienda" className="flex items-center gap-1 text-sm text-primary font-semibold mb-6 hover:underline">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver a la Tienda
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt="" className="size-full object-cover" />
          </div>

          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{product.category}</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2 mb-2">{product.name}</h1>
            <p className="text-sm text-slate-400 mb-4">{product.brand}</p>

            <div className="text-3xl font-extrabold text-slate-900 mb-6">
              {formatCurrency(product.price, product.currency)}
            </div>

            <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

            {/* Specs */}
            {Object.keys(product.specs).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Especificaciones</h3>
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{key}</span>
                      <span className="font-semibold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => addItem(product)}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                {product.inStock ? 'Agregar al carrito' : 'Agotado'}
              </button>
            </div>

            {product.inStock ? (
              <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                En stock — Envío disponible
              </p>
            ) : (
              <p className="text-xs text-red-500 font-semibold mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">cancel</span>
                Sin stock
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
