'use client';

import { useState } from 'react';
import Header from '../layout/admin/Header';
import AdminNav from '../components/admin/nav';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="relative z-10 flex">
        <Header isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      </div>
      <div className="relative flex -z-0">
        <div
          className={`fixed left-0 h-full bg-gray-800 z-20 transition-all duration-300 ${
            isMobileMenuOpen ? "w-64" : "w-0 sm:w-20"
          }`}
        >
          <AdminNav isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
        </div>
        <div
          className={`w-full pt-14 transition-all duration-300 ${
            isMobileMenuOpen ? "sm:ml-64" : "sm:ml-20"
          }`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
