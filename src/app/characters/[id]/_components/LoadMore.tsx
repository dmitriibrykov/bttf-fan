import { Button } from "@/components/ui/button";
import { useCommentContext } from "./context";
import { STATUS } from "@/types";
import { Spinner } from "@/components/ui/spinner";

export default function LoadMore() {
  const { isMore, status, comments, fetchMore } = useCommentContext();

  if (!isMore || comments?.length === 0) return null;

  return (
    <Button
      className="h-[50px] w-[300px] mt-8"
      onClick={() => fetchMore(comments?.length)}
    >
      {status === STATUS.LOADING && (
        <div className="flex gap-2">
          <Spinner />
          Loading more...
        </div>
      )}
      {status !== STATUS.LOADING && <span>Load more</span>}
    </Button>
  );
}
