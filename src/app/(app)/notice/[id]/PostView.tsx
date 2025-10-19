'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

export type BoardPost = {
  id: number;
  title: string;
  content?: string;
  views: number;
  createdAt: string;          // ISO
  registrationDate?: string;  // ISO
};

const dateFmt = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });

export default function PostView({ post }: { post: BoardPost }) {
  // 1) 뷰 증가 여부만 상태로 두고(불변), 숫자 자체는 파생 계산 → setState로 +1 안 함
  const viewedKey = `viewed_post_${post.id}`;
  const [hasViewed, setHasViewed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(viewedKey) === 'true';
  });

  // 2) 최초 진입 시에만 비동기 전송(비용↓). sendBeacon 우선, 아니면 idle 시 fetch keepalive.
  useEffect(() => {
    if (hasViewed) return;

    try {
      sessionStorage.setItem(viewedKey, 'true');
      setHasViewed(true);

      const url = `/api/views/${post.id}`;
      const payload = JSON.stringify({ id: post.id });

      if (navigator.sendBeacon) {
        // DOMString을 직접 넘겨도 됩니다: Blob 생성 비용 제거
        navigator.sendBeacon(url, payload);
      } else {
        const idle = (cb: () => void) =>
          (typeof window !== 'undefined' && 'requestIdleCallback' in window)
            ? (window as any).requestIdleCallback(cb)
            : setTimeout(cb, 0);

        idle(() => {
          fetch(url, {
            method: 'POST',
            body: payload,
            keepalive: true,
            headers: { 'Content-Type': 'application/json' },
          }).catch(() => {});
        });
      }
    } catch {
      // no-op: 조회수 실패는 UX에 영향 없음
    }
    // 의도적으로 deps를 post.id만: viewedKey는 post.id에서 파생
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id, hasViewed]);

  // 3) 표시용 뷰 카운트는 파생값(리렌더 1회 절약 가능)
  const viewsToShow = useMemo(
    () => post.views + (hasViewed ? 1 : 0),
    [post.views, hasViewed]
  );

  // 4) 날짜 포매팅도 메모
  const displayDate = useMemo(() => {
    const iso = post.registrationDate || post.createdAt;
    return dateFmt.format(new Date(iso));
  }, [post.registrationDate, post.createdAt]);

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm text-gray-600 mb-6">
            <span>등록일: {displayDate}</span>
            <span suppressHydrationWarning>조회수: {viewsToShow}</span>
          </div>

          <div
            className="prose max-w-none"
            // 성능·보안: 가능한 경우 서버에서 sanitize하고 내려오길 권장
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>

        <div className="p-4 bg-gray-50 text-right">
          <Link href="/notice" className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
