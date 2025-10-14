'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  logoUrl: string;
}

const Header = ({ isOpen, setIsOpen, logoUrl }: HeaderProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch('/api/admin/logout', {
      method: 'POST',
    });

    if (response.ok) {
      router.push('/admin/login');
      router.refresh();
    } else {
      console.error('Logout failed');
      // Optionally, show an error message to the user
    }
  };

  return (
    <header className="fixed grow top-0 left-0 right-0 flex items-center h-14 px-4 bg-gray-800 text-white z-10">
      <button 
        className="p-2" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
      <div className="flex-1 text-center">
        <div className="relative inline-block h-10 w-24">
          <Image alt="logo" src={logoUrl} layout="fill" objectFit="contain" priority={true} />
        </div>
      </div>
      <button onClick={handleLogout} className="px-4 py-2 hover:bg-gray-700 rounded">
        로그아웃
      </button>
    </header>
  );
}

export default Header;
