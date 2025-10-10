import { NextRequest, NextResponse } from "next/server";

// This is a mock API. In a real implementation, this would need to access
// the same data store as the main API route to update the order of categories.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ ok: false, error: { message: "orderedIds 배열이 필요합니다." } }, { status: 400 });
    }

    console.log("Reordering categories (mock):", orderedIds);
    // In a real app, you'd update the 'order' field for each category here.

    return NextResponse.json({ ok: true, message: "순서가 저장되었습니다." });

  } catch (e) {
    return NextResponse.json({ ok: false, error: { message: "잘못된 요청입니다." } }, { status: 400 });
  }
}
