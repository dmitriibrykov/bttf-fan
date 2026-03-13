"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import UserMenu from "./UserMenu";

const ThemeSwitcher = dynamic(() => import("./ThemeSwitcher"), { ssr: false });

export function Header() {
  return (
    <header className="w-screen py-4 px-6 flex justify-between items-center border-b-2 border-transparent [border-image:linear-gradient(to_right,_#ff4500,_#ff8c00,_#ffd700,_#ff8c00,_#ff4500)_1]">
      <Image
        src={logo}
        alt="logo"
        width="0"
        height="0"
        sizes="100vw"
        className="h-[40px] w-fit md:h-[40px]"
        loading="eager"
      />
      <Link
        href="/"
        className="hidden md:inline text-2xl border-b-4 text-foreground border-foreground transition-colors hover:text-primary hover:border-primary"
      >
        Main
      </Link>
      <Link
        href="/characters"
        className="hidden md:inline text-2xl font-bold border-b-4 border-foreground transition-colors hover:text-primary hover:border-primary"
      >
        Characters
      </Link>
      <div className="flex gap-4 items-center">
        <ThemeSwitcher />
        <UserMenu />
      </div>
    </header>
  );
}
