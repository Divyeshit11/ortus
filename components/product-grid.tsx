import type { ShopifyProduct } from '@/lib/shopify';
import ProductCard from './product-card';

export default function ProductGrid({
  products,
  emptyMessage = 'No products available yet.',
}: {
  products: ShopifyProduct[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <p className="text-brand-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
