import Image from "next/image";
import logo from "@/assets/logo.png";
import UserMenu from "./UserMenu";
import Link from "next/link";

export default async function Header() {
  return (
    <header className="w-screen py-4 px-6 flex justify-between items-center border-b-2 border-transparent [border-image:linear-gradient(to_right,_#ff4500,_#ff8c00,_#ffd700,_#ff8c00,_#ff4500)_1]">
      <Image
        src={logo}
        alt="logo"
        width="0"
        height="0"
        sizes="100vw"
        className="h-[80px] w-fit"
        loading="eager"
      />
      <Link
        href="/"
        className="border-b-4 transition-colors hover:text-primary hover:border-primary"
      >
        <h2>Main</h2>
      </Link>
      <Link
        href="/characters"
        className="border-b-4 transition-colors hover:text-primary hover:border-primary"
      >
        <h2>Characters</h2>
      </Link>
      <UserMenu />
    </header>
  );
}
