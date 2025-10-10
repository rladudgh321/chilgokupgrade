import Smile from "../../svg/Smile"

const ListCard = () => {
  return (
    <div className='p-2 sm:p-4'>
      <div className='p-3 sm:p-4 flex justify-between bg-slate-400 rounded-t-xl text-sm sm:text-base'>
        <div>관리 리스트</div>
      </div>
      <div className='flex flex-col items-center bg-slate-300 min-h-32 sm:min-h-40 p-4 sm:px-10'>
        <div className='flex justify-between items-center w-full gap-x-4 sm:gap-x-8 border-b border-slate-200 py-2'>
          <div className='flex justify-center items-center gap-x-2 sm:gap-x-3'>
            <Smile className='w-6 sm:w-8' />
            <div className="text-xs sm:text-sm">매수의뢰</div>
          </div>
          <div className="bg-red-400 rounded-full w-6 text-center text-white text-xs sm:text-sm">5</div>
        </div>
        <div className='flex justify-between items-center w-full gap-x-4 sm:gap-x-8 border-b border-slate-200 py-2'>
          <div className='flex justify-center items-center gap-x-2 sm:gap-x-3'>
            <Smile className='w-6 sm:w-8' />
            <div className="text-xs sm:text-sm">매도의뢰</div>
          </div>
          <div className="bg-red-400 rounded-full w-6 text-center text-white text-xs sm:text-sm">4</div>
        </div>
        <div className='flex justify-between items-center w-full gap-x-4 sm:gap-x-8 border-b border-slate-200 py-2'>
          <div className='flex justify-center items-center gap-x-2 sm:gap-x-3'>
            <Smile className='w-6 sm:w-8' />
            <div className="text-xs sm:text-sm">연락요청 전체</div>
          </div>
          <div className="bg-red-400 rounded-full w-6 text-center text-white text-xs sm:text-sm">3</div>
        </div>
        <div className='flex justify-between items-center w-full gap-x-4 sm:gap-x-8 py-2'>
          <div className='flex justify-center items-center gap-x-2 sm:gap-x-3'>
            <Smile className='w-6 sm:w-8' />
            <div className="text-xs sm:text-sm">미확인 연락요청</div>
          </div>
          <div className="bg-red-400 rounded-full w-6 text-center text-white text-xs sm:text-sm">2</div>
        </div>
      </div>
    </div>
  )
}

export default ListCard