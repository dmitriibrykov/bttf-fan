export type NavLink = {
  href: string;
  label: string;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Main" },
  { href: "/characters", label: "Characters" },
  { href: "/timeline", label: "Timeline" },
];
