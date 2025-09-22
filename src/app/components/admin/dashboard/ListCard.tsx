import Smile from "../../svg/Smile"

const ListCard = () => {
  return (
    <div className='p-4'>
      <div className='p-4 flex justify-between bg-slate-400 rounded-t-xl'>
        <div>관리 리스트</div>
      </div>
      <div className='flex flex-col items-center bg-slate-300 min-h-40 px-10'>
        <div className='flex justify-between items-center w-full gap-x-8 border-b border-slate-200'>
          <div className='flex justify-center items-center gap-x-3'>
            <Smile className='w-8' />
            <div>매수의뢰</div>
          </div>
          <div className="bg-red-400 rounded-full w-6 text-center text-white">5</div>
        </div>
        <div className='flex justify-between items-center w-full gap-x-8 border-b border-slate-200'>
          <div className='flex justify-center items-center gap-x-3'>
            <Smile className='w-8' />
            <div>매도의뢰</div>
          </div>
          <div className="bg-red-400 rounded-full w-6 text-center text-white">4</div>
        </div>
        <div className='flex justify-between items-center w-full gap-x-8 border-b border-slate-200'>
          <div className='flex justify-center items-center gap-x-3'>
            <Smile className='w-8' />
            <div>연락요청 전체</div>
          </div>
          <div className="bg-red-400 rounded-full w-6 text-center text-white">3</div>
        </div>
        <div className='flex justify-between items-center w-full gap-x-8'>
          <div className='flex justify-center items-center gap-x-3'>
            <Smile className='w-8' />
            <div>미확인 연락요청</div>
          </div>
          <div className="bg-red-400 rounded-full w-6 text-center text-white">2</div>
        </div>
      </div>
    </div>
  )
}

export default ListCard