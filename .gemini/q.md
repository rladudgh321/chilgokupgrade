BuildDetailModalClient컴포넌트에서 `  const onClose = () => router.back(); // ← 닫기 시 이전 화면으로` 이 코드 때문에 `/card`페이지에서 루트페이지로 변해. 그리고 루트페이지에서도 BuildDetailModalClient컴포넌트를 사용하거든. 

-----
`/` 루트 페이지에서 ` <ListingSection RecommendData={RecommendData!} QuickSaleData={QuickSaleData!} RecentlyData={RecentlyData!} />` 컴포넌트가 작동을 안하는데?