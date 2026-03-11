"use client";

import { ChangeEvent, useCallback } from "react";
import { debounce } from "lodash-es";
import { useRouter, useSearchParams } from "next/navigation";

export default function CharactersSearch() {
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
    <div className="w-full flex flex-col">
      <input
        type="text"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={onSearchChange}
      />
    </div>
  );
}
