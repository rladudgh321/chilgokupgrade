"use client"

import Link from "next/link"

const OpenMenu = ({ onClose }: { onClose?: () => void }) => {
  return (
    <ul className="mt-12 space-y-4 text-lg">
      <li className="border-b pb-2">문의전화 <br />010-456-789</li>
      <li className="border-b pb-2">
        <Link href="/landSearch" onClick={() => onClose?.()}>매물검색</Link>
      </li>
      <li className="border-b pb-2">
        <Link href="/landRequest" onClick={() => onClose?.()}>매물 의뢰</Link>
      </li>
      <li className="border-b pb-2">
        <Link href="/notice" onClick={() => onClose?.()}>공지사항</Link>
      </li>
      <li className="border-b pb-2">
        <Link href="/intro" onClick={() => onClose?.()}>회사소개</Link>
      </li>
    </ul>
  )
}

export default OpenMenu
