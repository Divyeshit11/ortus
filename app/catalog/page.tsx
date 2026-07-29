import { getAllProducts } from '@/lib/shopify';
import ProductGrid from '@/components/product-grid';

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  let products: any[] = [];
  let error: string | null = null;

  try {
    products = await getAllProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch products';
    console.error('Error fetching products:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-20">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-6 rounded">
          <p className="font-semibold">Error loading products:</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2">Please check your Shopify API credentials in Vercel environment variables.</p>
        </div>
      )}

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
