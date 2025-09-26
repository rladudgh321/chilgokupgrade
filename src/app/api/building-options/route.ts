"use server";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: 모든 옵션 조회
export async function GET() {
  try {
    const options = await prisma.buildingOption.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json({ ok: true, data: options }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// POST: 새 옵션 추가
export async function POST(request: NextRequest) {
  try {
    const { label } = await request.json(); // The frontend sends 'label'

    if (!label || typeof label !== "string" || label.trim() === "") {
      return NextResponse.json(
        { ok: false, error: { message: "옵션은 필수입니다." } },
        { status: 400 }
      );
    }

    const newOption = await prisma.buildingOption.create({
      data: {
        name: label.trim(),
      },
    });

    return NextResponse.json(
      { ok: true, message: "옵션이 추가되었습니다.", data: newOption },
      { status: 201 }
    );
  } catch (e: any) {
    if (e?.code === 'P2002') {
        return NextResponse.json(
            { ok: false, error: { message: "이미 존재하는 옵션입니다." } },
            { status: 400 }
          );
    }
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// PUT: 옵션 수정
export async function PUT(request: NextRequest) {
  try {
    const { oldLabel, newLabel } = await request.json();

    if (!oldLabel || !newLabel || typeof oldLabel !== "string" || typeof newLabel !== "string") {
      return NextResponse.json(
        { ok: false, error: { message: "기존 옵션과 새 옵션이 필요합니다." } },
        { status: 400 }
      );
    }

    const updatedOption = await prisma.buildingOption.update({
      where: { name: oldLabel.trim() },
      data: { name: newLabel.trim() },
    });

    return NextResponse.json(
      { ok: true, message: "옵션이 수정되었습니다.", data: updatedOption },
      { status: 200 }
    );
  } catch (e: any) {
    if (e?.code === 'P2002') {
        return NextResponse.json(
            { ok: false, error: { message: "이미 존재하는 옵션입니다." } },
            { status: 400 }
          );
    }
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// DELETE: 옵션 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const label = searchParams.get("label");

    if (!label) {
      return NextResponse.json(
        { ok: false, error: { message: "삭제할 옵션이 필요합니다." } },
        { status: 400 }
      );
    }

    const deletedOption = await prisma.buildingOption.delete({
      where: { name: label },
    });

    return NextResponse.json(
      { ok: true, message: "옵션이 삭제되었습니다.", data: deletedOption },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}