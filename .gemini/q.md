//page.tsx
async function getPopupPosts(): Promise<PopupPost[]> {
  const res = await fetch(`http://127.0.0.1:3000/api/popup`);
  if(!res.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await res.json();
  return data.data;
}
------------
//LandSearchClient.tsx
const res = await fetch(`/api/listings/map?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();

--------------
`LandSearchClient`컴포넌트에서 fetch처럼 사용하는데 root의 page.tsx에는 왜 `http://127.0.0.1:3000`을 넣어줘야 작동할까? 그 이유를 말해줘 코드수정은 하지말고 한글로 말해줘