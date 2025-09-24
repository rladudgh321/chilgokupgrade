// app/components/admin/listings/Editor.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface EditorProps {
  name: string; // RHF 필드명: 예) "editorContent"
  disabled?: boolean;
}

const Editor: React.FC<EditorProps> = ({ name, disabled }) => {
  const { setValue, register } = useFormContext();
  const valueFromForm = useWatch({ name }) as string | undefined; // ✅ 폼 값 구독
  const [html, setHtml] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);

  // 폼 값이 바뀌면(예: reset으로 서버값 주입) 에디터에 반영
  useEffect(() => {
    const incoming = valueFromForm ?? "";
    setHtml(incoming);
    if (editorRef.current && editorRef.current.innerHTML !== incoming) {
      editorRef.current.innerHTML = incoming;
    }
  }, [valueFromForm]);

  const handleEditorChange = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML;
    setHtml(content);
    setValue(name, content, { shouldDirty: true }); // ✅ 폼 값 업데이트
  };

  const applyStyle = (style: string) => {
    if (disabled) return;
    document.execCommand(style);
    handleEditorChange();
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    if (!editorRef.current) return;
    const scrollTop = editorRef.current.scrollTop;
    e.preventDefault();
    editorRef.current.focus();
    editorRef.current.scrollTop = scrollTop;
  };

  return (
    <div className="w-full mx-auto p-4">
      {/* hidden input으로 RHF에 필드 등록 (초기 제출 안전장치) */}
      <input type="hidden" {...register(name)} value={html} readOnly />

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

      {/* Toolbar */}
      <div className="flex space-x-4 bg-gray-100 p-3 rounded-lg shadow-md mb-4">
        <button className="p-2 text-xl text-gray-700 hover:bg-gray-200 rounded" onClick={(e) => { e.preventDefault(); applyStyle("bold"); }} disabled={disabled}>
          <strong>B</strong>
        </button>
        <button className="p-2 text-xl text-gray-700 hover:bg-gray-200 rounded" onClick={(e) => { e.preventDefault(); applyStyle("italic"); }} disabled={disabled}>
          <em>I</em>
        </button>
        <button className="p-2 text-xl text-gray-700 hover:bg-gray-200 rounded" onClick={(e) => { e.preventDefault(); applyStyle("underline"); }} disabled={disabled}>
          <u>U</u>
        </button>
        <button className="p-2 text-xl text-gray-700 hover:bg-gray-200 rounded" onClick={(e) => { e.preventDefault(); applyStyle("strikeThrough"); }} disabled={disabled}>
          <span className="line-through">S</span>
        </button>
        <button className="p-2 text-xl text-gray-700 hover:bg-gray-200 rounded" onClick={(e) => { e.preventDefault(); applyStyle("justifyLeft"); }} disabled={disabled}>←</button>
        <button className="p-2 text-xl text-gray-700 hover:bg-gray-200 rounded" onClick={(e) => { e.preventDefault(); applyStyle("justifyCenter"); }} disabled={disabled}>⇔</button>
        <button className="p-2 text-xl text-gray-700 hover:bg-gray-200 rounded" onClick={(e) => { e.preventDefault(); applyStyle("justifyRight"); }} disabled={disabled}>→</button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleEditorChange}
        onClick={handleEditorClick}
        className="min-h-[300px] p-4 border border-gray-300 rounded-lg shadow-md text-gray-900 text-lg leading-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent whitespace-pre-wrap break-words bg-white"
      />

      {/* (옵션) 미리보기 */}
      {/* <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold mb-2">Editor Output:</h3>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div> */}
    </div>
  );
};

export default Editor;
