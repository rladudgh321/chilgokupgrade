const fetchListings = async ({ pageParam = 1, queryKey }: any) => {
  const [, searchParams] = queryKey;
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && typeof value === "string") {
      params.set(key, value);
    }
  });

  params.set("page", pageParam.toString());
  const res = await fetch(`/api/listings?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const fetchMapListings = async ({ queryKey }: any) => {
  const [, searchParams] = queryKey;
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && typeof value === "string") {
      params.set(key, value);
    }
  });
  const res = await fetch(`/api/listings/map?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  return data.data; // The new endpoint wraps data in a `data` property
};
--------

`/landSearch`페이지에서 LandSearchClient컴포넌트의 코드인데 page.tsx에 옮겨서 props로 데이터를 전달해줘.

나는 서버컴포넌트에서는 fetch를 전부 몰아주고 클라이언트 컴포넌트에게 데이터를 props로 전달하고자해

------------
나는 `/card`페이지는 기존대로 pagination으로 하되, `/landSearch`페이지에서는 무한스크롤로 하고 싶어.
`/landSearch`페이지에서는 페이지네이션을 지워줘.