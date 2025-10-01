import { BuildFindAll } from "@/app/apis/build";
import LandSearchClient from "./LandSearchClient";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = 1; // Always fetch first page on server
  const keyword = typeof searchParams.keyword === 'string' ? searchParams.keyword : undefined;
  const theme = typeof searchParams.theme === 'string' ? searchParams.theme : undefined;
  const propertyType = typeof searchParams.propertyType === 'string' ? searchParams.propertyType : undefined;
  const dealType = typeof searchParams.dealType === 'string' ? searchParams.dealType : undefined;
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'latest';

  // API를 통해 초기 데이터만 가져오기
  const { data: processedListings } = await BuildFindAll(page, 10, keyword, {
    theme,
    propertyType,
    dealType,
  }, sortBy);

  return (
    <LandSearchClient 
      initialListings={processedListings ?? []}
      searchParams={searchParams}
    />
  )
}