"use client";

import { useParams } from "next/navigation";
import { CommentContextProvider } from "./context";
import { Comments } from "./Comments";

export function CommentsWrapper() {
  const { id: characterId } = useParams<{ id: string }>();

  return (
    <CommentContextProvider characterId={characterId}>
      <Comments />
    </CommentContextProvider>
  );
}
