import Error from "@/components/Error";
import { getMovies } from "@/lib/api";
import { STATUS } from "@/types";

export default async function Movies() {
  const data = await getMovies();

  if (data.status === STATUS.FAILED) return <Error message={data.error} />;

  return (
    <div className="flex flex-col w-full gap-2">
      {data.movies.map((movie) => (
        <div key={movie.Title}>
          <img src={movie.Poster} alt="poster" />
          <p>{movie.Title}</p>
        </div>
      ))}
    </div>
  );
}
