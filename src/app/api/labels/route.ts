import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: 모든 라벨 조회
export async function GET() {
  try {
    const labels = await prisma.label.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json({ ok: true, data: labels }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// POST: 새 라벨 추가
export async function POST(request: NextRequest) {
  try {
    const { label } = await request.json();

    if (!label || typeof label !== "string" || label.trim() === "") {
      return NextResponse.json(
        { ok: false, error: { message: "라벨은 필수입니다." } },
        { status: 400 }
      );
    }

    const newLabel = await prisma.label.create({
      data: {
        name: label.trim(),
      },
    });

    return NextResponse.json(
      { ok: true, message: "라벨이 추가되었습니다.", data: newLabel },
      { status: 201 }
    );
  } catch (e: any) {
    if (e?.code === 'P2002') {
        return NextResponse.json(
            { ok: false, error: { message: "이미 존재하는 라벨입니다." } },
            { status: 400 }
          );
    }
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// PUT: 라벨 수정
export async function PUT(request: NextRequest) {
  try {
    const { oldLabel, newLabel } = await request.json();

    if (!oldLabel || !newLabel || typeof oldLabel !== "string" || typeof newLabel !== "string") {
      return NextResponse.json(
        { ok: false, error: { message: "기존 라벨과 새 라벨이 필요합니다." } },
        { status: 400 }
      );
    }

    const updatedLabel = await prisma.label.update({
      where: { name: oldLabel.trim() },
      data: { name: newLabel.trim() },
    });

    return NextResponse.json(
      { ok: true, message: "라벨이 수정되었습니다.", data: updatedLabel },
      { status: 200 }
    );
  } catch (e: any) {
    if (e?.code === 'P2002') {
        return NextResponse.json(
            { ok: false, error: { message: "이미 존재하는 라벨입니다." } },
            { status: 400 }
          );
    }
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// DELETE: 라벨 삭제
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

    const deletedLabel = await prisma.label.delete({
      where: { name: label },
    });

    return NextResponse.json(
      { ok: true, message: "라벨이 삭제되었습니다.", data: deletedLabel },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}
