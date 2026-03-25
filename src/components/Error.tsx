type Props = {
  message?: string;
};

export default function Error({ message }: Props) {
  return (
    <div className="w-full h-auto flex items-center justify-center">
      <h2>{message || "Something went wrong!"}</h2>
    </div>
  );
}
