import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { message: "Image storage isn't configured yet (BLOB_READ_WRITE_TOKEN missing)." },
      { status: 503 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const caption = formData.get("caption");
  const headModel = formData.get("headModel");
  const pocketType = formData.get("pocketType");
  const featured = formData.get("featured") === "on";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "Choose an image to upload" }, { status: 400 });
  }

  const blob = await put(`gallery/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  await prisma.galleryPhoto.create({
    data: {
      imageUrl: blob.url,
      caption: typeof caption === "string" && caption ? caption : null,
      headModel: typeof headModel === "string" && headModel ? headModel : null,
      pocketType: typeof pocketType === "string" && pocketType ? pocketType : null,
      featured,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id;
  const heroRole = body?.heroRole;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }
  if (heroRole !== null && heroRole !== "BEFORE" && heroRole !== "AFTER") {
    return NextResponse.json({ message: "Invalid heroRole" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    if (heroRole) {
      await tx.galleryPhoto.updateMany({
        where: { heroRole, NOT: { id } },
        data: { heroRole: null },
      });
    }
    await tx.galleryPhoto.update({ where: { id }, data: { heroRole } });
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  const photo = await prisma.galleryPhoto.findUnique({ where: { id } });
  if (!photo) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await del(photo.imageUrl).catch(() => null);
  }
  await prisma.galleryPhoto.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
