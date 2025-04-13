import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Credits from '../components/Credits';

import { fetchApiCall, BASE_URL, BASE_URL_IMAGE } from '../utils/api';
import { formatRuntimeHoursAndMinutes } from '../utils/formatting';

const Movie = ({ id }) => {
    const [movie, setMovie] = useState(null);
    const [directors, setDirectors] = useState([]);
    const [actors, setActors] = useState([]);

    // https://developer.themoviedb.org/reference/configuration-details
    const POSTER_SIZE = 'w185'; // w154 w92
    const MAX_ACTORS = 6;

    useEffect(() => {
        (async () => {
            try {
                const movieRes = await fetchApiCall(`${BASE_URL}/movie/${id}?language=en-US`);
                setMovie(movieRes);
    
                const creditsRes = await fetchApiCall(`${BASE_URL}/movie/${id}/credits?language=en-US`);
    
                const directorsArray = creditsRes.crew.filter(
                    (person) => person.job === 'Director'
                );
                setDirectors(directorsArray);
    
                const actorsArray = creditsRes.cast.filter(
                    (person) => person.order < MAX_ACTORS
                );
                setActors(actorsArray);
            } catch (error) {
                // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
                console.error('Error:', error);
            }
        })(); // IIFE
    }, [id]);

    // const getMovieAndCredits = useCallback(async () => {
    //     try {
    //         const [moviePromise, creditsPromise] = await Promise.allSettled([
    //             fetch(
    //                 `${BASE_URL}/movie/${id}?language=en-US`,
    //                 OPTIONS
    //             ),
    //             fetch(
    //                 `${BASE_URL}/movie/${id}/credits?language=en-US`,
    //                 OPTIONS
    //             )
    //         ]);

    //         // https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/
    //         // wrap in Promise.all(), since response.json() returns a promise as well?

    //         const movieResponse = moviePromise.value;
    //         ifHttpStatusNotOK_throwErrorsAndExit(movieResponse);
    //         const movieRes = await movieResponse.json();
    //         setMovie(movieRes);

    //         const creditsResponse = creditsPromise.value;
    //         ifHttpStatusNotOK_throwErrorsAndExit(creditsResponse);
    //         const creditsRes = await creditsResponse.json();

    //         const directorsArray = creditsRes.crew.filter(
    //             (person) => person.job === 'Director'
    //         );
    //         setDirectors(directorsArray);

    //         const actorsArray = creditsRes.cast.filter(
    //             (person) => person.order < MAX_ACTORS
    //         );
    //         setActors(actorsArray);
    //     } catch (error) {
    //         // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
    //         console.error('Error:', error);
    //     }
    // }, [id]);

    // useEffect(() => {
    //     getMovieAndCredits();
    // }, [getMovieAndCredits]);

    return (
        <>
            { movie && (
                <div className="row">
                    <img
                        src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`}
                        alt="Poster"
                    />
                    
                    <div className="column">
                        <Link
                            to={`/movie/${movie.id}`}
                            state={{ movie, directors, actors }}
                        >
                            {movie.title} ({movie.release_date.split('-')[0]})
                        </Link>
                        <p>{movie.overview}</p>

                        <div>
                            <b>Stars:</b>{' '}
                            {Math.round(movie.vote_average * 2) / 2}/10 (from{' '}
                            {movie.vote_count} votes)
                        </div>

                        <div>
                            <b>Runtime:</b>{' '}
                            {formatRuntimeHoursAndMinutes(movie.runtime)}
                        </div>

                        <span>
                            <b>Genre:</b>
                            <ul>
                                {movie.genres.map((genre) => (
                                    <li key={genre.id}>{genre.name}</li>
                                ))}
                            </ul>
                        </span>
                            
                        {directors.length > 0 && actors.length > 0 && (
                            <Credits
                                directors={directors}
                                actors={actors}
                                actorsDisplayMaxThree={true}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Movie;
