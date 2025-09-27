"use client";

import React, { ComponentType, useState } from "react";
import { useRouter } from "next/navigation";
import ListingsMenu from "./ListingsMenu";
import InquiriesMenu from "./InquiriesMenu";
import BoardMenu from "./BoardMenu";
import WebsiteSettingsMenu from "./WebsiteSettingsMenu";
import WebViewMenu from "./WebViewMenu";
import OtherMenu from "./OtherMenu";
import { clsx } from "clsx";

// 메뉴 데이터
const listingsData = [
  { title: "매물 목록", url: "listings" },
  { title: "삭제된 매물", url: "deleted-listings" },
  { title: "매물 종류관리", url: "listing-types" },
  { title: "테마 관리", url: "theme-settings" },
  { title: "옵션 관리", url: "options-settings" },
  { title: "라벨 관리", url: "labels" },
  { title: "거래유형 관리", url: "buy-types" },
  { title: "단지 관리", url: "complex-settings" },
  { title: "단지 추가", url: "complex-add" },
  { title: "카테고리 관리", url: "category-settings" },
];

const inquiriesData = [
  { title: "의뢰 내역", url: "orders" },
  { title: "연락 요청", url: "contact-requests" },
  { title: "직접전화 내역", url: "call-records" },
  { title: "매물찾기 요청목록", url: "property-search-requests" },
];

const boardData = [
  { title: "게시판 카테고리 관리", url: "categories" },
  { title: "관리자 게시판", url: "admin-board" },
];

const websiteSettingsData = [
  { title: "홈페이지 정보", url: "website-info" },
  { title: "SNS 설정", url: "sns-settings" },
  { title: "디자인 설정", url: "design-settings" },
  { title: "고급 설정", url: "advanced-settings" },
];

const webViewData = [
  { title: "배너 설정", url: "banner" },
  { title: "새 페이지만들기", url: "custom" },
  { title: "레이아웃 설정", url: "layout" },
  { title: "지도 설정", url: "map" },
  { title: "아웃링크 설정", url: "link" },
  { title: "상단메뉴 설정", url: "upper" },
];

const otherData = [
  { title: "키워드 URL 추출", url: "keyword-url-extraction" },
  { title: "접속 기록", url: "access-logs" },
];

// 메뉴 설정
const totalMenu = [
  { menu: "listings", title: "매물관리", data: listingsData, component: ListingsMenu },
  { menu: "inquiries", title: "문의관리", data: inquiriesData, component: InquiriesMenu },
  { menu: "board", title: "게시판 관리", data: boardData, component: BoardMenu },
  { menu: "websiteSettings", title: "홈페이지 설정", data: websiteSettingsData, component: WebsiteSettingsMenu },
  { menu: "webView", title: "홈페이지 화면 설정", data: webViewData, component: WebViewMenu },
  { menu: "other", title: "기타", data: otherData, component: OtherMenu },
];

const AdminNav = () => {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));

    const menuData = totalMenu.find((item) => item.menu === menu);
    if (menuData) {
      menuData.data.forEach(({ url }) => {
        router.prefetch(`/admin/${menu}/${url}`);
      });
    }
  };

  // MenuItem 컴포넌트: 각 메뉴 항목을 렌더링
  const MenuItem = ({
    menu,
    title,
    data,
    Component,
  }: {
    menu: string;
    title: string;
    data: { title: string; url: string }[];
    Component: ComponentType<{ data: { title: string; url: string }[] }>;
  }) => (
    <li>
      <button
        onClick={() => toggleMenu(menu)}
        className="w-full text-left hover:bg-gray-700 p-2 rounded-md flex justify-between items-center"
      >
        {title}
        <span
          className={clsx("ml-2 transform transition-transform duration-700", {
            "rotate-180": openMenu === menu,
          })}
        >
          ▼
        </span>
      </button>
      <div
        className={clsx("transition-all duration-500", {
          "opacity-100 scale-100": openMenu === menu,
          "opacity-0 scale-95": openMenu !== menu,
        })}
      >
        {openMenu === menu && <Component data={data} />}
      </div>
    </li>
  );

  return (
    <nav className="fixed top-14 left-0 w-64 h-full bg-gray-700 text-white p-4 z-20">
      <ul className="space-y-4">
        {totalMenu.map(({ menu, title, data, component }) => (
          <MenuItem key={menu} menu={menu} title={title} data={data} Component={component} />
        ))}
        {/* 고객관리 메뉴 */}
        <li>
          <button
            onClick={() => handleNavigation("/admin/customers")}
            className="w-full text-left hover:bg-gray-700 p-2 rounded-md"
          >
            고객관리
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;
