import Link from "next/link";
import { type Character } from "@/models/Character";
import { getAppearancePart } from "@/utils";

type Props = {
  character: Character;
};

export function CharacterCard({ character }: Props) {
  return (
    <Link href={`/characters/${character._id}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        <img
          src={character.imgSrc}
          alt={character.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col">
          <span className="text-white font-bold text-lg">{character.name}</span>
          <div className="flex flex-col">
            <p className="text-white">Appeared in:</p>
            <div className="flex gap-2">
              {character.appearance.map((app) => (
                <div
                  className="rounded-full border-2 border-primary p-4 w-[40px] h-[40px] flex items-center justify-center"
                  key={app}
                >
                  <span className="text-white">{getAppearancePart(app)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
