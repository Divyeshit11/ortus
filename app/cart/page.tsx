'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCart, updateCartLine, removeFromCart } from '@/lib/shopify';
import { formatPrice } from '@/lib/format';

type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    product: {
      title: string;
      handle: string;
      images: { edges: { node: { url: string; altText: string | null } }[] };
    };
  };
};

type CartData = {
  id: string;
  checkoutUrl: string;
  lines: { edges: { node: CartLine }[] };
  cost: {
    totalAmount: { amount: string; currencyCode: string };
    subtotalAmount: { amount: string; currencyCode: string };
  };
};

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      loadCart(cartId);
    } else {
      setLoading(false);
    }
  }, []);

  const loadCart = async (cartId: string) => {
    try {
      const cartData = await getCart(cartId);
      setCart(cartData);
    } catch (err) {
      setError('Failed to load cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      const cartId = localStorage.getItem('cartId');
      if (!cartId) return;

      await updateCartLine(cartId, lineId, newQuantity);
      await loadCart(cartId);
    } catch (err) {
      setError('Failed to update quantity');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (lineId: string) => {
    setUpdating(true);
    try {
      const cartId = localStorage.getItem('cartId');
      if (!cartId) return;

      await removeFromCart(cartId, [lineId]);
      await loadCart(cartId);
    } catch (err) {
      setError('Failed to remove item');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="text-center">Loading cart...</div>
      </div>
    );
  }

  if (!cart || cart.lines.edges.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-brand-text mb-4">Your Cart</h1>
          <p className="text-brand-muted mb-8">Your cart is empty</p>
          <Link href="/catalog" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-20">
      <h1 className="font-serif text-3xl md:text-4xl text-brand-text mb-8">Your Cart</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-6">
          {cart.lines.edges.map(({ node: line }) => (
            <div key={line.id} className="flex gap-4 border-b border-brand-border pb-6">
              <div className="w-24 h-24 bg-brand-border/40 rounded-lg overflow-hidden">
                {line.merchandise.product.images.edges[0] && (
                  <img
                    src={line.merchandise.product.images.edges[0].node.url}
                    alt={line.merchandise.product.images.edges[0].node.altText || line.merchandise.product.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1">
                <Link
                  href={`/products/${line.merchandise.product.handle}`}
                  className="font-medium text-brand-text hover:text-brand-accent transition-colors"
                >
                  {line.merchandise.product.title}
                </Link>
                <p className="text-sm text-brand-muted mb-2">{line.merchandise.title}</p>
                <p className="text-sm text-brand-text font-medium">
                  {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-brand-border rounded">
                    <button
                      onClick={() => handleQuantityChange(line.id, line.quantity - 1)}
                      disabled={updating || line.quantity <= 1}
                      className="px-3 py-1 text-brand-text hover:bg-brand-accent-light disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm">{line.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(line.id, line.quantity + 1)}
                      disabled={updating}
                      className="px-3 py-1 text-brand-text hover:bg-brand-accent-light disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(line.id)}
                    disabled={updating}
                    className="text-sm text-brand-muted hover:text-brand-accent disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-brand-surface p-6 rounded-lg h-fit">
          <h2 className="font-serif text-xl text-brand-text mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Subtotal</span>
              <span className="text-brand-text">
                {formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Shipping</span>
              <span className="text-brand-text">Calculated at checkout</span>
            </div>
          </div>

          <div className="border-t border-brand-border pt-4 mb-6">
            <div className="flex justify-between font-medium">
              <span className="text-brand-text">Total</span>
              <span className="text-brand-text">
                {formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
              </span>
            </div>
          </div>

          <a
            href={cart.checkoutUrl}
            className="btn-primary w-full block text-center"
          >
            Checkout
          </a>

          <Link href="/catalog" className="btn-secondary w-full block text-center mt-3">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
