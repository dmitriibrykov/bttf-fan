"use client";

import { useEffect, useState } from "react";
import Error from "@/components/Error";
import { getMovies } from "@/lib/api";
import { Omdb, ResponseFailed, ResponseSuccessfulBase, STATUS } from "@/types";
import { formatter } from "@/utils";

export function Movies() {
  const [data, setData] = useState<
    ResponseFailed | (ResponseSuccessfulBase & { movies: Omdb[] }) | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMovies();
      setData(res);
    };

    fetchData();
  }, []);

  if (data?.status === STATUS.FAILED) return <Error message={data.error} />;

  return (
    <div className="w-full flex flex-col gap-4">
      <h2>Movies Information</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-x-2 gap-y-8">
        {data?.movies.map((movie) => (
          <div key={movie.Title} className="flex gap-2">
            <img
              src={movie.Poster}
              alt="poster"
              className="w-[40%] h-auto rounded-sm"
            />
            <div className="flex flex-col">
              <h3>{movie.Title}</h3>
              <p>
                <span className="text-foreground/70">Release Date:</span>{" "}
                {movie.Released}
              </p>
              <p>
                <span className="text-foreground/70">Genre:</span> {movie.Genre}
              </p>
              {movie.Ratings.map((rating) => (
                <p key={rating.Source}>
                  <span className="text-foreground/70">{rating.Source}:</span>{" "}
                  {rating.Value}{" "}
                  {rating.Source === "Internet Movie Database" && (
                    <span className="text-foreground/70">
                      ({formatter.format(+movie.imdbVotes.replace(/,/g, ""))})
                    </span>
                  )}
                </p>
              ))}
              <p>
                <span className="text-foreground/70">Box Office:</span>{" "}
                {movie.BoxOffice}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
