// utils/print.ts
type PrintOptions = {
  title?: string;
  css?: string;     // 추가 스타일(선택)
  bodyHtml: string; // <body> 안에 들어갈 마크업
};

const BASE_CSS = `
  @page { size: A4 portrait; margin: 12mm; }
  html, body { height: auto; }
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, pretendard, sans-serif; color:#111; }
  .print-root { max-width: 700px; margin: 0 auto; }
  .h1 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
  .muted { color:#6b7280; font-size:12px; }
  .row { display:flex; justify-content:space-between; gap:12px; }
  .card { border:1px solid #e5e7eb; border-radius:8px; padding:12px; margin:8px 0; }
  img { max-width:100%; height:auto; display:block; }
`;

export function openPrintSafe({ title, css, bodyHtml }: PrintOptions) {
  // 1) 새 탭 열기 (noreferrer 제거)
  let win = window.open("", "_blank", "noopener");
  if (!win) {
    // 팝업이 막혔을 때 폴백: Blob URL로 열기
    const full = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${title ?? "Print"}</title>
<style>${BASE_CSS}${css ?? ""}</style>
</head>
<body><div class="print-root">${bodyHtml}</div></body>
</html>`;
    const blob = new Blob([full], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    win = window.open(url, "_blank", "noopener");
    if (!win) alert("팝업이 차단되었습니다. 이 사이트의 팝업을 허용해주세요.");
    return;
  }

  // 2) DOM API로 구성 (document.write 사용 안 함)
  const doc = win.document;
  doc.title = title ?? "Print";

  const style = doc.createElement("style");
  style.appendChild(doc.createTextNode(BASE_CSS + (css ?? "")));
  doc.head.appendChild(style);

  const root = doc.createElement("div");
  root.className = "print-root";
  root.innerHTML = bodyHtml;
  doc.body.appendChild(root);

  // 이미지가 있으면 모두 로드된 뒤 인쇄
  const imgs = Array.from(doc.images);
  const waitImgs = Promise.all(
    imgs.map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((res) => {
              img.onload = () => res();
              img.onerror = () => res();
            })
    )
  );

  waitImgs.then(() => {
    try {
      win.focus();
      win.print();
    } catch {
      /* 일부 환경은 자동 print가 막혀도 내용은 보입니다. */
    }
  });
}
