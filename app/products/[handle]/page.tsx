import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductByHandleSafe } from '@/lib/shopify';
import ProductGallery from './product-gallery';
import ProductPurchase from './product-purchase';

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProductByHandleSafe(params.handle);
  if (!product) return notFound();

  const images = product.images.edges.map((e: any) => e.node);
  const variants = product.variants.edges.map((e: any) => e.node);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-20">
      <nav className="text-sm text-brand-muted mb-10">
        <Link href="/" className="hover:text-brand-text transition-colors">
          Home
        </Link>
        <span className="mx-3">/</span>
        <Link href="/catalog" className="hover:text-brand-text transition-colors">
          Shop
        </Link>
        <span className="mx-3">/</span>
        <span className="text-brand-text">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 md:gap-20">
        <ProductGallery images={images} title={product.title} />

        <div className="md:pt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-accent mb-3 font-medium">
            ORTUS
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-brand-text mb-6 leading-tight">
            {product.title}
          </h1>

          <ProductPurchase variants={variants} />

          {product.descriptionHtml && (
            <div
              className="prose-brand mt-12 pt-10 border-t border-brand-border text-base"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
