import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import Trailer from "../components/Trailer";
import Credits from "../components/Credits";

const Movie = () => {
  const { id } = useParams();
  const location = useLocation();

  const [movie, setMovie] = useState(location.state ? location.state.movieState : null);

  const BASE_URL_IMAGE = "http://image.tmdb.org/t/p/";
  const POSTER_SIZE = "w185";

  const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
    }
  };

  const getMovie = () => {
    fetch(`https://api.themoviedb.org/3/movie/${ id }?language=en-US`, options)
            .then(res => res.json())
            .then((res) => setMovie(res))
            .catch(err => console.error(err));
  }

  useEffect(
    () => {
        if (!movie) {
            getMovie();
        }
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
                    <p>Stars: { Math.round(movie.vote_average * 2)/2 }/10 (from {movie.vote_count} votes)</p>

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

                    <Credits id={id} showActorsPic={true} />
                    
                    <Trailer id={id} />
                </div>
            }
        </>
  );
};

export default Movie;
