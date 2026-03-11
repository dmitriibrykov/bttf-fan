import { Character } from "@/models/Character";

export const getCharacters = async (search: string): Promise<Character[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/characters?search=${search}`,
  );
  const { characters } = await res.json();
  return characters;
};

export const getCharacter = async (id: string): Promise<Character | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/characters/${id}`,
    );

    if (!res.ok) return null;

    const data = await res.json();

    return "character" in data ? data.character : null;
  } catch {
    return null;
  }
};
