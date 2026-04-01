import React, { useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { navLinks } from "@/constants";
import Link from "next/link";

export default function MobileMenu() {
  const [isSheetOpen, setIsOpenSheet] = useState(false);
  const pathname = usePathname();

  function handleToggleSheet() {
    setIsOpenSheet((isOpen) => !isOpen);
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleToggleSheet}>
      <SheetTrigger className="md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent
        className="flex flex-col items-center py-16"
        aria-describedby={undefined}
        side="left"
      >
        <SheetTitle />
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href;

          return isActive ? (
            <span key={href} className="text-primary border-b-1 border-primary">
              {label}
            </span>
          ) : (
            <Link key={href} href={href} onClick={handleToggleSheet}>
              {label}
            </Link>
          );
        })}
      </SheetContent>
    </Sheet>
  );
}
