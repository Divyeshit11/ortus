const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
const apiVersion = '2024-10';

function storefrontHeaders(token: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Headless private tokens start with shpat_ and use a different header.
  if (token.startsWith('shpat_')) {
    headers['Shopify-Storefront-Private-Token'] = token;
  } else {
    headers['X-Shopify-Storefront-Access-Token'] = token;
  }

  return headers;
}

function shopifyApiErrorMessage(errors: { message?: string; extensions?: { code?: string } }[]): string {
  const code = errors[0]?.extensions?.code;

  if (code === 'UNAUTHORIZED') {
    return (
      'Shopify token rejected (UNAUTHORIZED). Copy the Public access token from ' +
      'Sales channels → Headless → Storefront API and paste it into SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local, then restart npm run dev.'
    );
  }

  if (code === 'ACCESS_DENIED') {
    return (
      'Shopify token rejected (ACCESS_DENIED). Your token is wrong or from the wrong place. ' +
      'Open Sales channels → Headless → Storefront API and copy either the Public access token ' +
      '(recommended, fully visible) or the Private access token (click the eye icon). ' +
      'Do not use tokens from dev.shopify.com or Admin API settings.'
    );
  }

  return 'Failed to fetch from Shopify Storefront API';
}

async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  if (!domain || !storefrontAccessToken) {
    throw new Error(
      'Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN env vars'
    );
  }

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: storefrontHeaders(storefrontAccessToken),
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // cache products for 60s, adjust as needed
  });

  const json = await res.json();

  if (json.errors) {
    console.error('Shopify API errors:', json.errors);
    throw new Error(shopifyApiErrorMessage(json.errors));
  }

  return json.data as T;
}

// ---- Types ----
export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: { edges: { node: ShopifyImage }[] };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
      };
    }[];
  };
};

// ---- Queries ----
const PRODUCT_FRAGMENT = `
  id
  handle
  title
  description
  descriptionHtml
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  images(first: 5) {
    edges {
      node {
        url
        altText
        width
        height
      }
    }
  }
  variants(first: 10) {
    edges {
      node {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
      }
    }
  }
`;

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query GetAllProducts {
      products(first: 50) {
        edges {
          node {
            ${PRODUCT_FRAGMENT}
          }
        }
      }
    }
  `;
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>({ query });
  return data.products.edges.map((edge) => edge.node);
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const query = `
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ${PRODUCT_FRAGMENT}
      }
    }
  `;
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query,
    variables: { handle },
  });
  return data.product;
}

// ---- Cart mutations ----
export async function createCart(merchandiseId: string, quantity = 1) {
  const query = `
    mutation CreateCart($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { lines: [{ merchandiseId, quantity }] },
  });
  return data.cartCreate;
}

export async function getCart(cartId: string) {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;
  const data = await shopifyFetch<{ cart: any }>({
    query,
    variables: { cartId },
  });
  return data.cart;
}

export async function addToCart(cartId: string, merchandiseId: string, quantity = 1) {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { cartId, lines: [{ merchandiseId, quantity }] },
  });
  return data.cartLinesAdd;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number) {
  const query = `
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch<{
    cartLinesUpdate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
  });
  return data.cartLinesUpdate;
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const query = `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch<{
    cartLinesRemove: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { cartId, lineIds },
  });
  return data.cartLinesRemove;
}

export async function searchProducts(query: string): Promise<ShopifyProduct[]> {
  const searchQuery = `
    query SearchProducts($query: String!) {
      products(first: 20, query: $query) {
        edges {
          node {
            ${PRODUCT_FRAGMENT}
          }
        }
      }
    }
  `;
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>({
    query: searchQuery,
    variables: { query },
  });
  return data.products.edges.map((edge) => edge.node);
}

export async function getProductsByCollection(collectionHandle: string): Promise<ShopifyProduct[]> {
  const query = `
    query GetCollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        products(first: 50) {
          edges {
            node {
              ${PRODUCT_FRAGMENT}
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch<{
    collectionByHandle: { products: { edges: { node: ShopifyProduct }[] } } | null;
  }>({
    query,
    variables: { handle: collectionHandle },
  });
  return data.collectionByHandle?.products.edges.map((edge) => edge.node) || [];
}
