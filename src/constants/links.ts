export type NavLink = {
  href: string;
  label: string;
  isTimeline?: boolean;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Main" },
  { href: "/characters", label: "Characters" },
  { href: "/timeline", label: "Timeline", isTimeline: true },
];
