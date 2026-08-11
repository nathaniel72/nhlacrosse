import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stringOptionSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = stringOptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Please fix the highlighted fields" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const count = await prisma.stringOption.count();

  await prisma.stringOption.create({
    data: {
      name: data.name,
      color: data.color || null,
      description: data.description || null,
      priceCents: data.priceCents,
      sortOrder: count,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
