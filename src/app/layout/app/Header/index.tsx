import Image from "next/image";
import Header_Button from "./Header_Button";
import OpenMenu from "./OpenMenu";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between h-14 min-h-[50px] px-4 border-b border-gray-300">
      <Link href="/" className="relative h-10 w-24">
        {/* Next/Image 최신 props 사용: fill + object-contain */}
        <Image
          alt="logo"
          src="/img/logo.png"
          fill
          priority
          sizes="96px"
          className="object-contain"
        />
      </Link>

      {/* Header_Button 이 children 을 clone 해서 onClose 를 주입합니다 */}
      <Header_Button>
        <OpenMenu />
      </Header_Button>
    </header>
  );
};

export default Header;
