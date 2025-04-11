import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';

import Credits from '../components/Credits';

import ifHttpStatusNotOK_throwErrorsAndExit from '../utils/fetch-utility';
import { formatRuntimeHoursAndMinutes } from '../utils/utils';

const Movie = ({ id }) => {
    const [movie, setMovie] = useState(null);
    const [directors, setDirectors] = useState([]);
    const [actors, setActors] = useState([]);

    // https://developer.themoviedb.org/reference/configuration-details
    const BASE_URL_IMAGE = 'http://image.tmdb.org/t/p/';
    const POSTER_SIZE = 'w185'; // w154 w92

    const MAX_ACTORS = 6;

    const options = useMemo(
        () => ({
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
            }
        }),
        []
    );

    const getMovieAndCredits = useCallback(async () => {
        try {
            const responses = await Promise.all([
                fetch(
                    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
                    options
                ),
                fetch(
                    `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
                    options
                )
            ]);

            // https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/
            // wrap in Promise.all(), since response.json() returns a promise as well
            await Promise.all(
                responses.map(async (response, index) => {
                    // Possible improvement: if one fetch fails, the other one will still proceed and display on UI
                    ifHttpStatusNotOK_throwErrorsAndExit(response);

                    // Promise resolved and HTTP status is successful
                    const res = await response.json();

                    if (index === 0) {
                        setMovie(res);
                    }

                    if (index === 1) {
                        const directorsArray = res.crew.filter(
                            (person) => person.job === 'Director'
                        );
                        setDirectors(directorsArray);

                        const actorsArray = res.cast.filter(
                            (person) => person.order < MAX_ACTORS
                        );
                        setActors(actorsArray);
                    }
                })
            );
        } catch (error) {
            // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
            console.error('Error:', error);
        }
    }, [id, options]);

    useEffect(() => {
        getMovieAndCredits();
    }, [getMovieAndCredits]);

    return (
        <>
            {movie && (
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
