
import { BuildFindAll } from "@/app/apis/build";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || undefined;
  const theme = searchParams.get("theme") || undefined;
  const propertyType = searchParams.get("propertyType") || undefined;
  const dealType = searchParams.get("dealType") || undefined;
  const sortBy = searchParams.get("sortBy") || "latest";

  try {
    const { data: processedListings, totalPages } = await BuildFindAll(
      page,
      limit,
      keyword,
      {
        theme,
        propertyType,
        dealType,
      },
      sortBy
    );

    return NextResponse.json({
      listings: processedListings,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return NextResponse.json(
      { message: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
