`/landSearch`페이지에서 KakaoScript 컴포넌트 즉 MamView컴포넌트가 searchParams에 조작되면 사라져.
여전히 재생되고 있지 않아.
초기 `/landSearch` 에도 없어졌어

`const [scriptLoaded, setScriptLoaded] = useState(() => !!globalThis.kakao?.maps);` MapView컴포넌트에서 window를 초기값으로 둘 수는 없어. 왜냐하면 useEffect 바깥에 있기 때문이지. 그리고 hook의 원칙을 어긋나지 않게 코드를 수정해줘