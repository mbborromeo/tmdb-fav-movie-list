import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Credits from "../components/Credits";

import { formatRuntimeHoursAndMinutes } from "../utils/utils.jsx";

const Movie = ({ id }) => {
  const [movie, setMovie] = useState(null);

  console.log('movie', movie);

  const BASE_URL_IMAGE = "http://image.tmdb.org/t/p/";
  const POSTER_SIZE = "w92";

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
            .then((res) => setMovie(res))
            .catch(err => console.error(err));
    }, 
    []
  );

  return (
        <>
            { movie &&
                <div className="row">
                    <img src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`} alt="Poster" />
                    <div className="column">
                        <Link to={`/movie/${movie.id}`} state={{ movieState: movie }}>
                            {movie.title} ({movie.release_date.split("-")[0]})
                        </Link>
                        <p>
                            {movie.overview}
                        </p>
                        <p>Stars: { Math.round(movie.vote_average * 2)/2 }/10 (from {movie.vote_count} votes)</p>

                        <p>Runtime: { formatRuntimeHoursAndMinutes(movie.runtime) }</p>

                        <span>
                            Genre:
                            <ul>
                                { movie.genres.map( (genre) => (
                                    <li key={genre.id}>
                                        {genre.name}
                                    </li>
                                ))
                                }
                            </ul>
                        </span>

                        <Credits id={id} />                    
                    </div>
                </div>
            }
        </>
  );
};

export default Movie;
