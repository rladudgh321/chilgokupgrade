import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json({ message: "유효하지 않은 ID" }, { status: 400 });
    }

    const data = await prisma.build.findUnique({
      where: { id: idNum },
      include: {
        label: true,
        buildingOptions: true,
      },
    });

    if (!data) {
      return NextResponse.json({ message: "매물을 찾을 수 없습니다." }, { status: 404 });
    }

    const result = {
      ...data,
      label: data.label?.name ?? null,
      buildingOptions: data.buildingOptions.map((o) => o.name),
    };

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "서버 오류" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json({ message: "유효하지 않은 ID" }, { status: 400 });
    }

    const raw = await req.json().catch(() => null);
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ message: "잘못된 요청 본문" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label, buildingOptions, id: rawId, ...restOfBody } = raw as any;

    const dataToUpdate: any = { ...restOfBody };

    if (label) {
      let labelRecord = await prisma.label.findUnique({ where: { name: label } });
      if (!labelRecord) {
        labelRecord = await prisma.label.create({ data: { name: label } });
      }
      dataToUpdate.labelId = labelRecord.id;
    } else {
      dataToUpdate.labelId = null;
    }

    if (buildingOptions && Array.isArray(buildingOptions)) {
      const optionIds = [];
      for (const optionName of buildingOptions) {
        let option = await prisma.buildingOption.findUnique({
          where: { name: optionName },
        });
        if (!option) {
          option = await prisma.buildingOption.create({ data: { name: optionName } });
        }
        optionIds.push({ id: option.id });
      }
      dataToUpdate.buildingOptions = {
        set: optionIds,
      };
    } else {
      dataToUpdate.buildingOptions = {
        set: [],
      };
    }

    const updated = await prisma.build.update({
      where: { id: idNum },
      data: dataToUpdate,
      include: {
        label: true,
        buildingOptions: true,
      },
    });

    const result = {
      ...updated,
      label: updated.label?.name ?? null,
      buildingOptions: updated.buildingOptions.map((o) => o.name),
    };

    return NextResponse.json({ message: "수정 완료", data: result });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e?.message ?? "서버 오류" }, { status: 500 });
  }
}
