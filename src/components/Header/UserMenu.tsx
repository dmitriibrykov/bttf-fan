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
import { useMediaQuery } from "@/hooks";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";

const avatarClass =
  "h-[50px] w-[50px] min-w-[50px] min-h-[50px] cursor-pointer";

export default function UserMenu() {
  const isTablet = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <>
      {!isTablet && (
        <Sheet>
          <SheetTrigger asChild>
            <UserAvatar
              classes={avatarClass}
              imgSrc={session?.user?.image}
              name={session?.user?.name}
            />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-center py-16">
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
            <Link href="/profile">Profile Settings</Link>
            <Separator />
            <Link href="/">Main</Link>
            <Link href="/characters">Characters</Link>
            <Separator />
            <Button
              onClick={() => signOut()}
              variant="destructive"
              className="w-[80%]"
            >
              Sign out
            </Button>
          </SheetContent>
        </Sheet>
      )}
      {isTablet && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
      )}
    </>
  );
}
