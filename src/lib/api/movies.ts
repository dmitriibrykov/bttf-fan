import { Omdb, ResponseFailed, ResponseSuccessfulBase } from "@/types";

export async function getMovies(): Promise<
  ResponseFailed | (ResponseSuccessfulBase & { movies: Omdb[] })
> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`);

  const data = await res.json();

  return data;
}
