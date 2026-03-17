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

export const getComments = async (characterId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/comments?characterId=${characterId}`,
  );

  const { comments } = await res.json();

  return comments;
};

export const sendComment = async (characterId: string, comment: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
      method: "PUT",
      body: JSON.stringify({
        characterId,
        body: comment,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();

    return data;
  } catch {
    return null;
  }
};
