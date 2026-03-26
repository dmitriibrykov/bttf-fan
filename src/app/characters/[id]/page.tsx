import { getCharacter } from "@/lib/api";
import { getAppearancePart } from "@/utils";
import { Comments } from "./_components";
import { Separator } from "@/components/ui/separator";
import { STATUS } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const res = await getCharacter(id);

  if (res.status === STATUS.FAILED) return { title: "Error occured" };

  return { title: res.character.name };
}

export default async function CharacterPage({ params }: Props) {
  const { id } = await params;
  const res = await getCharacter(id);

  if (res.status === STATUS.FAILED)
    return (
      <div className="flex justify-center items-center w-full h-auto">
        <h1>Error occured: {res.error}</h1>
      </div>
    );

  const character = res.character;

  return (
    <div className="flex flex-col items-center w-full mx-auto h-auto gap-4 pb-4 px-4 md:gap-8 md:pb-8 md:px-8 pt-4">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        <img
          src={character.imgSrc}
          alt={character.name}
          className="h-fit w-[300px]"
        />
        <div className="flex flex-col gap-4">
          <h2>{character.name}</h2>
          <Separator />
          <h2>Who played: {character.actor ?? ""}</h2>
          <Separator />
          <div className="flex flex-col">
            <p>Appeared in:</p>
            <div className="flex gap-2">
              {character.appearance.map((app) => (
                <div
                  className="rounded-full border-2 border-primary p-4 w-[40px] h-[40px] flex items-center justify-center"
                  key={app}
                >
                  <span>{getAppearancePart(app)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Comments characterId={id} />
    </div>
  );
}
