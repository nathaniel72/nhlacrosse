import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);

  if (typeof body?.featured !== "boolean") {
    return NextResponse.json({ message: "Missing featured flag" }, { status: 400 });
  }

  await prisma.rosterAthlete.update({
    where: { id },
    data: { featured: body.featured },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const athlete = await prisma.rosterAthlete.findUnique({ where: { id } });
  if (!athlete) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await del(athlete.photoUrl).catch(() => null);
  }
  await prisma.rosterAthlete.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
