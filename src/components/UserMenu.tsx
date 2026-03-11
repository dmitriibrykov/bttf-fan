"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function UserMenu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleModalOpen = () => setIsModalOpen((prev) => !prev);

  return (
    <>
      <div className="relative" ref={menuRef}>
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt="avatar"
            className="h-[50px] w-[50px] rounded-[50%]"
            onClick={handleModalOpen}
          />
        ) : (
          <div
            className="w-[50px] h-[50px] rounded-[50%]"
            onClick={handleModalOpen}
          />
        )}
        {isModalOpen && (
          <div className="absolute right-0 top-full mt-2 bg-[#eb7010] rounded-md p-2">
            {status === "authenticated" ? (
              <>
                <button onClick={() => signOut()}>Sign out</button>
              </>
            ) : (
              <Link href="/api/auth/signin">Sign in / Sign up</Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
