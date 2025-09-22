"use client"

import BuyType from "../../components/landSearch/LandOption"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import Crop from "../../utility/Crop";
import ToggleSwitch from "@/app/components/admin/listings/ToggleSwitch";
import Pagination from "@/app/components/shared/_Pagination";

type LandSearchInfo = {
  // imageFile: any;
  buyType: 'apart' | 'villa' | 'one_two_three_room' | 'office' | 'store' | 'office_hotel' | 'no_selected'
  floor: number;
}

const PlayGround = () => {
  const methods = useForm<LandSearchInfo>();
  const onSubmit: SubmitHandler<LandSearchInfo> = data => console.log(data);
  return (
    <section>
      <FormProvider { ...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Crop />
            <div>
                <BuyType />
                {/* <br /> */}
                {/* <TitleArea title={title} onChangeTitle={onChangeTitle} description={description} onChangeDescription={onChangeDescription} /> */}
                {/* <Location eump={eump} setEump={setEump} li={li} setLi={setLi} addre={addre} setAddre={setAddre} /> */}
                <ToggleSwitch toggle id="hi" />
            </div>
            <div>
                <button type='submit'>등록</button>
            </div>
        </form>
      </FormProvider>
      <div>
        <Pagination currentPage={1} totalPages={30} />
      </div>
    </section>
  )
}

export default PlayGround