import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

import Trailer from '../components/Trailer';
import Credits from '../components/Credits';
import ErrorFeedback from '../components/ErrorFeedback';

import {
    fetchApiCallOrThrowError,
    BASE_URL,
    BASE_URL_IMAGE
} from '../utils/api';
import { formatRuntimeHoursAndMinutes } from '../utils/formatting';

const Movie = () => {
    const { id } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // location.state will be null if Movie page is opened in a new tab
    const [movie, setMovie] = useState(
        location.state ? location.state.movie : null
    );
    const [directors, setDirectors] = useState(
        location.state ? location.state.directors : null
    );
    const [actors, setActors] = useState(
        location.state ? location.state.actors : null
    );

    const POSTER_SIZE = 'w185';
    const MAX_ACTORS = 6;

    useEffect(() => {
        (async () => {
            if (!movie) {
                try {
                    const dataMovie = await fetchApiCallOrThrowError(
                        `${BASE_URL}/movie/${id}?language=en-US`
                    );
                    setMovie(dataMovie);
                } catch (error) {
                    // receive any error from fetchApiCallOrThrowError()
                    setErrorMessage(
                        'Failed to load Movie. Error: ' + error.message
                    );
                }
            }

            if (!directors || !actors) {
                try {
                    const dataCredits = await fetchApiCallOrThrowError(
                        `${BASE_URL}/movie/${id}/credits?language=en-US`
                    );
                    const arrayDirectors = dataCredits.crew.filter(
                        (person) => person.job === 'Director'
                    );
                    setDirectors(arrayDirectors);

                    const arrayActors = dataCredits.cast.filter(
                        (person) => person.order < MAX_ACTORS
                    );
                    setActors(arrayActors);
                } catch (error) {
                    // receive any error from fetchApiCallOrThrowError()
                    setErrorMessage(
                        'Failed to load Credits. Error: ' + error.message
                    );
                }
            }

            setLoading(false);
        })(); // IIFE
    }, [movie, directors, actors, id]);

    return (
        <>
            {loading && (
                <img
                    src="/images/gifer_loading_VAyR.gif"
                    alt="loading"
                    width="128"
                />
            )}

            {!loading && (
                <div>
                    {movie && (
                        <>
                            <h2>
                                {movie.title} (
                                {movie.release_date.split('-')[0]})
                            </h2>
                            <img
                                src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`}
                                alt="Poster"
                            />
                            <p>{movie.overview}</p>
                            <p>
                                <b>Stars:</b>{' '}
                                {Math.round(movie.vote_average * 2) / 2}
                                /10 (from {movie.vote_count} votes)
                            </p>

                            <span>
                                <b>Genre:</b>
                                <ul>
                                    {movie.genres &&
                                        movie.genres.map((genre) => (
                                            <li key={genre.id}>{genre.name}</li>
                                        ))}
                                </ul>
                            </span>

                            <p>
                                <b>Runtime:</b>{' '}
                                {movie.runtime &&
                                    formatRuntimeHoursAndMinutes(movie.runtime)}
                            </p>

                            {directors && actors && (
                                <Credits
                                    directors={directors}
                                    actors={actors}
                                    showActorsPic={true}
                                    displayLinks={true}
                                    movieId={id}
                                />
                            )}
                        </>
                    )}

                    {errorMessage && <ErrorFeedback message={errorMessage} />}

                    {movie && (
                        <div>
                            <Trailer id={id} />
                        </div>
                    )}

                    <Link to="/">
                        <b>&laquo;Back to Movies</b>
                    </Link>
                </div>
            )}
        </>
    );
};

export default Movie;
