import dynamic from 'next/dynamic'
const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false })

export default function MyComponent() {
  return <DatePicker />
}
---------
위의 코드처럼, 모든 파일의 `DatePicker`는 동적으로 불러오도록 수정해줘