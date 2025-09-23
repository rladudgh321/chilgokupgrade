import Selected from "../Selected"
import DeletedListings from "./DeletedListing"
import { BuildFindAllDeleted } from "@/app/apis/build";

const DeletedListingsPage = async() => {
  const DeletedData = await BuildFindAllDeleted();
  return (
    <div>
      <Selected />
      <DeletedListings DeletedData={DeletedData} />
    </div>
  )
}

export default DeletedListingsPage