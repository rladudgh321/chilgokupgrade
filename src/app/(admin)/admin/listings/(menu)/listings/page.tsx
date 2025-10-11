export const dynamic = 'force-dynamic';

import { BuildFindAll } from "@/app/apis/build";
import ListingsShell from "./ListingsShell";

const Listings = async () => {
  const ListingsData = await BuildFindAll();
  return <ListingsShell ListingsData={ListingsData} />;
};

export default Listings;
