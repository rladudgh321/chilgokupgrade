import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

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

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("Build")
      .select(`
        *,
        label:Label(name),
        buildingOptions:BuildingOption(id, name),
        listingType:ListingType(name)
      `)
      .eq("id", idNum)
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ message: "매물을 찾을 수 없습니다." }, { status: 404 });
    }

    const result = {
      ...data,
      label: (data.label as any)?.name,
      buildingOptions: (data.buildingOptions as any[]).map((o: any) => o.name),
      propertyType: (data.listingType as any)?.name,
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

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label, buildingOptions, propertyType, id: rawId, ...restOfBody } = raw as any;

    let labelId: number | null = null;
    if (label) {
        let { data: labelRec } = await supabase.from("Label").select("id").eq("name", label).single();
        if (!labelRec) {
            const { data: newLabel } = await supabase.from("Label").insert({ name: label }).select("id").single();
            if (newLabel) labelId = newLabel.id;
        } else {
            labelId = labelRec.id;
        }
    }

    let listingTypeId: number | null = null;
    if (propertyType) {
        let { data: typeRec } = await supabase.from("ListingType").select("id").eq("name", propertyType).single();
        if (!typeRec) {
            const { data: newType } = await supabase.from("ListingType").insert({ name: propertyType }).select("id").single();
            if (newType) listingTypeId = newType.id;
        } else {
            listingTypeId = typeRec.id;
        }
    }

    const dataToUpdate: any = {
        ...restOfBody,
    };
    if (label !== undefined) dataToUpdate.labelId = labelId;
    if (propertyType !== undefined) dataToUpdate.listingTypeId = listingTypeId;

    const { error: updateError } = await supabase
        .from("Build")
        .update(dataToUpdate)
        .eq("id", idNum);

    if (updateError) {
        return NextResponse.json({ ok: false, error: updateError }, { status: 400 });
    }

    if (buildingOptions && Array.isArray(buildingOptions)) {
        await supabase.from("_BuildToBuildingOption").delete().eq("A", idNum);

        const optionIds = [];
        for (const optionName of buildingOptions) {
            let { data: optionRec } = await supabase.from("BuildingOption").select("id").eq("name", optionName).single();
            if (!optionRec) {
                const { data: newOption } = await supabase.from("BuildingOption").insert({ name: optionName }).select("id").single();
                if (newOption) optionIds.push(newOption.id);
            } else {
                optionIds.push(optionRec.id);
            }
        }

        const joinTableData = optionIds.map(optionId => ({
            A: idNum,
            B: optionId,
        }));

        if (joinTableData.length > 0) {
            const { error: joinError } = await supabase.from("_BuildToBuildingOption").insert(joinTableData);
            if (joinError) {
                console.error("Error inserting into join table:", joinError);
            }
        }
    }

    const { data: finalData } = await supabase
        .from("Build")
        .select(`*, label:Label(name), buildingOptions:BuildingOption(id, name), listingType:ListingType(name)`)
        .eq("id", idNum)
        .single();
    
    const result = {
        ...finalData,
        label: (finalData as any).label?.name,
        buildingOptions: (finalData as any).buildingOptions.map((o: any) => o.name),
        propertyType: (finalData as any).listingType?.name,
    };

    return NextResponse.json({ message: "수정 완료", data: result });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e?.message ?? "서버 오류" }, { status: 500 });
  }
}