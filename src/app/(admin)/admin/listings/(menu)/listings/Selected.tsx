import Button from "@/app/components/admin/listings/Button";
import Select from "@/app/components/admin/listings/Select";
import Link from "next/link";
import { clsx } from "clsx";

type SortKey = "recent" | "views" | "price" | "totalArea";

interface SelectedProps {
  totalCount: number;
  sortKey: SortKey;
  onChangeSort: (k: SortKey) => void;
}

const tabBtn = (active: boolean) =>
  clsx(
    "w-full rounded-md border px-4 py-2 text-sm shadow transition",
    active
      ? "bg-slate-800 text-white border-slate-800"
      : "bg-white text-slate-700 border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
  );

const Selected = ({ totalCount, sortKey, onChangeSort }: SelectedProps) => {
  return (
    <>
      {/* 네비게이션 - 추후 개발 예정*/}
      {/* <div className="bg-slate-100 p-4">
        <div className="flex flex-wrap gap-x-2">
          <Select />
          <Select options="구 / 군" />
          <Select options="읍 / 면 / 동" />
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
      </div> */}

      {/* 컨트롤 인풋창 */}
      <div className="flex justify-between items-center bg-slate-200 flex-wrap p-4 gap-3">
        <div className="border border-slate-500 p-2 rounded bg-white" role="presentation">
          전체매물: {totalCount.toLocaleString()}
        </div>

        {/* 정렬 탭: 테이블 유지 + 실제 버튼 사용 */}
        <table>
          <tbody>
            <tr>
              <td className="p-2">
                <button
                  type="button"
                  className={tabBtn(sortKey === "recent")}
                  onClick={() => onChangeSort("recent")}
                  aria-pressed={sortKey === "recent"}
                >
                  최신순
                </button>
              </td>
              <td className="p-2">
                <button
                  type="button"
                  className={tabBtn(sortKey === "views")}
                  onClick={() => onChangeSort("views")}
                  aria-pressed={sortKey === "views"}
                >
                  인기순
                </button>
              </td>
              <td className="p-2">
                <button
                  type="button"
                  className={tabBtn(sortKey === "price")}
                  onClick={() => onChangeSort("price")}
                  aria-pressed={sortKey === "price"}
                >
                  금액순
                </button>
              </td>
              <td className="p-2">
                <button
                  type="button"
                  className={tabBtn(sortKey === "totalArea")}
                  onClick={() => onChangeSort("totalArea")}
                  aria-pressed={sortKey === "totalArea"}
                >
                  면적순
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <Link
            href="/admin/listings/listings/create"
            className="border border-slate-500 bg-pink-900 text-red-50 px-4 py-2 rounded"
          >
            매물등록
          </Link>
        </div>
      </div>
    </>
  );
};

export default Selected;
