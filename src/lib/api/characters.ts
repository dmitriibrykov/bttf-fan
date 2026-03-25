import { Character } from "@/models/Character";
import { ResponseFailed, ResponseSuccessfulBase } from "@/types";

export const getCharacters = async (
  search: string,
): Promise<
  ResponseFailed | (ResponseSuccessfulBase & { characters: Character[] })
> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/characters?search=${search}`,
  );
  const data = await res.json();

  return data;
};

export const getCharacter = async (
  id: string,
): Promise<
  ResponseFailed | (ResponseSuccessfulBase & { character: Character })
> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/characters/${id}`,
  );

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error, status: data.status };
  }

  return {
    status: data.status,
    character: data.character,
  };
};
