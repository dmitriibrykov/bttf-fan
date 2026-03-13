"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";

const avatarClass = "h-[50px] w-[50px] rounded-[50%] cursor-pointer";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="avatar"
              className={avatarClass}
            />
          ) : (
            <div className={avatarClass} />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 rounded-md p-2">
          {status === "authenticated" ? (
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => router.push("/profile")}
                className="cursor-pointer"
              >
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => signOut()}
                className="text-red-500 cursor-pointer"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuItem>
              <Link href="/api/auth/signin">Sign in / Sign up</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
