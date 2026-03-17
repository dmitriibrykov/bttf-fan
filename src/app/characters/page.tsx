import { getCharacters } from "@/lib/api";
import { CharacterCard, CharactersSearch } from "./_components";

export default async function CharactersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const characters = await getCharacters(search ?? "");

  return (
    <div className="pb-16 w-full flex flex-col gap-8">
      <CharactersSearch />
      {characters.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {characters.map((character) => (
            <CharacterCard key={character._id} character={character} />
          ))}
        </div>
      )}
      {characters.length === 0 && (
        <h2 className="text-center">No characters found!</h2>
      )}
    </div>
  );
}
