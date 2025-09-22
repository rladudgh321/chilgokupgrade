interface IChartProps {
  title: string;
  chart: string;
}

const Chart = ({title, chart}: IChartProps) => {
  return (
    <div className='grow p-4'>
      <div className='p-4 flex justify-between bg-slate-400 rounded-t-xl'>
        <div>{title}</div>
      </div>
      <div>{chart}</div>
      <div className="bg-slate-200">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
      <div className="bg-slate-300">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
      <div className="bg-slate-200">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
      <div className="bg-slate-300">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
      <div className="bg-slate-200">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
      <div className="bg-slate-300">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2">
            <div>1</div>
            <div>신축 빌라</div>
          </div>
          <div>4,857</div>
        </div>
      </div>
      <div className="bg-slate-200">
        <div className="flex justify-between items-center">
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