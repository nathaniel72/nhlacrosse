import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: { order: true },
  });
  if (!submission) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (submission.order?.paidAt) {
    return NextResponse.json(
      { message: "Can't delete a submission with a paid order — that's real transaction history." },
      { status: 400 }
    );
  }

  await prisma.submission.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
