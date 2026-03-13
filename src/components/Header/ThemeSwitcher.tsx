"use client";

import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function ThemeSwitcher() {
  const { setTheme, theme, resolvedTheme } = useTheme();

  return (
    <Select
      value={theme === "system" ? resolvedTheme : theme}
      onValueChange={(val) => setTheme(val)}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="light">Light</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
