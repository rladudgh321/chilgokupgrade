import ListManager from "@/app/(admin)/shared/ListManager"

const RoomPage = () => {
  return (
    <>
      <ListManager
      title="방 갯수"
      placeholder="새로운 방 갯수 등록"
      buttonText="등록"
      apiEndpoint="/api/room-options"
    />
    <ListManager
      title="층 단위"
      placeholder="새로운 층단위 등록"
      buttonText="등록"
      apiEndpoint="/api/floor-options"
    />
    <ListManager
      title="화장실 갯수"
      placeholder="새로운 화장실 갯수 등록"
      buttonText="등록"
      apiEndpoint="/api/bathroom-options"
    />
    </>
  )
}

export default RoomPage