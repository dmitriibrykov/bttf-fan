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
import UserAvatar from "../UserAvatar";

const avatarClass =
  "h-[50px] w-[50px] min-w-[50px] min-h-[50px] cursor-pointer";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          classes={avatarClass}
          imgSrc={session?.user?.image}
          name={session?.user?.name}
        />
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
  );
}
