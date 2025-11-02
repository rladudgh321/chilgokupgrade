BuildDetailModalClient컴포넌트를 수정하고자해.
-----
`{Row("층수", `${getFloorString(build.currentFloor)} / ${getFloorString(build.totalFloors)}`)}` 이 부분을 수정하고자해.
----
건물 층수: 지상 totalFloors층 / 지하 basementFloors층
해당 층수: FloorType currentFloor층
---
예를들면 아래와 같이
`건물 층수: 지상 15층 / 지하 2층
해당 층수: 지상 7층`처럼 수정해줘