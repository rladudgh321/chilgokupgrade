Error: Route "/landSearch" used `searchParams.sortBy`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at Page (src\app\(app)\landSearch\page.tsx:10:38)
   8 |   const propertyType = searchParams.propertyType ? decodeURIComponent(searchParams.propertyType as string) : undefined;
   9 |   const dealType = searchParams.dealType ? decodeURIComponent(searchParams.dealType as string) : undefined;
> 10 |   const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'latest';