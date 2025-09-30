ListingList.tsx

이 컴포넌트에서 최신순은 createdAt 순서대로 하고, 인기순은 views가 많은 순서로 하고, 금액순은 `salePrice`, `actualEntryCost`, `rentalPrice`,  `managementFee`  중에 가장 큰 수로 하고, 면적순은 `totalArea`로 가장 큰수대로 해줘.
api를 nextjs15 app router대로 해주고, 내림차순으로 해줘. 기본은 최신순으로 설정해주고 최신순이 active한 상태로 되게 해줘.
api에서 만들어 놓은것이 있을 수 있으니까 내가 만든  api를 검색해줘