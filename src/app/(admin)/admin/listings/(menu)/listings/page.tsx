import { BuildFindAll } from "@/app/apis/build"
import Selected from "../Selected"
import ListingsMain from "./ListingsMain"

const Listings = async () => {
  const ListingsData = await BuildFindAll();
  
  return (
    <div>
      <Selected />
      <ListingsMain ListingsData={ListingsData} />
    </div>
  )
}

export default Listings