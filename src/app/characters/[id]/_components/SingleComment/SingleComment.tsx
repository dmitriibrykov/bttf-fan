import React from "react";
import UserAvatar from "@/components/UserAvatar";
import { Comment } from "@/models/Comment";
import MainContent from "./MainContent";
import { Separator } from "@/components/ui/separator";

type Props = {
  comment: Comment;
};

export function SingleComment({ comment }: Props) {
  return (
    <div className="flex gap-4 max-w-[800px]">
      <UserAvatar
        imgSrc={comment.user.image}
        name={comment.user.name}
        classes="h-[30px] w-[30px]"
      />
      <div className="flex flex-col w-full">
        <MainContent comment={comment} />
        {!comment._parent_id && comment.replies.length > 0 && (
          <>
            <Separator className="my-2" />
            <div className="flex flex-col gap-4 -ml-4 md:ml-8">
              {comment.replies.map((c, i) => (
                <React.Fragment key={c._id}>
                  <SingleComment comment={c} />
                  {i < comment.replies.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
