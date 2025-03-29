import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Trailer from "../components/Trailer";

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

//   console.log('Movie', movie);

  const BASE_URL_IMAGE = "http://image.tmdb.org/t/p/";
  const POSTER_SIZE = "w185";

  const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
    }
  };

  useEffect(
    () => {
        fetch(`https://api.themoviedb.org/3/movie/${ id }?language=en-US`, options)
            .then(res => res.json())
            // .then(res => { 
            //     console.log(res);
            //     return res;
            // })
            .then((res) => setMovie(res))
            .catch(err => console.error(err));
    }, 
    []
  );

  return (
        <>
            { movie &&
                <div>
                    <h2>{movie.title} ({movie.release_date.split("-")[0]})</h2>
                    <img src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`} alt="Poster" />
                    <p>{movie.overview}</p>

                    <Trailer id={id} />
                </div>
            }
        </>
  );
};

export default Movie;
