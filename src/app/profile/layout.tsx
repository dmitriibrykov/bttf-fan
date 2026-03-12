import { redirect } from "next/navigation";
import { getUserFromServerSession } from "@/lib/auth";
import { ReactNode } from "react";

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUserFromServerSession();
  if (!user) {
    redirect("/api/auth/signin");
  }
  return <>{children}</>;
}
