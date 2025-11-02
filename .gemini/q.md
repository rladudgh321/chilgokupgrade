<div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>
                {listing.currentFloor && listing.totalFloors
                  ? `${listing.currentFloor}/${listing.totalFloors}층`
                  : "층수 정보 없음"}
              </span>
            </div>
            ---

위의 코드는 CardItem컴포넌트에서 가지고 왔는데 위 부분의 코드를 수정하고 싶어.
`7층 (지상 15층, 지하 2층)` 형식으로 하고 싶어

currentFloor는 현재층이고
totalFloors는 지상 전체층이고
basementFloors는 지하 전체층이라고 할 때
`currentFloor층(지상 totalFloors층 / 지하 basementFloors층)` 이렇게 표현하고 싶어.
지하층이 없을 때나 0층이면
`currentFloor층(지상 totalFloors층)`으로 표현해줘
만일 currentFloor이 음수라면 지하층이니까 `B`를 붙여줘 예를들면 `-3`이라면 `B3`으로 표현해줘