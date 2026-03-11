import { getCharacter } from "@/lib/api";
import Image from "next/image";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) {
    return (
      <div>
        <span>No character with such id found</span>
      </div>
    );
  }

  return (
    <div>
      <h2>{character.name}</h2>
      <Image
        src={character.imgSrc}
        alt={character.name}
        width="0"
        height="0"
        className="h-auto w-[300px]"
        sizes="100vw"
        loading="eager"
      />
    </div>
  );
}
