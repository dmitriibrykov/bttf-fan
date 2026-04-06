function CommentSkeleton() {
  return (
    <div className="flex gap-4 max-w-[800px] animate-pulse">
      <div className="h-[40px] w-[40px] min-w-[40px] rounded-full bg-muted" />
      <div className="flex w-full gap-4">
        <div className="flex flex-col gap-2 grow">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-3/4 rounded bg-muted" />
        </div>
        <div className="h-3 w-16 rounded bg-muted min-w-fit" />
      </div>
    </div>
  );
}

export default function CommentsSkeleton() {
  return Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />);
}
