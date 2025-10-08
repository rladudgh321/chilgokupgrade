import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

const DEFAULT_SETTINGS = {
  showKeyword: true,
  showPropertyType: true,
  showDealType: true,
  showPriceRange: true,
  showAreaRange: true,
  showTheme: true,
  showRooms: true,
  showFloor: true,
  showBathrooms: true,
  showSubwayLine: true,
};

// GET handler to fetch search bar settings
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: settings, error } = await supabase
      .from("SearchBarSetting")
      .select("*")
      .eq("id", 1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = 'exact-single-row-not-found'
        throw error;
    }

    if (!settings) {
      return NextResponse.json({ data: DEFAULT_SETTINGS });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, updatedAt, ...rest } = settings;
    return NextResponse.json({ data: rest });
  } catch (error: any) {
    console.error("Failed to fetch search bar settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings", details: error.message },
      { status: 500 }
    );
  }
}

// PUT handler to update search bar settings
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const body = await request.json();

    const settingsToUpdate = {
      id: 1, // Ensure we are always updating the same row
      showKeyword: body.showKeyword,
      showPropertyType: body.showPropertyType,
      showDealType: body.showDealType,
      showPriceRange: body.showPriceRange,
      showAreaRange: body.showAreaRange,
      showTheme: body.showTheme,
      showRooms: body.showRooms,
      showFloor: body.showFloor,
      showBathrooms: body.showBathrooms,
      showSubwayLine: body.showSubwayLine,
      updatedAt: new Date().toISOString(),
    };

    const { data: updatedSettings, error } = await supabase
        .from("SearchBarSetting")
        .upsert(settingsToUpdate, { onConflict: 'id' })
        .select()
        .single();

    if (error) {
        throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, updatedAt, ...rest } = updatedSettings;
    return NextResponse.json({ data: rest });
  } catch (error: any) {
    console.error("Failed to update search bar settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings", details: error.message },
      { status: 500 }
    );
  }
}