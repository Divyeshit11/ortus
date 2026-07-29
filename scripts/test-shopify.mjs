import { readFileSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    })
);

const domain = env.SHOPIFY_STORE_DOMAIN;
const token = env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !token) {
  console.error('Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local');
  process.exit(1);
}

const headers = { 'Content-Type': 'application/json' };
if (token.startsWith('shpat_')) {
  headers['Shopify-Storefront-Private-Token'] = token;
} else {
  headers['X-Shopify-Storefront-Access-Token'] = token;
}

const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ query: '{ shop { name } products(first: 1) { edges { node { title } } } }' }),
});

const json = await res.json();

if (json.errors?.length) {
  const code = json.errors[0]?.extensions?.code ?? 'UNKNOWN';
  console.error(`Shopify connection failed (${code}).`);
  console.error('Update SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local with the token from:');
  console.error('Sales channels → Headless → Storefront API → Public access token');
  process.exit(1);
}

console.log(`Connected to Shopify store: ${json.data.shop.name}`);
console.log(`Sample product: ${json.data.products.edges[0]?.node.title ?? '(no products yet)'}`);
