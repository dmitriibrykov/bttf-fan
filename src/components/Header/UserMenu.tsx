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
import { usePathname, useRouter } from "next/navigation";
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
import React, { useState } from "react";
import { mobileDialogLinks } from "@/constants";

const avatarClass =
  "h-[50px] w-[50px] min-w-[50px] min-h-[50px] cursor-pointer";

export default function UserMenu() {
  const isTablet = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleToggleSheet = () => {
    setIsSheetOpen((val) => !val);
  };

  return (
    <>
      {!isTablet && (
        <Sheet open={isSheetOpen} onOpenChange={handleToggleSheet}>
          <SheetTrigger>
            <UserAvatar
              classes={avatarClass}
              imgSrc={session?.user?.image}
              name={session?.user?.name}
            />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-center py-16">
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
            {mobileDialogLinks.map(({ href, label, separator }) => {
              const isActive = pathname === href;

              return (
                <React.Fragment key={href}>
                  {isActive ? (
                    <span className="text-primary border-b-1 border-primary">
                      {label}
                    </span>
                  ) : (
                    <Link href={href} onClick={handleToggleSheet}>
                      {label}
                    </Link>
                  )}
                  {separator && <Separator />}
                </React.Fragment>
              );
            })}
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
