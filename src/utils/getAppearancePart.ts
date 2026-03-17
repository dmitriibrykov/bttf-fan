import { Appearance } from "@/types/enums";

export function getAppearancePart(appearance: Appearance) {
  switch (appearance) {
    case Appearance.Part1:
      return "I";
    case Appearance.Part2:
      return "II";
    case Appearance.Part3:
      return "III";
  }
}
