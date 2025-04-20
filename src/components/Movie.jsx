import { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';

import Credits from './Credits';
import ErrorFeedback from './ErrorFeedback';

import loadingGif from '../assets/images/gifer_loading_VAyR.gif';

import {
    fetchApiCallOrThrowError,
    BASE_URL,
    BASE_URL_IMAGE
} from '../utils/api';
import { formatRuntimeHoursAndMinutes } from '../utils/formatting';

const Movie = memo(({ id }) => {
    const [movie, setMovie] = useState(null);
    const [directors, setDirectors] = useState([]);
    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // https://developer.themoviedb.org/reference/configuration-details
    const POSTER_SIZE = 'w185'; // w154 w92
    const MAX_ACTORS = 6;

    useEffect(() => {
        (async () => {
            try {
                const [moviePromise, creditsPromise] = await Promise.allSettled(
                    [
                        fetchApiCallOrThrowError(
                            `${BASE_URL}/movie/${id}?language=en-US`
                        ),
                        fetchApiCallOrThrowError(
                            `${BASE_URL}/movie/${id}/credits?language=en-US`
                        )
                    ]
                );

                // https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/

                if (moviePromise.status === 'rejected') {
                    console.error('Error:', moviePromise.reason);
                    setErrorMessage(
                        'Failed to load Movie. ' + moviePromise.reason
                    );
                }

                if (moviePromise.status === 'fulfilled') {
                    const movieResponse = moviePromise.value;
                    setMovie(movieResponse);
                }

                if (creditsPromise.status === 'rejected') {
                    console.error('Error:', creditsPromise.reason);
                    setErrorMessage(
                        'Failed to load Credits. ' + creditsPromise.reason
                    );
                }

                if (creditsPromise.status === 'fulfilled') {
                    const creditsResponse = creditsPromise.value;

                    const arrayDirectors = creditsResponse.crew.filter(
                        (person) => person.job === 'Director'
                    );
                    setDirectors(arrayDirectors);

                    const arrayActors = creditsResponse.cast.filter(
                        (person) => person.order < MAX_ACTORS
                    );
                    setActors(arrayActors);
                }
            } catch (error) {
                // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
                console.error('Error:', error);
            }

            setLoading(false);
        })(); // IIFE
    }, [id]);

    return (
        <div className="row">
            {loading && (
                <img
                    // src="%PUBLIC_URL%/images/gifer_loading_VAyR.gif"
                    src={loadingGif}
                    alt="loading"
                    width="32"
                />
            )}

            {!loading && (
                <>
                    {movie && (
                        <img
                            src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`}
                            alt="Poster"
                        />
                    )}

                    <div className="column">
                        {movie && (
                            <>
                                <Link
                                    to={`/movie/${movie.id}`}
                                    state={{ movie, directors, actors }}
                                >
                                    {movie.title} (
                                    {movie.release_date.split('-')[0]})
                                </Link>
                                <p>{movie.overview}</p>

                                <div>
                                    <b>Stars:</b>{' '}
                                    {Math.round(movie.vote_average * 2) / 2}/10
                                    (from {movie.vote_count} votes)
                                </div>

                                <div>
                                    <b>Runtime:</b>{' '}
                                    {formatRuntimeHoursAndMinutes(
                                        movie.runtime
                                    )}
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
                            </>
                        )}

                        {errorMessage && (
                            <ErrorFeedback message={errorMessage} />
                        )}
                    </div>
                </>
            )}
        </div>
    );
});

export default Movie;
