/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/supabase/build/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";
import { z } from "zod";

const TABLE = "Build";
const ID_COL = "id";
const UPDATED_COL = "updatedAt";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;             // ✅ Next 15: params는 await 필수
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return NextResponse.json({ message: "유효하지 않은 ID" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq(ID_COL, idNum)
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ message: "매물을 찾을 수 없습니다." }, { status: 404 });
  }

  // 단일 객체 그대로 반환 (BuildFindOne에서 사용)
  return NextResponse.json(data);
}

const nullIfEmpty = (v: unknown) =>
  v === "" || v === undefined ? null : v;

const zInt = z.preprocess((v) => {
  v = nullIfEmpty(v);
  if (v === null) return null;
  if (typeof v === "string") return Number(v);
  return v;
}, z.number().int().nullable());

const zFloat = z.preprocess((v) => {
  v = nullIfEmpty(v);
  if (v === null) return null;
  if (typeof v === "string") return Number(v);
  return v;
}, z.number().nullable());

const zBool = z.preprocess((v) => {
  if (v === "" || v === undefined || v === null) return null;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return Boolean(v);
}, z.boolean().nullable());

const zDateISO = z.preprocess((v) => {
  v = nullIfEmpty(v);
  if (v === null) return null;
  const d = new Date(v as any);
  return isNaN(d.getTime()) ? null : d.toISOString();
}, z.string().datetime().nullable());

const zStringNullable = z.preprocess((v) => nullIfEmpty(v), z.string().nullable());

const zStringArray = z.preprocess((v) => {
  if (v === "" || v === undefined || v === null) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}, z.array(z.string()));

const zJson = z.preprocess((v) => {
  if (v === "" || v === undefined || v === null) return null;
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      throw new Error("잘못된 JSON 문자열입니다.");
    }
  }
  return v; // 이미 object/array 면 그대로
}, z.any().nullable());

// ─── enum(주소 공개) ────────────────────────────────────────────────
const AddressPublicEnum = z.enum(["public", "private", "exclude"]).nullable();

// ─── Update 스키마: 부분 업데이트 허용(.partial), 미지정 키는 제거(.strip) ─
const UpdateBuildSchema = z
  .object({
    // 기본 정보
    views: zInt,
    confirmDate: zDateISO,

    address: zStringNullable,
    dong: zStringNullable,
    ho: zStringNullable,
    etc: zStringNullable,
    isAddressPublic: AddressPublicEnum,
    mapLocation: zStringNullable,

    // LandInfo
    propertyType: zStringNullable,
    dealType: zStringNullable,
    dealScope: zStringNullable,
    visibility: zBool,
    priceDisplay: zStringNullable,
    salePrice: zInt,
    actualEntryCost: zInt,
    rentalPrice: zInt,
    managementFee: zInt,
    managementEtc: zStringNullable,

    // BuildBasic
    popularity: zStringNullable,
    label: zStringNullable,
    floorType: zStringNullable,
    currentFloor: zInt,
    totalFloors: zInt,
    basementFloors: zInt,
    floorDescription: zStringNullable,
    rooms: zInt,
    bathrooms: zInt,
    actualArea: zFloat,
    supplyArea: zFloat,
    landArea: zFloat,
    buildingArea: zFloat,
    totalArea: zFloat,
    themes: zStringArray,
    buildingOptions: zStringArray,
    constructionYear: zDateISO,
    permitDate: zDateISO,
    approvalDate: zDateISO,
    parkingPerUnit: zInt,
    totalParking: zInt,
    parkingFee: zInt,
    parking: zStringArray,
    direction: zStringNullable,
    directionBase: zStringNullable,
    landUse: zStringNullable,
    landType: zStringNullable,
    buildingUse: zStringNullable,
    staff: zStringNullable,
    customerType: zStringNullable,
    customerName: zStringNullable,

    // BuildInfo
    elevatorType: zStringNullable,
    elevatorCount: zInt,
    moveInType: zStringNullable,
    moveInDate: zDateISO,
    heatingType: zStringNullable,
    yieldType: zStringNullable,
    otherYield: zStringNullable,
    contractEndDate: zDateISO,
    buildingName: zStringNullable,
    floorAreaRatio: zStringNullable,
    otherUse: zStringNullable,
    mainStructure: zStringNullable,
    height: zStringNullable,
    roofStructure: zStringNullable,

    // Detail
    title: zStringNullable,
    editorContent: zStringNullable,
    secretNote: zStringNullable,
    secretContact: zStringNullable,

    // Images
    mainImage: zStringNullable,
    subImage: zJson,
    adminImage: zJson,
  })
  .partial()
  .strip(); // 스키마에 없는 키는 조용히 제거

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params; // Next 15
    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json({ message: "유효하지 않은 ID" }, { status: 400 });
    }

    // body는 한 번만 읽기
    const raw = await req.json().catch(() => null);
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ message: "잘못된 요청 본문" }, { status: 400 });
    }

    // 검증/형변환(미지정 키 자동 제거, 시스템 컬럼은 스키마에 없으니 통과 못 함)
    const updatable = UpdateBuildSchema.parse(raw);

    const now = new Date().toISOString();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...updatable, [UPDATED_COL]: now })
      .eq(ID_COL, idNum)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ message: "업데이트 실패 또는 대상 없음" }, { status: 404 });
    }

    return NextResponse.json({ message: "수정 완료", data });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "서버 오류" }, { status: 500 });
  }
}