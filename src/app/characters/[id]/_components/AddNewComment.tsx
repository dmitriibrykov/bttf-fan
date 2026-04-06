import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { sendComment } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { useCommentContext } from "./context";
import { STATUS } from "@/types";
import { Comment } from "@/models/Comment";
import { useIsUserLoggedIn } from "@/hooks";

export function AddNewComment() {
  const [newComment, setNewComment] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { id: characterId } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const { addNewComment } = useCommentContext();
  const isLoggedIn = useIsUserLoggedIn();

  const send = async () => {
    setIsSending(true);
    const res = await sendComment(characterId, newComment);
    if (res.status === STATUS.SUCCESSFUL) {
      const newComment: Comment = {
        ...res.comment,
        likesCount: 0,
        likedByMe: false,
        replies: [],
        user: {
          name: session?.user?.name ?? "",
          image: session?.user?.image ?? "",
        },
      };
      addNewComment(newComment);
    } else {
      toast.error(
        "Something wrong happened while sending your comment. Please, try later!",
      );
    }

    setNewComment("");
    setIsSending(false);
  };

  return (
    <div className="flex flex-col max-w-[500px] w-full">
      <p className="mt-4">Leave your comment:</p>
      {isLoggedIn ? (
        <>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border-1 border-primary rounded-md mb-4 p-2 w-full min-h-[150px]"
          />
          <Button
            onClick={send}
            disabled={newComment.length === 0}
            className="w-[300px] h-[50px] ml-auto"
          >
            {isSending && (
              <>
                <Spinner />
                <span>Sending...</span>
              </>
            )}
            {!isSending && <span>Send Comment</span>}
          </Button>
        </>
      ) : (
        <Button className="w-[300px] h-[50px] mt-4">
          <Link
            href={`/api/auth/signin?callbackUrl=/characters/${characterId}`}
          >
            Sign in to leave a comment
          </Link>
        </Button>
      )}
    </div>
  );
}
