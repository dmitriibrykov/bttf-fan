import { Button } from "@/components/ui/button";
import { useCommentContext } from "./context";
import { STATUS } from "@/types";
import CommentsSkeleton from "./CommentsSkeleton";

export default function LoadMore() {
  const { isMore, status, comments, fetchMore } = useCommentContext();

  if (!isMore || (comments ?? []).length === 0) return null;

  return (
    <>
      {status !== STATUS.LOADING && (
        <Button
          className="h-[50px] w-[300px] mt-8"
          onClick={() => fetchMore(comments?.length)}
        >
          Load more
        </Button>
      )}
      {status === STATUS.LOADING && <CommentsSkeleton />}
    </>
  );
}
