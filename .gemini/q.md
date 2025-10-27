`BuildBasic.tsx`와 `BuildingInfo.tsx` 컴포넌트에서 DB의 데이터는 `2025-09-02 00:00:00`이라고 되어있지만 `/admin/listings/listings/[id]/edit`페이지에서 브라우저는 DB를 하루 전으로 빼서 데이터를 불러와서 보여주고 있어.
 나는 수정을하기 때문에 DB에 있는대로 브라우저에 보여지길 바래.
 

 ----
 `console.log('edit edit', data);`이렇게 해보니까
 `constructionYear
: 
"2025-09-01T00:00:00"`
DB에 있는 대로 데이터가 잘 나와. 하지만 나는 콘솔에 찍힌대로 `2025-09-01`가 나왔으면 좋겠는데 하루 전으로 나오게 되네?
`npm run dev`로 확인작업을 안했으면 좋겠어