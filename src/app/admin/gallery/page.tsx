import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { GalleryUploadForm } from "@/components/admin/GalleryUploadForm";
import { GalleryPhotoCard } from "@/components/admin/GalleryPhotoCard";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <div>
        <h1 className="text-2xl font-bold text-navy">Gallery</h1>
        <Card className="mt-6">
          <GalleryUploadForm />
        </Card>
      </div>
      <div>
        {photos.length === 0 ? (
          <Card>
            <p className="text-muted">No photos yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <GalleryPhotoCard
                key={photo.id}
                id={photo.id}
                imageUrl={photo.imageUrl}
                caption={photo.caption}
                headModel={photo.headModel}
                heroRole={photo.heroRole}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
