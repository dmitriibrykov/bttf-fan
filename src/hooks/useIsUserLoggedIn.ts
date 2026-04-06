import { useSession } from "next-auth/react";

export function useIsUserLoggedIn() {
  const { status } = useSession();

  return status === "authenticated";
}
