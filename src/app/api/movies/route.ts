import { apiHandler } from "@/lib/apiHandler";
import { STATUS } from "@/types";

export const GET = apiHandler(async () => {
  const firstPartRes = await fetch(
    `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=tt0088763&plot=full`,
  );
  const secondPartRes = await fetch(
    `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=tt0096874&plot=full`,
  );
  const thirdPartRes = await fetch(
    `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=tt0099088&plot=full`,
  );

  const firstPartData = await firstPartRes.json();
  const secondPartData = await secondPartRes.json();
  const thirdPartData = await thirdPartRes.json();

  return Response.json({
    status: STATUS.SUCCESSFUL,
    movies: [firstPartData, secondPartData, thirdPartData],
  });
});
