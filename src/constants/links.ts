export type HeaderLink = {
  href: string;
  label: string;
};

export const headerLinks: HeaderLink[] = [
  { href: "/", label: "Main" },
  { href: "/characters", label: "Characters" },
];

export type MobileDialogLink = {
  href: string;
  label: string;
  separator: boolean;
};

export const mobileDialogLinks: MobileDialogLink[] = [
  { href: "/profile", label: "Profile Settings", separator: true },
  { href: "/", label: "Main", separator: false },
  { href: "/characters", label: "Characters", separator: true },
];
