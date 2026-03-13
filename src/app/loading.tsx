import { Spinner } from "@/components/ui/spinner";

export default function CharactersLoading() {
  return (
    <div className="w-full flex flex-1 justify-center items-center">
      <Spinner className="size-24 text-primary!" />
    </div>
  );
}
