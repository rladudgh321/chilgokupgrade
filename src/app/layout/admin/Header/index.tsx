import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed grow top-0 left-0 right-0 flex items-center justify-between h-14 px-4 bg-gray-800 text-white z-10">
      <div className="relative h-10 w-24">
        <Image alt="logo" src="/img/logo.png" layout="fill" objectFit="contain" priority={true} />
      </div>
      <Link href="/">로그아웃</Link>
    </header>
  );
}

export default Header;
