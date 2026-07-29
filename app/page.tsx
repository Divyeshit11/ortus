import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];
  let error: string | null = null;

  try {
    products = await getAllProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch products';
    console.error('Error fetching products:', error);
  }

  return (
    <div>
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 m-4 rounded">
          <p className="font-semibold">Error loading products:</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2">Please check your Shopify API credentials in Vercel environment variables.</p>
        </div>
      )}

      {/* Hero */}
      <section className="bg-brand-accent-light text-center py-32 px-6">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-brand-text mb-6 tracking-tight">
          Timeless Style for Little Ones
        </h1>
        <p className="text-brand-muted max-w-2xl mx-auto mb-10 text-lg font-light">
          Premium essentials crafted with care. Where comfort meets contemporary design for the modern family.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalog"
            className="inline-block bg-brand-accent text-brand-bg px-10 py-4 text-sm font-medium tracking-wide hover:bg-brand-text transition-colors"
          >
            SHOP COLLECTION
          </Link>
          <Link
            href="/catalog"
            className="inline-block border-2 border-brand-accent text-brand-accent px-10 py-4 text-sm font-medium tracking-wide hover:bg-brand-accent hover:text-brand-bg transition-colors"
          >
            NEW ARRIVALS
          </Link>
        </div>
      </section>

      {/* Trust icons */}
      <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-border border-y border-brand-border bg-brand-surface">
        {[
          ['Premium Materials', 'Ethically sourced, finest quality fabrics'],
          ['Expert Craftsmanship', 'Meticulously designed for lasting comfort'],
          ['Free Worldwide Shipping', 'On all orders over $100'],
        ].map(([title, desc]) => (
          <div key={title} className="text-center py-12 px-6">
            <p className="text-sm font-semibold text-brand-text mb-2 tracking-wide uppercase">{title}</p>
            <p className="text-sm text-brand-muted font-light">{desc}</p>
          </div>
        ))}
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-text mb-4">
            Curated Collection
          </h2>
          <p className="text-brand-muted max-w-xl mx-auto">
            Discover our handpicked selection of premium essentials
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => {
            const image = product.images.edges[0]?.node;
            const price = product.priceRange.minVariantPrice;
            return (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden border border-brand-border aspect-[3/4] relative mb-4">
                  {image && (
                    <Image
                      src={image.url}
                      alt={image.altText ?? product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <h3 className="text-sm font-medium text-brand-text mb-1 group-hover:text-brand-accent transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-brand-muted">
                  {price.currencyCode} {price.amount}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Story */}
      <section className="bg-brand-surface py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-text mb-6">
            Our Story
          </h2>
          <p className="text-brand-muted text-lg leading-relaxed font-light">
            Founded on the belief that children deserve the finest quality, Ortus combines timeless design with exceptional craftsmanship. Each piece is thoughtfully created to provide both style and comfort, ensuring your little ones look and feel their best every day.
          </p>
        </div>
      </section>
    </div>
  );
}
