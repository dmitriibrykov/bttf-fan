import { Spinner } from "@/components/ui/spinner";

export default function CharactersLoading() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <Spinner className="size-24 text-primary!" />
    </div>
  );
}
