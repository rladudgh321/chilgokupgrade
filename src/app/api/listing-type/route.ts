import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: 모든 매물 유형 조회
export async function GET() {
  try {
    const listingTypes = await prisma.listingType.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json({ ok: true, data: listingTypes }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// POST: 새 매물 유형 추가
export async function POST(request: NextRequest) {
  try {
    const { label, imageUrl, imageName } = await request.json();

    if (!label) {
      return NextResponse.json(
        { ok: false, error: { message: "이름은 필수입니다." } },
        { status: 400 }
      );
    }

    const newListingType = await prisma.listingType.create({
      data: {
        name: label.trim(),
        imageUrl: imageUrl,
        imageName: imageName,
      },
    });

    return NextResponse.json(
      { ok: true, message: "매물 유형이 추가되었습니다.", data: newListingType },
      { status: 201 }
    );
  } catch (e: any) {
    if (e?.code === 'P2002') {
        return NextResponse.json(
            { ok: false, error: { message: "이미 존재하는 유형입니다." } },
            { status: 400 }
          );
    }
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// PUT: 매물 유형 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, oldLabel, newLabel, imageUrl, imageName } = body;

    let updated;
    if (oldLabel && newLabel) { // From onEdit
        updated = await prisma.listingType.update({
            where: { name: oldLabel },
            data: { name: newLabel },
        });
    } else if (id && (imageUrl !== undefined || imageName !== undefined)) { // From onImageEdit
        updated = await prisma.listingType.update({
            where: { id: Number(id) },
            data: {
                imageUrl: imageUrl,
                imageName: imageName,
            },
        });
    } else {
        return NextResponse.json({ ok: false, error: { message: "Invalid request" } }, { status: 400 });
    }
    return NextResponse.json({ ok: true, data: updated }, { status: 200 });

  } catch (e: any) {
    if (e?.code === 'P2002') {
        return NextResponse.json(
            { ok: false, error: { message: "이미 존재하는 유형입니다." } },
            { status: 400 }
          );
    }
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// DELETE: 매물 유형 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const label = searchParams.get("label");

    if (!label) {
      return NextResponse.json(
        { ok: false, error: { message: "삭제할 라벨이 필요합니다." } },
        { status: 400 }
      );
    }

    const deleted = await prisma.listingType.delete({
        where: { name: label },
    });

    return NextResponse.json(
      { ok: true, message: "매물 유형이 삭제되었습니다.", data: deleted },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}
