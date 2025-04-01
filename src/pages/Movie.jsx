import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import Trailer from "../components/Trailer";
import Credits from "../components/Credits";

import { formatRuntimeHoursAndMinutes } from "../utils/utils.jsx";

const Movie = () => {
  const { id } = useParams();
  const location = useLocation();

  const [movie, setMovie] = useState(location.state ? location.state.movie : null);
  const [directors, setDirectors] = useState(location.state ? location.state.directors : null);
  const [actors, setActors] = useState(location.state ? location.state.actors : null);

  const BASE_URL_IMAGE = "http://image.tmdb.org/t/p/";
  const POSTER_SIZE = "w185";

  const MAX_ACTORS = 6;

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

  const getCredits = () => {
    fetch(`https://api.themoviedb.org/3/movie/${ id }/credits?language=en-US`, options)
        .then(res => res.json())
        .then(res => { 
                    console.log('credits:', res);
                    return res;
                })
        .then(res => {
            let directorsArray = [];
            let actorsArray = [];
            
            res.crew.forEach( (person) => {
                if (person.job === 'Director') {
                    directorsArray.push(person);
                }
            });
            setDirectors(directorsArray);

            res.cast.forEach( (person) => {
                if (person.order < MAX_ACTORS) {
                    actorsArray.push(person);
                }
            });
            setActors(actorsArray);
        })
        .catch(err => console.error(err));
  }

  useEffect(
    () => {
        if (!movie) {
            getMovie();
        }

        if (!directors || !actors) {
            getCredits();
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

                    <p>Runtime: { formatRuntimeHoursAndMinutes(movie.runtime) }</p>

                    <Credits id={id} directors={directors} actors={actors} showActorsPic={true} />
                    
                    <Trailer id={id} />
                </div>
            }
        </>
  );
};

export default Movie;
