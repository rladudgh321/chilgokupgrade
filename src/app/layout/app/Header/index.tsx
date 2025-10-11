import Image from "next/image";
import Header_Button from "./Header_Button";
import OpenMenu from "./OpenMenu";
import Link from "next/link";
import NavMenu from "./NavMenu";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black">
      <div className="mx-auto max-w-7xl h-14 px-4 flex items-center justify-between">
        <Link href="/" className="relative h-8 w-28 md:h-9 md:w-32" aria-label="홈으로">
          <Image
            alt="logo"
            src="/img/logo.png"
            fill
            priority
            sizes="(max-width: 768px) 112px, 128px"
            className="object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <NavMenu />

        {/* Mobile button */}
        <div className="md:hidden">
          <Header_Button>
            <OpenMenu />
          </Header_Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
