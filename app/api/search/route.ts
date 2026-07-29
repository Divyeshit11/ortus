import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/shopify';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query required' }, { status: 400 });
  }

  try {
    const products = await searchProducts(query);
    return NextResponse.json({ products });
  } catch (err) {
    console.error('Search error:', err);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
