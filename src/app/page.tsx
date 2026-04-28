import { Movies, PollResults } from "./_components";

export default async function Home() {
  return (
    <div className="flex flex-col h-auto w-full gap-4">
      <PollResults />
      <Movies />
    </div>
  );
}
