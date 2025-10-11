import { NextResponse } from "next/server";
import { createClient } from '@/app/utils/supabase/server';
import { cookies } from "next/headers";
import { z } from "zod";

const workInfoSchema = z.object({
  companyName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal('')),
  owner: z.string().optional().nullable(),
  businessId: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data, error } = await supabase
      .from("WorkInfo")
      .select("*")
      .eq("id", "main")
      .single();

    // PGRST116: single row not found, which is a valid case on first load.
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching work info from Supabase:", error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data from Supabase" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

  try {
    const body = await request.json();
    const validatedData = workInfoSchema.parse(body);

    const { data, error } = await supabase
      .from("WorkInfo")
      .upsert({ id: "main", ...validatedData }, { onConflict: 'id' });

    if (error) {
      console.error("Error saving work info to Supabase:", error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to save data to Supabase" },
      { status: 500 }
    );
  }
}
