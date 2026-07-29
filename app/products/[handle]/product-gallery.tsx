'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ShopifyImage } from '@/lib/shopify';

export default function ProductGallery({
  images,
  title,
}: {
  images: ShopifyImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) {
    return (
      <div className="aspect-[3/4] rounded-lg bg-brand-border/40 border border-brand-border" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white border border-brand-border shadow-sm">
        <Image
          src={current.url}
          alt={current.altText ?? title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                active === i ? 'border-brand-accent shadow-sm' : 'border-brand-border hover:border-brand-accent/50'
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${title} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
