import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 로고 및 회사명 */}
          <div className="flex flex-col items-start">
            <Image 
              src="/img/logo.png" 
              alt="다부부동산 로고" 
              width={120} 
              height={60} 
              className="filter brightness-0 invert"
            />
            <p className="mt-4 text-lg font-bold text-white">다부부동산</p>
          </div>

          {/* 상세 정보 */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Contact</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <span className="font-semibold w-16 inline-block">전화:</span>
                  <span>070-1234-5678</span>
                </li>
                <li>
                  <span className="font-semibold w-16 inline-block">휴대폰:</span>
                  <span>010-1234-5678</span>
                </li>
                <li>
                  <span className="font-semibold w-16 inline-block">이메일:</span>
                  <a href="mailto:다부@naver.com" className="hover:text-white transition-colors">
                    다부@naver.com
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Information</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <span className="font-semibold w-24 inline-block">대표자:</span>
                  <span>권오길</span>
                </li>
                <li>
                  <span className="font-semibold w-24 inline-block">사업자번호:</span>
                  <span>123-45-67890</span>
                </li>
                <li>
                  <span className="font-semibold w-24 inline-block">주소:</span>
                  <span>경북 칠곡 다부다부</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} Dabu Company, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
