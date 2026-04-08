import React, { useState } from "react";
import { Menu as MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { navLinks } from "@/constants";
import Link from "next/link";
import TimelineLink from "./TimelineLink";

export default function Menu() {
  const [isSheetOpen, setIsOpenSheet] = useState(false);
  const pathname = usePathname();

  function handleToggleSheet() {
    setIsOpenSheet((isOpen) => !isOpen);
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleToggleSheet}>
      <SheetTrigger>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent
        className="flex flex-col items-start py-16 px-8 !w-[300px]"
        aria-describedby={undefined}
        side="left"
      >
        <SheetTitle />
        {navLinks.map(({ href, label, isTimeline }) => {
          const isActive = pathname === href;

          if (isTimeline)
            return (
              <TimelineLink
                key={label}
                isActive={isActive}
                href={href}
                label={label}
                handleToggleSheet={handleToggleSheet}
              />
            );

          return isActive ? (
            <span
              key={href}
              className="text-primary text-4xl border-b-1 border-primary"
            >
              {label}
            </span>
          ) : (
            <Link
              key={href}
              href={href}
              onClick={handleToggleSheet}
              className="text-2xl"
            >
              {label}
            </Link>
          );
        })}
      </SheetContent>
    </Sheet>
  );
}
