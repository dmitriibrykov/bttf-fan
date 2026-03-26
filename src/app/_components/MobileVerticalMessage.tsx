import { RotateCcw } from "lucide-react";

export default function MobileVerticalMessage() {
  return (
    <div className="w-full h-auto gap-2 flex items-center justify-center text-primary">
      <RotateCcw size={24} />
      <p className="text-xl font-bold">
        Rotate your phone for a better experience
      </p>
    </div>
  );
}
