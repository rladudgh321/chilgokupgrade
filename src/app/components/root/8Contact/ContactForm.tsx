"use client"
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form"

type CustomerSendMessage = {
  customerText: string
  customerPhoneNumber: string
}

const ContactForm = () => {
  const {
    register,
    handleSubmit,
  } = useForm<CustomerSendMessage>()

  const onSubmit: SubmitHandler<CustomerSendMessage> = async (data) => {
    console.log("data", data)
    // 실제 전송 로직 ...
  }

  // 에러 핸들링
  const onError: SubmitErrorHandler<CustomerSendMessage> = (errors) => {
    if (errors.customerPhoneNumber?.message) {
      alert(errors.customerPhoneNumber.message)
    } else if (errors.customerText) {
      alert("보내실 메시지를 적어주세요")
    }
  }

  return (
    <form className="m-6 space-y-4" onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <textarea
        rows={6}
        className="block bg-white w-full"
        defaultValue="무엇이든 편히 말씀하세요"
        {...register("customerText", {
          required: true,
        })}
      />

      <input
        className="inline-block bg-white h-10 rounded-b-md"
        type="tel"
        {...register("customerPhoneNumber", {
          required: {
            value: true,
            message: "휴대폰 번호를 입력해주세요.",
          },
          pattern: {
            value: /^(010\d{8}|010-\d{4}-\d{4})$/,
            message: "휴대폰 번호는 01012345678 또는 010-1234-5678 형식이어야 합니다.",
          },
        })}
      />

      <button
        type="submit"
        className="inline-block p-2 ml-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        보내기
      </button>
    </form>
  )
}

export default ContactForm
