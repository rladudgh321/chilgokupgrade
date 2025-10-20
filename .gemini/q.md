`DashboardPage`컴포넌트 즉 `/admin`페이지를 수정하고자해.

나는 직접적으로 page.tsx에 supabase를 부르기보다 `fetch`를 선호해.
`/api/**`폴더 아래에 적합한 api가 있으면 가져다 사용하고 없으면 새로 생성해줘.
----------
DashboardClient컴포넌트 아래에 자식 컴포넌트에 대해서 fetch를 사용하는 컴포넌트가 있다면 서버컴포넌트인 `page.tsx`에서 props로 전달해서
성능최적화를 실현해줘
-----------
dash