`/admin/board/admin-board/edit/[id]` 페이지에서 editor의 내용들이 불러와지고 있지 않고 있어. 불러와지게 수정해줘
-------
여전히 에디터에는 데이터가 불러와지고 있지 않아

여기에는 어떤 오류도 없어. 하지만, BoardPost 테이블의 content컬럼과 popupContent 컬럼이 edit페이지에서는 불러와지길 바래
--------
'use client';

import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video']
            ],
            handlers: {
              image: () => {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*, image/webp');
                input.click();

                input.onchange = async () => {
                  if (input.files) {
                    const file = input.files[0];
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('prefix', 'editor');

                    try {
                      const res = await fetch('/api/image/upload', {
                        method: 'POST',
                        body: formData,
                      });

                      if (res.ok) {
                        const { url } = await res.json();
                        const range = quill.getSelection();
                        if (range) {
                          quill.insertEmbed(range.index, 'image', url);
                        }
                      } else {
                        console.error('Image upload failed');
                      }
                    } catch (error) {
                      console.error('Error uploading image:', error);
                    }
                  }
                };
              }
            }
          }
        }
      });
      quillRef.current = quill;

      quill.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') {
          onChange(quill.root.innerHTML);
        }
      });
    }
  }, [onChange]);

  useEffect(() => {
    if (quillRef.current) {
      const delta = quillRef.current.clipboard.convert(value);
      quillRef.current.setContents(delta, 'silent');
    }
  }, [value]);

  return <div ref={editorRef} style={{ height: '400px' }} />;
};

export default Editor;

-------------
Editor컴포넌트에 게시판 글수정을 하기 위해 수정을 눌렀을 때 `/admin/board/admin-board/edit/4` 페이지에서 기존 데이터를 불러와줘

-----------------
오류는 없어졌는데 AdminBoardForm initialData: {id: 4, title: 'test 제목', content: '<h1 class="ql-align-center">테스트 제목</h1><p class="q…><p class="ql-align-center"><br></p><p>test이요</p>', popupContent: '<h1 class="ql-align-center">test팝업</h1><p class="q…class="ql-align-center"><br></p><p>test팝업내용이요</p>', representativeImage: 'https://pijtsbicrnsbdaewosgt.supabase.co/storage/v…ild-public/board/1760068237347_90kwrlylgus_3.webp', …}
--------
이렇게 콘솔도 잘나오는데 왜 데이터가 반영이 안될까

-------------
Editor useEffect triggered. Quill ref: Quill {options: {…}, container: div.ql-container.ql-snow, root: div.ql-editor.ql-blank, emitter: Emitter, scroll: Scroll, …} Value: <h1 class="ql-align-center">테스트 제목</h1><p class="ql-align-center"><br></p><p class="ql-align-center"><img src="https://pijtsbicrnsbdaewosgt.supabase.co/storage/v1/object/public/build-public/editor/1760068042672_a9anqf4x2gl_4.webp"></p><p class="ql-align-center"><br></p><p>test이요</p>
Editor.tsx:89 Converted delta: Delta {ops: Array(0)}
Editor.tsx:86 Editor useEffect triggered. Quill ref: Quill {options: {…}, container: div.ql-container.ql-snow, root: div.ql-editor.ql-blank, emitter: Emitter, scroll: Scroll, …} Value: <h1 class="ql-align-center">test팝업</h1><p class="ql-align-center"><br></p><p class="ql-align-center"><img src="https://pijtsbicrnsbdaewosgt.supabase.co/storage/v1/object/public/build-public/editor/1760068196589_qwkj17u4t4p_2.webp"></p><p class="ql-align-center"><br></p><p>test팝업내용이요</p>
Editor.tsx:89 Converted delta: Delta {ops: Array(0)}
Editor.tsx:86 Editor useEffect triggered. Quill ref: Quill {options: {…}, container: div.ql-container.ql-snow, root: div.ql-editor.ql-blank, emitter: Emitter, scroll: Scroll, …} Value: <h1 class="ql-align-center">테스트 제목</h1><p class="ql-align-center"><br></p><p class="ql-align-center"><img src="https://pijtsbicrnsbdaewosgt.supabase.co/storage/v1/object/public/build-public/editor/1760068042672_a9anqf4x2gl_4.webp"></p><p class="ql-align-center"><br></p><p>test이요</p>
Editor.tsx:89 Converted delta: Delta {ops: Array(0)}ops: [][[Prototype]]: Object
Editor.tsx:86 Editor useEffect triggered. Quill ref: Quill {options: {…}, container: div.ql-container.ql-snow, root: div.ql-editor.ql-blank, emitter: Emitter, scroll: Scroll, …} Value: <h1 class="ql-align-center">test팝업</h1><p class="ql-align-center"><br></p><p class="ql-align-center"><img src="https://pijtsbicrnsbdaewosgt.supabase.co/storage/v1/object/public/build-public/editor/1760068196589_qwkj17u4t4p_2.webp"></p><p class="ql-align-center"><br></p><p>test팝업내용이요</p>
Editor.tsx:89 Converted delta: Delta {ops: Array(0)}
-------------
콘솔에는 content와 popupcontent가 잘 찍히는데 왜 UI는 안찍힐까
------

Unhandled Runtime Error


Error: Switched to client rendering because the server rendering errored:

Module [project]/src/app/(admin)/admin/board/admin-board/edit/[id]/client.tsx [app-ssr] (ecmascript) was instantiated because it was required from module [project]/node_modules/next/dist/esm/build/templates/app-page.js?page=/(admin)/admin/board/admin-board/edit/[id]/page { METADATA_0 => "[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)", MODULE_1 => "[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)", MODULE_2 => "[project]/node_modules/next/dist/client/components/not-found-error.js [app-rsc] (ecmascript, Next.js server component)", MODULE_3 => "[project]/node_modules/next/dist/client/components/forbidden-error.js [app-rsc] (ecmascript, Next.js server component)", MODULE_4 => "[project]/node_modules/next/dist/client/components/unauthorized-error.js [app-rsc] (ecmascript, Next.js server component)", MODULE_5 => "[project]/src/app/(admin)/layout.tsx [app-rsc] (ecmascript, Next.js server component)", MODULE_6 => "[project]/src/app/(admin)/loading.tsx [app-rsc] (ecmascript, Next.js server component)", MODULE_7 => "[project]/node_modules/next/dist/client/components/not-found-error.js [app-rsc] (ecmascript, Next.js server component)", MODULE_8 => "[project]/node_modules/next/dist/client/components/forbidden-error.js [app-rsc] (ecmascript, Next.js server component)", MODULE_9 => "[project]/node_modules/next/dist/client/components/unauthorized-error.js [app-rsc] (ecmascript, Next.js server component)", MODULE_10 => "[project]/src/app/(admin)/admin/board/admin-board/edit/[id]/page.tsx [app-rsc] (ecmascript, Next.js server component)" } [app-rsc] (ecmascript) <locals>, but the module factory is not available. It might have been deleted in an HMR update.

Call Stack
15

Show 12 ignore-listed frame(s)
instantiateModule
file:///C:/proj/chilgok/front/.next/server/chunks/ssr/[turbopack]_runtime.js (563:15)
getOrInstantiateModuleFromParent
file:///C:/proj/chilgok/front/.next/server/chunks/ssr/[turbopack]_runtime.js (652:12)
commonJsRequire
file:///C:/proj/chilgok/front/.next/server/chunks/ssr/[turbopack]_runtime.js (147:20)
