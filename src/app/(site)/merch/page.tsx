import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { getShopifyProducts } from "@/lib/shopify";

export const metadata = {
  title: "Merch",
};

export const dynamic = "force-dynamic";

export default async function MerchPage() {
  const products = await getShopifyProducts();

  if (products.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center sm:py-32">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Merch
        </p>
        <h1 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">
          Coming soon
        </h1>
        <p className="mt-4 max-w-md text-muted">
          Gear and apparel are in the works. In the meantime, get your stick
          strung and I&apos;ll let you know the moment merch drops.
        </p>
        <ButtonLink href="/#intake-form" className="mt-8">
          Submit Your Film
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="container-page py-16 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">
        Merch
      </p>
      <h1 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">
        Gear
      </h1>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <a
            key={product.id}
            href={product.buyUrl}
            target="_blank"
            rel="noreferrer"
            className="overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-accent"
          >
            <div className="relative aspect-square w-full bg-surface-muted">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              ) : null}
            </div>
            <div className="p-4">
              <p className="font-semibold text-navy">{product.title}</p>
              <p className="mt-1 text-sm text-muted">{product.priceLabel}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
