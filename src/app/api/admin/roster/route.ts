import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
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
  const athleteName = formData.get("athleteName");
  const program = formData.get("program");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "Choose a photo to upload" }, { status: 400 });
  }
  if (typeof athleteName !== "string" || !athleteName.trim()) {
    return NextResponse.json({ message: "Enter the athlete's name" }, { status: 400 });
  }

  const blob = await put(`roster/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  const count = await prisma.rosterAthlete.count();

  await prisma.rosterAthlete.create({
    data: {
      photoUrl: blob.url,
      athleteName: athleteName.trim(),
      program: typeof program === "string" && program.trim() ? program.trim() : null,
      sortOrder: count,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
