import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { notifySlack } from "@/app/utils/sentry/slack";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const id = parseInt((await params).id, 10);

    const { error } = await supabase.from("BannedIp").delete().match({ id });

    if (error) {
      Sentry.captureException(error);
      await notifySlack(error, req.url);
      throw error;
    }

    return NextResponse.json({ message: "IP unbanned successfully" });
  } catch (error) {
      Sentry.captureException(error);
      await notifySlack(error, req.url);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to unban IP.", details: errorMessage },
      { status: 500 }
    );
  }
}
