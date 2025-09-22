import Button from "@/app/components/admin/listings/Button"
import Select from "@/app/components/admin/listings/Select"
import Link from "next/link"

const Selected = () => {
  return (
    <>
      {/* 네비게이션 */}
      <div className="bg-slate-100 p-4">
        <div className="flex flex-wrap gap-x-2">
          {/* Search 제거 */}
          <Select />
          <Select options="구 / 군" />
          <Select options="읍 / 면 / 동"/>
          <Select options="매물 종류" />
          <Select options="거래 유형" />
          <Select options="금액" />
          <Select options="면적" />
          <Select options="테마" />
          <Select options="방" />
          <Select options="층수" />
          <Select options="화장실" />
          <Button>초기화</Button>
        </div>
        <div className="flex flex-wrap gap-x-2 pt-4">
          <Select options="공개여부" />
          <Select options="계약만료순" />
          <Select options="10개씩보기" />
          <Select options="거래구분" />
        </div>
      </div>

      {/* 컨트롤인풋창 */}
      <div className="flex  justify-between items-center bg-slate-200 flex-wrap p-4">
        <div className="border border-slate-500 p-4" role="presentation">전체매물: 100</div>
        
        <table>
          <tbody>
            <tr className="">
              <td role="button" className="border border-slate-500 p-4">최신순</td>
              <td role="button" className="border border-slate-500 p-4">매물번호순</td>
              <td role="button" className="border border-slate-500 p-4">인기순</td>
              <td role="button" className="border border-slate-500 p-4">금액순</td>
              <td role="button" className="border border-slate-500 p-4">면적순</td>
            </tr>
          </tbody>
        </table>

        <div>
          <Link href="/admin/listings/listings/create" className="border border-slate-500 bg-pink-900 text-red-50 px-4 py-2">매물등록</Link>
        </div>
      </div>
    </>
  )
}

export default Selected