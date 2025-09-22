// DetailDescription.tsx
"use client";
import { useFormContext } from 'react-hook-form';
import EditorComponent from '@/app/components/shared/EditorComponent';

const DetailDescription = () => {
  const { register } = useFormContext(); // useFormContext로 폼 상태 관리

  return (
    <div className="space-y-4">
      {/* 제목 */}
      <div className="flex flex-col">
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          placeholder="제목을 입력하세요"
          {...register('title', { required: true })}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 상세설명 (Editor) */}
      <div className="flex flex-col">
        <label htmlFor="detailDescription">상세설명</label>
        <EditorComponent name="editorContent" />
      </div>

      {/* 비밀메모 (관리자와 본인만 보이도록) */}
        <div className="flex flex-col">
          <label htmlFor="secretNote">비밀메모</label>
          <textarea
            id="secretNote"
            placeholder="관리자와 본인만 볼 수 있는 메모입니다."
            {...register('secretNote')}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      {/* 비밀 고객연락처 (관리자와 본인만 보이도록) */}
        <div className="flex flex-col">
          <label htmlFor="secretContact">비밀 고객연락처</label>
          <input
            type="text"
            id="secretContact"
            placeholder="관리자와 본인만 볼 수 있는 연락처입니다."
            {...register('secretContact')}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
    </div>
  );
};

export default DetailDescription;
