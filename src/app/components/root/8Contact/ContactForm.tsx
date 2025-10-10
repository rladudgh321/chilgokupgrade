"use client"
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form"

type ContactRequestInput = {
  author: string
  contact: string
  description: string
  note?: string
}

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<ContactRequestInput>()

  const onSubmit: SubmitHandler<ContactRequestInput> = async (data) => {
    try {
      const payload = {
        confirm: false,
        author: data.author.trim(),
        contact: data.contact.trim(),
        ipAddress: "", // 서버에서 기록 가능
        description: data.description.trim(),
        note: data.note?.trim() || "",
        date: new Date().toISOString(),
      }
      const res = await fetch('/api/supabase/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(`문의 저장 실패: ${txt}`)
      }
      alert('문의가 접수되었습니다. 빠른 연락 드리겠습니다.')
      reset()
    } catch (e) {
      alert((e as Error)?.message ?? '전송 중 오류가 발생했습니다')
    }
  }

  // 에러 핸들링
  const onError: SubmitErrorHandler<ContactRequestInput> = (errors) => {
    if (errors.contact?.message) {
      alert(errors.contact.message)
    } else if (errors.description) {
      alert("보내실 메시지를 적어주세요")
    } else if (errors.author) {
      alert("이름을 입력해주세요")
    }
  }

  return (
    <form className="m-4 sm:m-6 space-y-4" onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <input
        className="block bg-white w-full h-10 rounded-b-md p-2 text-base"
        type="text"
        placeholder="이름"
        {...register("author", {
          required: { value: true, message: "이름을 입력해주세요." },
          minLength: { value: 2, message: "이름은 2자 이상이어야 합니다." }
        })}
      />

      <input
        className="block bg-white w-full h-10 rounded-b-md p-2 text-base"
        type="tel"
        placeholder="연락처 (예: 010-1234-5678)"
        {...register("contact", {
          required: { value: true, message: "휴대폰 번호를 입력해주세요." },
          pattern: {
            value: /^(010\d{8}|010-\d{4}-\d{4})$/,
            message: "휴대폰 번호는 01012345678 또는 010-1234-5678 형식이어야 합니다.",
          },
        })}
      />

      <textarea
        rows={6}
        className="block bg-white w-full p-2 text-base"
        placeholder="무엇이든 편히 말씀하세요"
        {...register("description", { required: true })}
      />

      <button
        type="submit"
        className="inline-block p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto"
      >
        보내기
      </button>
    </form>
  )
}

export default ContactForm
