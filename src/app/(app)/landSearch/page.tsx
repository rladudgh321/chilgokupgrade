import MapView from "./MapView"
import ListingList from "./ListingList"
import SearchBar from "./SearchBar"
import LandSearchPagination from "./LandSearchPagination"
import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // URL 파라미터에서 필터 값 추출
  const params = await searchParams;
  const keyword = typeof params.keyword === 'string' ? params.keyword : undefined;
  const theme = typeof params.theme === 'string' ? params.theme : undefined;
  const page = parseInt(typeof params.page === 'string' ? params.page : '1', 10) || 1;
  const limit = 10; // 페이지당 아이템 수
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 기본 쿼리 (카운트 포함)
  let query = supabase.from("Build").select("*", { count: "exact" }).is("deletedAt", null).order("createdAt", { ascending: false }).range(from, to);

  // 키워드 필터링
  if (keyword) {
    if (/^\d+$/.test(keyword)) {
      query = query.eq("id", Number(keyword));
    } else {
      query = query.ilike("address", `%${keyword}%`);
    }
  }

  // 테마 필터링
  if (theme) {
    query = query.contains("themes", [theme]);
  }

  const { data: listings, count } = await query;
  const totalPages = Math.ceil((count || 0) / limit);

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
          <MapView listings={listings ?? []} />
        </div>
        
        {/* 매물 리스트 영역 */}
        <div className="w-1/2 bg-white border-l flex flex-col h-full">
          {/* 매물 리스트 (스크롤 가능) */}
          <div className="flex-1 overflow-hidden">
            <ListingList listings={listings ?? []} />
          </div>
          
          {/* 페이지네이션 (하단 고정) */}
          {totalPages > 1 && (
            <div className="border-t bg-white p-4 flex-shrink-0">
              <LandSearchPagination 
                currentPage={page} 
                totalPages={totalPages}
                searchParams={params}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
