BuildDetailModalClient컴포넌트에서 `  const onClose = () => router.back(); // ← 닫기 시 이전 화면으로` 이 코드 때문에 `/card`페이지에서 루트페이지로 변해. 그리고 루트페이지에서도 BuildDetailModalClient컴포넌트를 사용하거든. 

-----
`/` 루트 페이지에서 ` <ListingSection RecommendData={RecommendData!} QuickSaleData={QuickSaleData!} RecentlyData={RecentlyData!} />` 컴포넌트가 작동을 안하는데?

--------
Runtime TypeError


Cannot read properties of undefined (reading 'title')

src/app/components/root/BuildDetailModal.tsx (55:66) @ BuildDetailModalClient


  53 |
  54 |           <div className="pb-4 border-b">
> 55 |             <h3 className="text-xl sm:text-2xl font-bold">{build.title}</h3>
     |                                                                  ^
  56 |             <p className="text-gray-600 mt-1 text-sm sm:text-base">{build.address}</p>
  57 |           </div>
  58 |
Call Stack
16

Hide 13 ignore-listed frame(s)
BuildDetailModalClient
src/app/components/root/BuildDetailModal.tsx (55:66)
Object.react_stack_bottom_frame
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (23583:20)
renderWithHooks
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (6792:22)
updateFunctionComponent
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (9246:19)
beginWork
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (10857:18)
runWithFiberInDEV
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (871:30)
performUnitOfWork
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (15726:22)
workLoopSync
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (15546:41)
renderRootSync
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (15526:11)
performWorkOnRoot
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (15033:44)
performSyncWorkOnRoot
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (16830:7)
flushSyncWorkAcrossRoots_impl
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (16676:21)
processRootScheduleInMicrotask
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (16714:9)
<unknown>
node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (16849:13)
LandSearchClient
src/app/(app)/landSearch/LandSearchClient.tsx (517:9)
Page
src\app\(app)\landSearch\page.tsx (27:5)