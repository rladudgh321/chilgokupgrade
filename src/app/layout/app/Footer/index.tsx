import React from "react";
import Image from "next/image"; // Next.js의 최적화된 이미지 로딩

const Footer = () => {
  return (
    <footer className="mt-4 bg-gray-700 text-white text-sm p-4">
      <div className="flex items-center gap-6">
        {/* 로고 이미지 */}
        <div>
          <Image src="/img/logo.png" alt="다부부동산 로고" width={100} height={50} />
        </div>

        {/* 회사 정보 */}
        <aside>
          <p>회사명: 다부부동산</p>
          <p>주소: 경북 칠곡 다부다부</p>
          <p>
            대표자: 권오길 &nbsp;&nbsp;&nbsp;&nbsp; 사업자번호: 123-45-67890
          </p>
          <p>전화: 070-1234-5678</p>
          <p>휴대폰: 010-1234-5678</p>
          <p>이메일: 다부@naver.com</p>
          <p className="mt-2">Dabu Company, Inc. All rights reserved.</p>
        </aside>
      </div>
    </footer>
  );
};

export default Footer;
