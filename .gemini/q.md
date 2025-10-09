디자인은 루트 폴더의 `.gemini`폴더 안에 있는 `./aaa.png`에 있는 것으로 디자인해줘. 모달처럼 나오도록 가로 폭 사이즈를 잘 조절해줘.
Build테이블에 있는 정보를 잘 조합해서 넣어줘.
--------
확인해보기 위해서 루트페이지의 CardSlide를 클릭하면 나오도록해줘
나는 모달을 재사용할 예정이야. 루트페이지의 이달의 추천목록과, `/card`페이지들의 매물들과 `/landSearch`페이지들의 매물들에게 클릭을 하면 모달 창이 뜨고 그 페이지에 있는 라우트세그먼트 위에 뜨게 하여 살짝 background로 어둡게 하고 투명도도 있게 하여 고급스러운 느낌을 연출하고 싶어
-----------
api를 작성할때는 수퍼베이스 api를 작성해줘 `/api/builds/[id]/routes.ts`
------------------------------
(index):1 Access to fetch at 'http://127.0.0.1:3000/api/supabase/build/156' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

build.ts:89 
 GET http://127.0.0.1:3000/api/supabase/build/156 net::ERR_FAILED 200 (OK)
build.ts:97 Fetch failed for BuildFindOne: TypeError: Failed to fetch
    at BuildFindOne (build.ts:89:23)
    at BuildDetailModal.useEffect.fetchBuild (BuildDetailModal.tsx:21:39)
    at BuildDetailModal.useEffect (BuildDetailModal.tsx:31:5)
BuildDetailModal.tsx:25 TypeError: Failed to fetch
    at BuildFindOne (build.ts:89:23)
    at BuildDetailModal.useEffect.fetchBuild (BuildDetailModal.tsx:21:39)
    at BuildDetailModal.useEffect (BuildDetailModal.tsx:31:5)
(index):1 Access to fetch at 'http://127.0.0.1:3000/api/supabase/build/156' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
build.ts:89 
 GET http://127.0.0.1:3000/api/supabase/build/156 net::ERR_FAILED 200 (OK)
build.ts:97 Fetch failed for BuildFindOne: TypeError: Failed to fetch
    at BuildFindOne (build.ts:89:23)
    at BuildDetailModal.useEffect.fetchBuild (BuildDetailModal.tsx:21:39)
    at BuildDetailModal.useEffect (BuildDetailModal.tsx:31:5)
BuildDetailModal.tsx:25 TypeError: Failed to fetch
    at BuildFindOne (build.ts:89:23)
    at BuildDetailModal.useEffect.fetchBuild (BuildDetailModal.tsx:21:39)
    at BuildDetailModal.useEffect (BuildDetailModal.tsx:31:5)


---------
fetch가 끝나는 지점에 console.log를 해서 문제의 정확한 원인을 추적해줘