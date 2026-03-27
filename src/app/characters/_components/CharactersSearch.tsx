"use client";

import { ChangeEvent, useCallback } from "react";
import { Search } from "lucide-react";
import { debounce } from "lodash-es";
import { useRouter, useSearchParams } from "next/navigation";

export function CharactersSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearchChange = useCallback(
    debounce((event: ChangeEvent<HTMLInputElement>) => {
      const val = event.target.value;
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set("search", val);
      } else {
        params.delete("search");
      }

      router.push(`/characters?${params.toString()}`);
    }, 500),
    [],
  );

  return (
    <div className="relative w-fit mx-auto flex items-center justify-center">
      <input
        id="search"
        type="text"
        placeholder="Enter character's name"
        className="pl-4 pr-10 py-2 min-w-[400px] h-[50px] border-1 border-ring rounded-md"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={onSearchChange}
      />
      <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-4" />
    </div>
  );
}
