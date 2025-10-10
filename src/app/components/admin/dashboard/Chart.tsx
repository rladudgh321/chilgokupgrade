interface IChartProps {
  title: string;
  chart: string;
}

const Chart = ({title, chart}: IChartProps) => {
  return (
    <div className='grow p-2 sm:p-4'>
      <div className='p-3 sm:p-4 flex justify-between bg-slate-400 rounded-t-xl text-sm sm:text-base'>
        <div>{title}</div>
      </div>
      <div className="text-center text-sm sm:text-base">{chart}</div>
      <div className="bg-slate-200 p-2 sm:p-3">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
      <div className="bg-slate-300 p-2 sm:p-3">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
      <div className="bg-slate-200 p-2 sm:p-3">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
      <div className="bg-slate-300 p-2 sm:p-3">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
      <div className="bg-slate-200 p-2 sm:p-3">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
      <div className="bg-slate-300 p-2 sm:p-3">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
      <div className="bg-slate-200 p-2 sm:p-3">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
    </div>
  )
}

export default Chart