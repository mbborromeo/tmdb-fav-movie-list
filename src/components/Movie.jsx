import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Credits from "../components/Credits";

import { formatRuntimeHoursAndMinutes } from "../utils/utils.jsx";

const Movie = ({ id }) => {
  const [movie, setMovie] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [actors, setActors] = useState([]);

  console.log('movie', movie);

  const BASE_URL_IMAGE = "http://image.tmdb.org/t/p/";
  const POSTER_SIZE = "w185"; // w154 w92

  const MAX_ACTORS = 6;

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

  useEffect(
      () => {
          fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, options)
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
      },
      []
  );

  return (
        <>
            { movie &&
                <div className="row">
                    <img src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`} alt="Poster" />
                    <div className="column">
                        <Link to={`/movie/${movie.id}`} state={{ movie, directors, actors }}>
                            {movie.title} ({movie.release_date.split("-")[0]})
                        </Link>
                        <p>
                            {movie.overview}
                        </p>

                        <div><b>Stars:</b> { Math.round(movie.vote_average * 2)/2 }/10 (from {movie.vote_count} votes)</div>

                        <div><b>Runtime:</b> { formatRuntimeHoursAndMinutes(movie.runtime) }</div>

                        <span>
                            <b>Genre:</b>
                            <ul>
                                { movie.genres.map( (genre) => (
                                    <li key={genre.id}>
                                        {genre.name}
                                    </li>
                                ))
                                }
                            </ul>
                        </span>

                        <Credits id={id} directors={directors} actors={actors} actorsDisplayMaxThree={true} />                    
                    </div>
                </div>
            }
        </>
  );
};

export default Movie;
