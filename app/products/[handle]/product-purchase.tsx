'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/format';

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
};

export default function ProductPurchase({
  variants,
}: {
  variants: Variant[];
}) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  const hasMultipleVariants = variants.length > 1 && variants[0]?.title !== 'Default Title';

  async function handleCheckout() {
    if (!selected?.availableForSale) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: selected.id, quantity: 1 }),
      });
      const data = await res.json();
      if (data.cartId) {
        localStorage.setItem('cartId', data.cartId);
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error ?? 'Could not start checkout. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!selected) return null;

  return (
    <div className="space-y-8">
      {hasMultipleVariants && (
        <div>
          <p className="text-xs uppercase tracking-widest text-brand-muted mb-4 font-medium">Size</p>
          <div className="flex flex-wrap gap-3">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={!variant.availableForSale}
                onClick={() => setSelectedId(variant.id)}
                className={`px-5 py-3 text-sm font-medium rounded-lg border transition-all ${
                  selectedId === variant.id
                    ? 'border-brand-accent bg-brand-accent text-brand-bg'
                    : variant.availableForSale
                      ? 'border-brand-border bg-white text-brand-text hover:border-brand-accent'
                      : 'border-brand-border/50 text-brand-muted/50 line-through cursor-not-allowed'
                }`}
              >
                {variant.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="font-serif text-3xl text-brand-text">
        {formatPrice(selected.price.amount, selected.price.currencyCode)}
      </p>

      {selected.availableForSale ? (
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="btn-primary w-full md:w-auto min-w-[280px]"
        >
          {loading ? 'Redirecting to checkout…' : 'ADD TO CART'}
        </button>
      ) : (
        <button type="button" disabled className="btn-primary w-full md:w-auto opacity-50 cursor-not-allowed">
          SOLD OUT
        </button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-brand-muted leading-relaxed">
        Free shipping on orders over $100 · Secure checkout powered by Shopify · 30-day returns
      </p>
    </div>
  );
}
