import { BuildFindAll } from "@/app/apis/build";
import LandSearchClient from "./LandSearchClient";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { 
    keyword: keywordParam,
    theme: themeParam,
    propertyType: propertyTypeParam,
    dealType: dealTypeParam,
    sortBy: sortByParam 
  } = searchParams;

  const page = 1; // Always fetch first page on server
  const keyword = typeof keywordParam === 'string' ? keywordParam : undefined;
  const theme = typeof themeParam === 'string' ? themeParam : undefined;
  const propertyType = propertyTypeParam ? decodeURIComponent(propertyTypeParam as string) : undefined;
  const dealType = dealTypeParam ? decodeURIComponent(dealTypeParam as string) : undefined;
  const sortBy = typeof sortByParam === 'string' ? sortByParam : 'latest';

  // API를 통해 초기 데이터만 가져오기
  const { data: processedListings } = await BuildFindAll(page, 10, keyword, {
    theme,
    propertyType,
    dealType,
  }, sortBy);
  return (
    <LandSearchClient 
      initialListings={processedListings ?? []}
    />
  )
}