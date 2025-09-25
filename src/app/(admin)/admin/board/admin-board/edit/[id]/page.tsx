"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const AdminBoardEdit = ({ params }: {
  params: Promise<{ id: string }>;
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [postId, setPostId] = useState<string>("")
  const [formData, setFormData] = useState({
    category: "",
    announcement: "",
    representativeImage: null as File | null,
    externalLink: "",
    registrationDate: new Date().toISOString().split('T')[0],
    manager: "데모",
    title: "",
    content: "",
    popupContent: "",
    isAnnouncement: "미사용",
    isPopup: "미사용",
    popupWidth: "400",
    popupHeight: "400"
  })
  const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>(undefined)
  // (삭제됨) 카테고리/공지 옵션 상태 제거

  // 데이터 로드
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { id } = await params
      if (!mounted) return
      // (삭제됨) 카테고리/공지 옵션 로드
      setPostId(id)
      await loadPost(id)
    })()
    return () => { mounted = false }
  }, [params])

  const loadPost = async (id: string) => {
    try {
      const response = await fetch(`/api/board/posts/${id}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || '게시글을 불러오는데 실패했습니다')
      }

      const post = result.data
      setFormData({
        category: (post.categoryId ?? "").toString(),
        announcement: (post.announcementId ?? "").toString(),
        representativeImage: null,
        externalLink: post.externalLink || "",
        registrationDate: post.registrationDate 
          ? new Date(post.registrationDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        manager: post.manager || "데모",
        title: post.title || "",
        content: post.content || "",
        popupContent: post.popupContent || "",
        isAnnouncement: post.isAnnouncement ? "사용" : "미사용",
        isPopup: post.isPopup ? "사용" : "미사용",
        popupWidth: post.popupWidth?.toString() || "400",
        popupHeight: post.popupHeight?.toString() || "400"
      })
      setExistingImageUrl(post.representativeImage || undefined)
    } catch (error: unknown) {
      console.error('Error loading post:', error)
      const msg = error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, representativeImage: file }))
    }
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // 대표이미지 변경 시 업로드
      let representativeImageUrl: string | undefined = undefined
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
        representativeImage: representativeImageUrl ?? existingImageUrl,
        externalLink: formData.externalLink || undefined,
        registrationDate: formData.registrationDate || undefined,
        manager: formData.manager,
        isAnnouncement: formData.isAnnouncement === "사용",
        isPopup: formData.isPopup === "사용",
        popupWidth: formData.popupWidth ? parseInt(formData.popupWidth) : undefined,
        popupHeight: formData.popupHeight ? parseInt(formData.popupHeight) : undefined,
        isPublished: true,
      }

      const response = await fetch(`/api/board/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || '게시글 수정에 실패했습니다')
      }

      alert("게시글이 수정되었습니다.")
      router.push("/admin/board/admin-board")
    } catch (error: unknown) {
      console.error('Error updating post:', error)
      const msg = error instanceof Error ? error.message : '게시글 수정에 실패했습니다.'
      alert(msg)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-purple-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">글 수정</h1>
      </div>

      {/* 메인 폼 */}
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* (삭제됨) 카테고리/공지사항 선택 영역 */}

          {/* 대표 이미지 */}
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
                {formData.representativeImage ? formData.representativeImage.name : "선택된 파일 없음"}
              </span>
              {(!formData.representativeImage && existingImageUrl) && (
                <div className="ml-4">
                  <img src={existingImageUrl} alt="대표 이미지" className="h-16 w-28 object-cover rounded border" />
                </div>
              )}
            </div>
          </div>

          {/* 외부 링크, 등록일, 담당자 */}
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

          {/* 제목 */}
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

          {/* 내용 에디터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <div className="border border-gray-300 rounded-lg">
              {/* 에디터 툴바 */}
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center gap-2 flex-wrap">
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">소스</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">↶</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">↷</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">🔍</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50 font-bold">B</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50 italic">I</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50 underline">U</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">⬅</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">⬆</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">➡</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">⬇</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">🔗</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">🖼</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">📊</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">😊</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">🎥</button>
                <select className="px-2 py-1 text-sm bg-white border rounded">
                  <option>크기</option>
                </select>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">A-</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">A+</button>
              </div>
              
              {/* 에디터 영역 */}
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full h-64 p-4 border-0 resize-none focus:outline-none"
                placeholder="내용을 입력하세요..."
              />
            </div>
          </div>

          {/* 공지여부, 팝업여부, 팝업크기 */}
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

          {/* 팝업내용 에디터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              팝업내용
            </label>
            <div className="border border-gray-300 rounded-lg">
              {/* 에디터 툴바 */}
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center gap-2 flex-wrap">
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">소스</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">↶</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">↷</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">🔍</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50 font-bold">B</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50 italic">I</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50 underline">U</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">⬅</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">⬆</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">➡</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">⬇</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">🔗</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">🖼</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">📊</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">😊</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">🎥</button>
                <select className="px-2 py-1 text-sm bg-white border rounded">
                  <option>크기</option>
                </select>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">A-</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">A+</button>
              </div>
              
              {/* 에디터 영역 */}
              <textarea
                value={formData.popupContent}
                onChange={(e) => setFormData(prev => ({ ...prev, popupContent: e.target.value }))}
                className="w-full h-64 p-4 border-0 resize-none focus:outline-none"
                placeholder="팝업 내용을 입력하세요..."
              />
            </div>
          </div>

          {/* 버튼들 */}
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
              수정
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminBoardEdit
