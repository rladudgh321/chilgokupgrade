"use client"
import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@/app/components/shared/Editor'), { ssr: false });

interface Post {
  id?: string
  title: string
  content: string
  popupContent?: string
  representativeImage?: string | null
  externalLink?: string | null
  registrationDate: string
  manager: string
  isAnnouncement: boolean
  isPopup: boolean
  popupWidth?: number
  popupHeight?: number
  isPublished: boolean
}

interface AdminBoardFormProps {
  initialData?: Post
  isEdit?: boolean
}

const AdminBoardForm = ({ initialData, isEdit = false }: AdminBoardFormProps) => {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    representativeImage: null as File | null,
    representativeImageUrl: initialData?.representativeImage || null,
    externalLink: initialData?.externalLink || "",
    registrationDate: initialData?.registrationDate ? new Date(initialData.registrationDate).toISOString().split('T')[0] : "",
    manager: initialData?.manager || "데모",
    title: initialData?.title || "",
    content: initialData?.content || "",
    popupContent: initialData?.popupContent || "",
    isAnnouncement: initialData?.isAnnouncement ? "사용" : "미사용",
    isPopup: initialData?.isPopup ? "사용" : "미사용",
    popupWidth: initialData?.popupWidth?.toString() || "400",
    popupHeight: initialData?.popupHeight?.toString() || "400",
    isPublished: initialData?.isPublished === undefined ? true : initialData.isPublished,
  })

  useEffect(() => {
    if (!isEdit) {
      setFormData(prev => ({
        ...prev,
        registrationDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [isEdit]);

  const handleContentChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, content: value }))
  }, []);

  const handlePopupContentChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, popupContent: value }))
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, representativeImage: file, representativeImageUrl: URL.createObjectURL(file) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let representativeImageUrl: string | undefined | null = initialData?.representativeImage
      if (formData.representativeImage) {
        const fd = new FormData()
        fd.append('file', formData.representativeImage)
        fd.append('prefix', 'board')
        const uploadRes = await fetch('/api/image/upload', { method: 'POST', body: fd })
        const uploadJson = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadJson.message || '이미지 업로드 실패')
        representativeImageUrl = uploadJson.url as string
      }

      const submitData = {
        title: formData.title,
        content: formData.content,
        popupContent: formData.popupContent,
        representativeImage: representativeImageUrl,
        externalLink: formData.externalLink || undefined,
        registrationDate: formData.registrationDate || undefined,
        manager: formData.manager,
        isAnnouncement: formData.isAnnouncement === "사용",
        isPopup: formData.isPopup === "사용",
        popupWidth: formData.popupWidth ? parseInt(formData.popupWidth) : undefined,
        popupHeight: formData.popupHeight ? parseInt(formData.popupHeight) : undefined,
        isPublished: formData.isPublished,
      }

      const apiUrl = isEdit ? `/api/board/posts/${initialData?.id}` : '/api/board/posts'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `게시글 ${isEdit ? '수정' : '저장'}에 실패했습니다`)
      }

      alert(`게시글이 ${isEdit ? '수정' : '저장'}되었습니다.`)
      router.push("/admin/board/admin-board")
      router.refresh()
    } catch (error: any) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} post:`, error)
      alert(error.message || `게시글 ${isEdit ? '수정' : '저장'}에 실패했습니다.`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-purple-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">{isEdit ? '글수정' : '글쓰기'}</h1>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              대표 이미지
            </label>
            <p className="text-sm text-gray-500 mb-2">
              가로 1100px 이상은 자동 리사이징 됩니다.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="px-4 py-2 bg-gray-500 text-white rounded-lg cursor-pointer hover:bg-gray-600"
              >
                파일 선택
              </label>
              <span className="text-gray-600">
                {formData.representativeImage ? formData.representativeImage.name : (initialData?.representativeImage ? "기존 이미지" : "선택된 파일 없음")}
              </span>
            </div>
            {formData.representativeImageUrl && (
              <div className="mt-4">
                <img src={formData.representativeImageUrl} alt="preview" className="max-w-xs rounded" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                외부링크
              </label>
              <input
                type="url"
                value={formData.externalLink}
                onChange={(e) => setFormData(prev => ({ ...prev, externalLink: e.target.value }))}
                placeholder="http://를 포함한 주소"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                등록일
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.registrationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, registrationDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  📅
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                담당자
              </label>
              <select
                value={formData.manager}
                onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="데모">데모</option>
                <option value="관리자">관리자</option>
                <option value="운영자">운영자</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              공개여부
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isPublished"
                  value="true"
                  checked={formData.isPublished === true}
                  onChange={() => setFormData(prev => ({ ...prev, isPublished: true }))}
                  className="form-radio h-4 w-4 text-purple-600"
                />
                <span className="ml-2 text-gray-700">공개</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isPublished"
                  value="false"
                  checked={formData.isPublished === false}
                  onChange={() => setFormData(prev => ({ ...prev, isPublished: false }))}
                  className="form-radio h-4 w-4 text-purple-600"
                />
                <span className="ml-2 text-gray-700">비공개</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="제목"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <Editor value={formData.content} onChange={handleContentChange} />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공지여부
              </label>
              <select
                value={formData.isAnnouncement}
                onChange={(e) => setFormData(prev => ({ ...prev, isAnnouncement: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="미사용">미사용</option>
                <option value="사용">사용</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                팝업여부
              </label>
              <select
                value={formData.isPopup}
                onChange={(e) => setFormData(prev => ({ ...prev, isPopup: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="미사용">미사용</option>
                <option value="사용">사용</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                팝업크기
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.popupWidth}
                  onChange={(e) => setFormData(prev => ({ ...prev, popupWidth: e.target.value }))}
                  className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="400"
                />
                <span className="flex items-center text-gray-500">px</span>
                <input
                  type="number"
                  value={formData.popupHeight}
                  onChange={(e) => setFormData(prev => ({ ...prev, popupHeight: e.target.value }))}
                  className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="400"
                />
                <span className="flex items-center text-gray-500">px</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              팝업내용
            </label>
            <Editor value={formData.popupContent} onChange={handlePopupContentChange} />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.push("/admin/board/admin-board")}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              목록
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {isEdit ? '수정' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminBoardForm