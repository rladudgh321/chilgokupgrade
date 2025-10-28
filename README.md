# 주요 목적
1. 상업용으로 팔 것
2. 기술적 요소를 추가로 공부하지 말것
3. 부동산 앱을 만들어서 비즈니스가 필요한 사람에게 판매를 저렴하게 팔 것

# 큰계획

1. app 그룹에는 static 렌더링 ISR로 tag로는 admin의 수정사항 있을시 작업

2. admin 그룹에는 웬만하면 SSR로 작업



## 개선사항 및 작업사항

1. utility에 Crop.tsx를 리팩토링할 필요가 있음
리팩토링할때 서버와 상호작용하면서 해야함

2. reacthookform에서 FormProvider를 chihdlren으로 감싸서 가능할지? 최적화 기대

## 주의사항
1. CreateClient에 수많은 속성을 저장해두었는데
select Element에는 기본값설정을 컴포넌트 인자로 설정해두었다
만일 select값을 바꿀 일이 있으면 기본값 설정 확인을 잊지말 것

2. KST기준으로 DB가 저장됨. 만일 다른나라를 만들경우 UTC 기준으로 만들어서 배포할것

## sentry & slack
npx @sentry/wizard@latest -i nextjs --saas --org chilgok --project javascript-nextjs
npm i @slack/webhook

## 사용자 일러주기
1. 매물관리/옵션등록 사항에 순서 바꾸는 것 교육시키기 꽤 어려울 수 있음

### 기술스택
1. node v22.14.0

### 제마나이 계정변경
rm -f ~/.gemini/settings.json

const DatePicker = React.lazy(() => import('react-datepicker'));

<Suspense>
  <DatePicker />
</Suspense>
##api/inquiries/orders/route.ts에서는 post 요청이 prisma 방식으로 api작성됨 rls할때 참고.

------
데이터가 안흐른다고 생각할 때는 양쪽의 데이터를 설명한다
예를들면 클라이언트의 데이터console.log와 백엔드의 데이터 console.log를 확인해본다

----------------------
### 마지막 확인해야할 작업
1. `/landSearch`, `/card`페이지의 `최신순, 인기순, 금액순, 면적순`에 대한 카테고리 api작업을 해야한다
2. SnsIcon 컴포넌트에서 Image 로고 src 기본값을 변경해야할 것
---------
나는 nextjs15 app router를 사용하고 있고 `/api`를 사용하여 route handler를 사용하고 있어 api 폴더 아래에 모든 route.ts에 대해 test코드를 작성해줘 jest로 해줘
--------
아직 route.ts에 대한 test코드가 없는 경우 찾아서 test코드를 작성해줘

-----------
RLS

C    (auth.uid() = 'f312fbfc-cf58-405e-86ef-e9047966fa52'::uuid)
R
U     (auth.uid() = 'f312fbfc-cf58-405e-86ef-e9047966fa52'::uuid)
D    (auth.uid() = 'f312fbfc-cf58-405e-86ef-e9047966fa52'::uuid)