import { BuildFindAll } from "@/app/apis/build";
import LandSearchClient from "./LandSearchClient";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = parseInt(typeof searchParams.page === 'string' ? searchParams.page : '1', 10) || 1;
  const keyword = typeof searchParams.keyword === 'string' ? searchParams.keyword : undefined;
  const theme = typeof searchParams.theme === 'string' ? searchParams.theme : undefined;
  const propertyType = typeof searchParams.propertyType === 'string' ? searchParams.propertyType : undefined;
  const dealType = typeof searchParams.dealType === 'string' ? searchParams.dealType : undefined;

  // API를 통해 데이터 가져오기
  const { data: processedListings, totalPages } = await BuildFindAll(page, 10, keyword, {
    theme,
    propertyType,
    dealType,
  });

  return (
    <LandSearchClient 
      initialListings={processedListings ?? []}
      totalPages={totalPages}
      currentPage={page}
      searchParams={searchParams}
    />
  )
}
