import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

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
    const dealType = searchParams.get("dealType")?.trim();
    const sortBy = searchParams.get("sortBy")?.trim() ?? "latest";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let q = supabase
      .from("Build")
      .select(
        `
        *,
        label:Label(name),
        buildingOptions:BuildingOption(id, name),
        listingType:ListingType(name),
        buyType:BuyType(name)
      `,
        { count: "exact" }
      )
      .is("deletedAt", null)
      
    // Sorting logic
    switch (sortBy) {
      case 'popular':
        q = q.order('views', { ascending: false, nullsFirst: true });
        break;
      case 'price':
        // This uses the custom `max_price` function which needs to be created via a migration.
        q = q.order('actualEntryCost', { ascending: false, nullsFirst: true });
        break;
      case 'area':
        q = q.order('totalArea', { ascending: false, nullsFirst: true });
        break;
      case 'latest':
      default:
        q = q.order("createdAt", { ascending: false });
        break;
    }

    q = q.range(from, to);


    if (keyword) {
      if (/^\d+$/.test(keyword)) {
        q = q.eq("id", Number(keyword));
      } else {
        q = q.ilike("address", `%${keyword}%`);
      }
    }
    if (theme) {
      q = q.contains("themes", [theme]);
    }
    if (propertyType) {
      const { data: typeRec } = await supabase.from("ListingType").select("id").eq("name", propertyType).single();
      if (typeRec) {
          q = q.eq("listingTypeId", typeRec.id);
      } else {
          q = q.eq("listingTypeId", -1); // Return no results if propertyType doesn't exist
      }
    }

    if (dealType) {
      const { data: typeRec } = await supabase.from("BuyType").select("id").eq("name", dealType).single();
      if (typeRec) {
          q = q.eq("buyTypeId", typeRec.id);
      } else {
          q = q.eq("buyTypeId", -1); // Return no results if dealType doesn't exist
      }
    }

    console.log(q);
    const { data, error, count } = await q;

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    const processedData = data.map((d: any) => ({
      ...d,
      label: d.label?.name,
      buildingOptions: d.buildingOptions.map((o: any) => o.name),
      propertyType: d.listingType?.name,
      dealType: d.buyType?.name,
    }));

    return NextResponse.json({
      ok: true,
      totalItems: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
      currentPage: page,
      data: processedData ?? [],
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
    const { label, buildingOptions, propertyType, dealType, id, ...restOfBody } = raw as any;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

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

    let buyTypeId: number | null = null;
    if (dealType) {
        let { data: typeRec } = await supabase.from("BuyType").select("id").eq("name", dealType).single();
        if (!typeRec) {
            const { data: newType } = await supabase.from("BuyType").insert({ name: dealType }).select("id").single();
            if (newType) buyTypeId = newType.id;
        } else {
            buyTypeId = typeRec.id;
        }
    }

    const dataToInsert = {
        ...restOfBody,
        labelId,
        listingTypeId,
        buyTypeId,
    };
    
    const { data: newBuild, error: buildError } = await supabase
        .from("Build")
        .insert(dataToInsert)
        .select()
        .single();

    if (buildError) {
        return NextResponse.json({ ok: false, error: buildError }, { status: 400 });
    }
    if (!newBuild) {
        return NextResponse.json({ ok: false, error: { message: "Failed to create build" } }, { status: 500 });
    }

    if (buildingOptions && Array.isArray(buildingOptions)) {
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
            A: newBuild.id,
            B: optionId,
        }));

        if (joinTableData.length > 0) {
            const { error: joinError } = await supabase.from("_BuildToBuildingOption").insert(joinTableData);
            if (joinError) {
                console.error("Error inserting into join table:", joinError);
            }
        }
    }

    return NextResponse.json({ ok: true, data: [newBuild] }, { status: 201 });

  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}
