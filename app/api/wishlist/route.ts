import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory wishlist storage (in production, use a database)
const wishlists = new Map<string, Set<string>>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  const wishlist = wishlists.get(userId) || new Set();
  return NextResponse.json({ items: Array.from(wishlist) });
}

export async function POST(req: NextRequest) {
  const { userId, productId, action } = await req.json();

  if (!userId || !productId) {
    return NextResponse.json({ error: 'User ID and Product ID required' }, { status: 400 });
  }

  if (!wishlists.has(userId)) {
    wishlists.set(userId, new Set());
  }

  const wishlist = wishlists.get(userId)!;

  if (action === 'add') {
    wishlist.add(productId);
    return NextResponse.json({ success: true, items: Array.from(wishlist) });
  }

  if (action === 'remove') {
    wishlist.delete(productId);
    return NextResponse.json({ success: true, items: Array.from(wishlist) });
  }

  if (action === 'toggle') {
    if (wishlist.has(productId)) {
      wishlist.delete(productId);
    } else {
      wishlist.add(productId);
    }
    return NextResponse.json({ success: true, items: Array.from(wishlist), isAdded: wishlist.has(productId) });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const productId = searchParams.get('productId');

  if (!userId || !productId) {
    return NextResponse.json({ error: 'User ID and Product ID required' }, { status: 400 });
  }

  const wishlist = wishlists.get(userId);
  if (wishlist) {
    wishlist.delete(productId);
  }

  return NextResponse.json({ success: true });
}
