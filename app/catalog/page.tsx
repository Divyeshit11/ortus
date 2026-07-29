import { getAllProducts } from '@/lib/shopify';
import ProductGrid from '@/components/product-grid';

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const products = await getAllProducts();

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-text mb-4">
          Shop All
        </h1>
        <p className="text-brand-muted max-w-xl mx-auto">
          Discover our complete collection of premium children's fashion
        </p>
      </div>
      
      <ProductGrid products={products} emptyMessage="No products available at the moment." />
    </div>
  );
}
