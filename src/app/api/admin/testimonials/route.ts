import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Please fix the highlighted fields" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const count = await prisma.testimonial.count();

  await prisma.testimonial.create({
    data: {
      athleteName: data.athleteName,
      resultOrTeam: data.resultOrTeam || null,
      quote: data.quote,
      sortOrder: count,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
