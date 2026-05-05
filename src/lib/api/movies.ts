import { Omdb, ResponseFailed, ResponseSuccessfulBase, STATUS } from "@/types";

export async function getMovies(): Promise<
  ResponseFailed | (ResponseSuccessfulBase & { movies: Omdb[] })
> {
  try {
    const [firstPartRes, secondPartRes, thirdPartRes] = await Promise.all([
      fetch(
        `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=tt0088763&plot=full`,
      ),
      fetch(
        `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=tt0096874&plot=full`,
      ),
      fetch(
        `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=tt0099088&plot=full`,
      ),
    ]);

    const firstPartData = await firstPartRes.json();
    const secondPartData = await secondPartRes.json();
    const thirdPartData = await thirdPartRes.json();

    return {
      status: STATUS.SUCCESSFUL,
      movies: [firstPartData, secondPartData, thirdPartData],
    };
  } catch (e) {
    return {
      status: STATUS.FAILED,
      error: (e as Error).message,
    };
  }
}
