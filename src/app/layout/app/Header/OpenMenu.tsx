const OpenMenu = () => {
  return (
    <ul className="mt-12 space-y-4 text-lg">
      <li className="border-b pb-2"><button className="w-full text-left">관리자페이지 나가기</button></li>
      <li className="border-b pb-2">문의전화 <br />010-456-789</li>
      <li className="border-b pb-2">매물검색</li>
      <li className="border-b pb-2">매물 의뢰</li>
      <li className="border-b pb-2">공지사항</li>
      <li>회사소개</li>
    </ul>
  )
}

export default OpenMenu