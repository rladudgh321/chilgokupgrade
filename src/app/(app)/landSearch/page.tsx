import MapView from "./MapView";
import ListingList from "./ListingList";
import SearchBar from "./SearchBar";
import LandSearchPagination from "./LandSearchPagination";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const keyword = typeof searchParams.keyword === 'string' ? searchParams.keyword : undefined;
  const theme = typeof searchParams.theme === 'string' ? searchParams.theme : undefined;
  const propertyType = typeof searchParams.propertyType === 'string' ? searchParams.propertyType : undefined;
  const page = parseInt(typeof searchParams.page === 'string' ? searchParams.page : '1', 10) || 1;
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
      .from("Build")
      .select(`
        *,
        label:Label(name),
        buildingOptions:BuildingOption(id, name),
        listingType:ListingType(name)
      `, { count: "exact" })
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .range(from, to);

  if (keyword) {
    if (/^\d+$/.test(keyword)) {
      query = query.eq("id", Number(keyword));
    } else {
      query = query.ilike("address", `%${keyword}%`);
    }
  }
  if (theme) {
    query = query.contains("themes", [theme]);
  }
  if (propertyType) {
    const { data: typeRec } = await supabase.from("ListingType").select("id").eq("name", propertyType).single();
    if (typeRec) {
        query = query.eq("listingTypeId", typeRec.id);
    } else {
        query = query.eq("listingTypeId", -1);
    }
  }

  const { data: listings, count } = await query;
  const totalPages = Math.ceil((count || 0) / limit);
  
  const processedListings = (listings as any[]).map(l => ({
      ...l,
      label: l.label?.name ?? null,
      buildingOptions: l.buildingOptions.map((o: any) => o.name),
      propertyType: l.listingType?.name ?? null,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 검색 바 */}
      <div className="bg-white shadow-sm border-b">
        <SearchBar />
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* 지도 영역 */}
        <div className="w-1/2">
          <MapView listings={processedListings ?? []} />
        </div>
        
        {/* 매물 리스트 영역 */}
        <div className="w-1/2 bg-white border-l flex flex-col h-full">
          {/* 매물 리스트 (스크롤 가능) */}
          <div className="flex-1 overflow-hidden">
            <ListingList listings={processedListings ?? []} />
          </div>
          
          {/* 페이지네이션 (하단 고정) */}
          {totalPages > 1 && (
            <div className="border-t bg-white p-4 flex-shrink-0">
              <LandSearchPagination 
                currentPage={page} 
                totalPages={totalPages}
                searchParams={searchParams}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
