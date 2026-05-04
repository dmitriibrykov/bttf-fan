"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import Poll from "./Poll";
import { useSession } from "next-auth/react";

type Props = {
  meParticipated: boolean;
  refetch(): Promise<void>;
};

export default function PollToggler({ meParticipated, refetch }: Props) {
  const [isPollOpened, setIsPollOpened] = useState(false);
  const { status } = useSession();

  const closePoll = () => setIsPollOpened(false);

  if ((status === "authenticated" && meParticipated) || status === "loading")
    return null;

  return (
    <div className="w-full flex md:flex-col justify-center items-center gap-4">
      {!meParticipated && (
        <Button
          className="w-[200px] h-[50px] rounded-md"
          onClick={() => setIsPollOpened(true)}
          disabled={status !== "authenticated"}
        >
          Participate in the Poll
        </Button>
      )}
      {status === "unauthenticated" && (
        <p className="text-xl font-bold">Log in to participate!</p>
      )}
      {isPollOpened &&
        createPortal(
          <Poll closePoll={closePoll} refetch={refetch} />,
          document.body,
        )}
    </div>
  );
}
