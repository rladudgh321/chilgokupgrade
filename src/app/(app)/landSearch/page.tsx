import MapView from "./MapView"
import ListingList from "./ListingList"
import SearchBar from "./SearchBar"
import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: listings } = await supabase.from("Build").select("*").order("createdAt", { ascending: false })

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
        <div className="w-1/2 bg-white border-l">
          <ListingList listings={listings ?? []} />
        </div>
      </div>
    </div>
  )
}
