import { NextRequest, NextResponse } from 'next/server';
import { createCart, getCart, addToCart, updateCartLine, removeFromCart } from '@/lib/shopify';

export async function POST(req: NextRequest) {
  const { variantId, quantity, cartId, action } = await req.json();

  try {
    if (action === 'get' && cartId) {
      const cart = await getCart(cartId);
      return NextResponse.json({ cart });
    }

    if (action === 'add' && cartId && variantId) {
      const result = await addToCart(cartId, variantId, quantity ?? 1);
      if (result.userErrors.length > 0) {
        return NextResponse.json({ error: result.userErrors[0].message }, { status: 400 });
      }
      return NextResponse.json({ checkoutUrl: result.cart?.checkoutUrl });
    }

    if (action === 'update' && cartId && variantId) {
      const result = await updateCartLine(cartId, variantId, quantity);
      if (result.userErrors.length > 0) {
        return NextResponse.json({ error: result.userErrors[0].message }, { status: 400 });
      }
      return NextResponse.json({ checkoutUrl: result.cart?.checkoutUrl });
    }

    if (action === 'remove' && cartId && variantId) {
      const result = await removeFromCart(cartId, [variantId]);
      if (result.userErrors.length > 0) {
        return NextResponse.json({ error: result.userErrors[0].message }, { status: 400 });
      }
      return NextResponse.json({ checkoutUrl: result.cart?.checkoutUrl });
    }

    // Default: create new cart
    const result = await createCart(variantId, quantity ?? 1);

    if (result.userErrors.length > 0) {
      return NextResponse.json(
        { error: result.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      cartId: result.cart?.id,
      checkoutUrl: result.cart?.checkoutUrl 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to process cart request' },
      { status: 500 }
    );
  }
}
