ListingsMain컴포넌트를 수정하고자해. 그 중에서 printPhotoVersion, printTextVersion변수를 각각 따로 컴포넌트를 따로 분리했으면 좋겠어.
그리고 아래와 같이 `층`을 수정해줘
-----
건물 층수: 지상 totalFloors층 / 지하 basementFloors층
해당 층수: FloorType currentFloor층
---
예를들면 아래와 같이
`건물 층수: 지상 15층 / 지하 2층
해당 층수: 지상 7층`처럼 수정해줘