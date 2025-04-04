import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Credits from "../components/Credits";

import { formatRuntimeHoursAndMinutes } from "../utils/utils.jsx";

const Movie = ({ id }) => {
  const [movie, setMovie] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [actors, setActors] = useState([]);

  // https://developer.themoviedb.org/reference/configuration-details
  const BASE_URL_IMAGE = "http://image.tmdb.org/t/p/";
  const POSTER_SIZE = "w185"; // w154 w92

  const MAX_ACTORS = 6;

  const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
  };

  useEffect(
    () => {
        Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options),
            fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, options)
        ]).then( (responses) => {
            // https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/
            // wrap in Promise.all(), since response.json() returns a promise as well
            return Promise.all(
                responses.map( (response) => ( 
                    response.json()
                ))
            );
        }).then( (data) => {
            // save movie info
            setMovie(data[0]);

            // save credits info
            let directorsArray = [];
            let actorsArray = [];
        
            data[1].crew.forEach( (person) => {
                if (person.job === 'Director') {
                    directorsArray.push(person);
                }
            });
            setDirectors(directorsArray);

            data[1].cast.forEach( (person) => {
                if (person.order < MAX_ACTORS) {
                    actorsArray.push(person);
                }
            });
            setActors(actorsArray);
        }).catch(
            (err) => console.error(err)
        );
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
