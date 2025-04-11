import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import Trailer from '../components/Trailer';
import Credits from '../components/Credits';

import ifHttpStatusNotOK_throwErrorsAndExit from '../utils/fetch-utility';
import { formatRuntimeHoursAndMinutes } from '../utils/utils';

const Movie = () => {
    const { id } = useParams();
    const location = useLocation();

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

    const BASE_URL_IMAGE = 'http://image.tmdb.org/t/p/';
    const POSTER_SIZE = 'w185';

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

    const getMovie = useCallback(async () => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
                options
            );

            ifHttpStatusNotOK_throwErrorsAndExit(response);

            // Promise resolved and HTTP status is successful
            const res = await response.json();
            setMovie(res);
        } catch (error) {
            // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
            console.error('Error:', error);
        }
    }, [id, options]);

    const getCredits = useCallback(async () => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
                options
            );

            ifHttpStatusNotOK_throwErrorsAndExit(response);

            // Promise resolved and HTTP status is successful
            const res = await response.json();

            let directorsArray = [];
            let actorsArray = [];

            res.crew.forEach((person) => {
                if (person.job === 'Director') {
                    directorsArray.push(person);
                }
            });
            setDirectors(directorsArray);

            res.cast.forEach((person) => {
                if (person.order < MAX_ACTORS) {
                    actorsArray.push(person);
                }
            });
            setActors(actorsArray);
        } catch (error) {
            // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
            console.error('Error:', error);
        }
    }, [id, options]);

    useEffect(() => {
        if (!movie) {
            getMovie();
        }

        if (!directors || !actors) {
            getCredits();
        }
    }, [movie, directors, actors, getMovie, getCredits]);

    return (
        <>
            {movie && (
                <div>
                    <h2>
                        {movie.title} ({movie.release_date.split('-')[0]})
                    </h2>
                    <img
                        src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`}
                        alt="Poster"
                    />
                    <p>{movie.overview}</p>
                    <p>
                        <b>Stars:</b> {Math.round(movie.vote_average * 2) / 2}
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

                    <Credits
                        directors={directors}
                        actors={actors}
                        showActorsPic={true}
                        displayLinks={true}
                    />

                    <Trailer id={id} />
                </div>
            )}
        </>
    );
};

export default Movie;
