"use client";

import { useSession } from "next-auth/react";
import CharactersLoading from "../loading";
import { NameInput, ProfilePicture } from "./_components";

export default function Profile() {
  const { data, status } = useSession();

  if (status === "loading" && !data) return <CharactersLoading />;

  return (
    <div className="w-screen h-auto flex flex-col items-center gap-4">
      <h1 className="text-center">Profile Settings</h1>
      <ProfilePicture />
      <NameInput />
    </div>
  );
}
