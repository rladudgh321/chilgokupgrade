import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10) || 10)
    );
    const keywordRaw = searchParams.get("keyword")?.trim() ?? "";
    const keyword = keywordRaw.length ? keywordRaw : undefined;
    const theme = searchParams.get("theme")?.trim();
    const propertyType = searchParams.get("propertyType")?.trim();

    const where: any = {
      deletedAt: null,
    };
    if (keyword) {
      if (/^\d+$/.test(keyword)) {
        where.id = Number(keyword);
      } else {
        where.address = { contains: keyword, mode: "insensitive" };
      }
    }
    if (theme) {
      where.themes = { has: theme };
    }
    if (propertyType) {
      where.propertyType = propertyType;
    }

    const [data, count] = await prisma.$transaction([
      prisma.build.findMany({
        where,
        include: {
          label: true,
          buildingOptions: true,
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.build.count({ where }),
    ]);

    return NextResponse.json({
      ok: true,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data:
        data.map((d) => ({
          ...d,
          label: d.label?.name ?? null,
          buildingOptions: d.buildingOptions.map((o) => o.name),
        })) ?? [],
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label, buildingOptions, id, ...restOfBody } = raw as any;

    const dataToInsert: any = { ...restOfBody };

    if (label) {
      let labelRecord = await prisma.label.findUnique({ where: { name: label } });
      if (!labelRecord) {
        labelRecord = await prisma.label.create({ data: { name: label } });
      }
      dataToInsert.labelId = labelRecord.id;
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
      dataToInsert.buildingOptions = {
        connect: optionIds,
      };
    }

    const result = await prisma.build.create({
      data: dataToInsert,
    });

    return NextResponse.json({ ok: true, data: [result] }, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}