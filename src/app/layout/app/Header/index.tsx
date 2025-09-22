import Image from 'next/image'
import Header_Button from './Header_Button'
import OpenMenu from './OpenMenu'

const Header = () => {
  return (
    <header className="flex items-center justify-between h-14 min-h-[50px] px-4 border-b border-gray-300">
      <div className="relative h-10 w-24">
        <Image alt="logo" src="/img/logo.png" layout="fill" objectFit="contain" priority={true} />
      </div>
      <Header_Button>
        <OpenMenu />
      </Header_Button>
    </header>
  )
}

export default Header