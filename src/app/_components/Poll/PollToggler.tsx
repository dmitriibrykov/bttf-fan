"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import Poll from "./Poll";

type Props = {
  meParticipated: boolean;
};

export default function PollToggler({ meParticipated }: Props) {
  const [isPollOpened, setIsPollOpened] = useState(false);

  const closePoll = () => setIsPollOpened(false);

  console.log(isPollOpened);

  return (
    <div>
      {!meParticipated && (
        <Button
          className="w-[200px] h-[50px] rounded-md"
          onClick={() => setIsPollOpened(true)}
        >
          Participate in the Poll
        </Button>
      )}
      {isPollOpened &&
        createPortal(<Poll closePoll={closePoll} />, document.body)}
    </div>
  );
}
