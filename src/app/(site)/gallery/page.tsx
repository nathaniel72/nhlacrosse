import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = {
  title: "Gallery",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Gallery
        </p>
        <h1 className="mt-3 font-display text-3xl uppercase tracking-tight text-navy sm:text-4xl">
          Recent work
        </h1>
        <p className="mt-3 text-muted">
          A look at heads I&apos;ve strung and the pockets that came out of them.
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface-muted p-12 text-center">
          <p className="text-muted">
            Photos are on the way — check back soon to see finished sticks.
          </p>
          <ButtonLink href="/#intake-form" className="mt-6">
            Get Your Stick Strung
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <figure
              key={photo.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="relative aspect-square w-full bg-surface-muted">
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption ?? photo.headModel ?? "Strung lacrosse head"}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              {(photo.caption || photo.headModel) && (
                <figcaption className="p-4 text-sm text-muted">
                  {photo.headModel ? (
                    <p className="font-semibold text-navy">{photo.headModel}</p>
                  ) : null}
                  {photo.caption ? <p>{photo.caption}</p> : null}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
