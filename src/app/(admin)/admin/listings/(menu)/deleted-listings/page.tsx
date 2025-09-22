import Pagination from "@/app/components/shared/_Pagination"
import Selected from "../Selected"

const DeletedListings = () => {
  return (
    <div>
      <Selected />
      DeletedListings

      
      {/* 페이지네이션*/}
      <div>
        <Pagination currentPage={11} totalPages={20} />
      </div>
    </div>
  )
}

export default DeletedListings