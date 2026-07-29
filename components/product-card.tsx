import Image from 'next/image';
import Link from 'next/link';
import type { ShopifyProduct } from '@/lib/shopify';
import { formatPrice } from '@/lib/format';

export default function ProductCard({ product }: { product: ShopifyProduct }) {
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const available = product.variants.edges.some((v) => v.node.availableForSale);

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white border border-brand-border shadow-sm group-hover:shadow-lg transition-all duration-300">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-border/50" />
        )}
        {!available && (
          <span className="absolute top-4 left-4 bg-white/95 text-brand-text text-xs px-4 py-2 font-medium tracking-wide">
            SOLD OUT
          </span>
        )}
        {available && (
          <div className="absolute inset-0 bg-brand-accent/0 group-hover:bg-brand-accent/10 transition-colors duration-300 flex items-center justify-center">
            <span className="bg-brand-accent text-white text-xs px-6 py-3 font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              QUICK VIEW
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium text-brand-text group-hover:text-brand-accent transition-colors line-clamp-2 tracking-wide">
          {product.title}
        </h3>
        <p className="text-sm text-brand-muted font-light">
          {formatPrice(price.amount, price.currencyCode)}
        </p>
      </div>
    </Link>
  );
}
