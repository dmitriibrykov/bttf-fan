import Image from "next/image";
import { getCharacters } from "@/lib/api";
import CharactersSearch from "./_components/CharactersSearch";
import Link from "next/link";

export default async function CharactersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const characters = await getCharacters(search ?? "");

  return (
    <div>
      <CharactersSearch />
      {characters.map((character) => (
        <Link key={character._id} href={`/characters/${character._id}`}>
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
        </Link>
      ))}
    </div>
  );
}
