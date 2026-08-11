const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = "2025-01";

export const shopifyEnabled = Boolean(STORE_DOMAIN && STOREFRONT_TOKEN);

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string;
  priceLabel: string;
  buyUrl: string;
};

const PRODUCTS_QUERY = `
  query MerchProducts {
    products(first: 24, sortKey: TITLE) {
      edges {
        node {
          id
          title
          handle
          description
          onlineStoreUrl
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetches published products via the Shopify Storefront API. Returns an
 * empty array (rather than throwing) whenever Shopify isn't configured yet
 * or the request fails, so the merch page can fall back to "coming soon"
 * without any special-casing at the call site.
 */
export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  if (!shopifyEnabled) return [];

  try {
    const res = await fetch(
      `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN as string,
        },
        body: JSON.stringify({ query: PRODUCTS_QUERY }),
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      console.error("[shopify] request failed", res.status, await res.text());
      return [];
    }

    const json = await res.json();
    if (json.errors) {
      console.error("[shopify] graphql errors", json.errors);
      return [];
    }

    type Edge = {
      node: {
        id: string;
        title: string;
        handle: string;
        description: string;
        onlineStoreUrl: string | null;
        images: { edges: { node: { url: string; altText: string | null } }[] };
        priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
      };
    };

    const edges: Edge[] = json.data?.products?.edges ?? [];

    return edges.map(({ node }) => {
      const price = Number(node.priceRange.minVariantPrice.amount);
      const priceLabel = price.toLocaleString("en-US", {
        style: "currency",
        currency: node.priceRange.minVariantPrice.currencyCode || "USD",
      });

      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,
        imageUrl: node.images.edges[0]?.node.url ?? null,
        imageAlt: node.images.edges[0]?.node.altText || node.title,
        priceLabel,
        buyUrl: node.onlineStoreUrl || `https://${STORE_DOMAIN}/products/${node.handle}`,
      };
    });
  } catch (err) {
    console.error("[shopify] fetch failed", err);
    return [];
  }
}
