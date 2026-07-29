# Ortus Storefront

A custom Next.js storefront connected to your Shopify store via the Storefront API.
Shopify remains your backend (products, inventory, checkout, payments) — this app is
just the frontend, fully custom-designed.

## 1. Install dependencies

```bash
npm install
```

## 2. Get your Storefront API token

1. Shopify Admin → **Settings** → **Apps and sales channels**
2. Click **Develop apps** → **Create an app** (name it "Storefront" or similar)
3. Go to **API credentials** tab → under **Storefront API**, click **Configure**
4. Enable at least: `unauthenticated_read_product_listings`, `unauthenticated_read_products`,
   `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`
5. Click **Save**, then **Install app**
6. Copy the **Storefront API access token** shown

## 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:
- `SHOPIFY_STORE_DOMAIN` — your `.myshopify.com` domain (e.g. `ortus-8910.myshopify.com`)
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — the token from step 2

## 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` — you should see your live Shopify products pulled in.

## 5. Deploy to Vercel

```bash
npm install -g vercel   # if you don't have it already
vercel
```

When prompted, add the same two environment variables (`SHOPIFY_STORE_DOMAIN` and
`SHOPIFY_STOREFRONT_ACCESS_TOKEN`) in the Vercel project settings, or via:

```bash
vercel env add SHOPIFY_STORE_DOMAIN
vercel env add SHOPIFY_STOREFRONT_ACCESS_TOKEN
```

Then deploy to production:

```bash
vercel --prod
```

## How it works

- `lib/shopify.ts` — talks to Shopify's Storefront GraphQL API (read products, create cart)
- `app/page.tsx` — homepage, pulls live products from your store
- `app/products/[handle]/page.tsx` — individual product pages
- `app/api/cart/route.ts` — creates a Shopify cart and returns a checkout URL;
  clicking "Add to cart" redirects the customer to Shopify's secure hosted checkout
  (so payments, taxes, and order creation all still happen inside Shopify — nothing
  to build or secure yourself there)

## Next steps / things to customize

- Replace the hero background and add a real hero image
- Add a `/catalog` page (copy the product grid logic from `page.tsx`, remove the "favorites" framing)
- Add a `/contact` page
- Swap `font-serif` (Georgia) for a custom font if you have one
- Logo: replace the "ortus" text in `app/layout.tsx` header with an `<Image>` of your logo SVG
