import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import Trailer from '../components/Trailer';
import Credits from '../components/Credits';

import { fetchApiCallOrThrowError, BASE_URL, BASE_URL_IMAGE } from '../utils/api';
import { formatRuntimeHoursAndMinutes } from '../utils/formatting';

const Movie = () => {
    const { id } = useParams();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

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

    useEffect(
        () => {
            (async () => {
                try {
                    if (!movie) {
                        const dataMovie = await fetchApiCallOrThrowError(`${BASE_URL}/movie/${id}?language=en-US`);
                        setMovie(dataMovie);
                    }

                    if (!directors || !actors) {
                        const dataCredits = await fetchApiCallOrThrowError(`${BASE_URL}/movie/${id}/credits?language=en-US`);
                        const arrayDirectors = dataCredits.crew.filter(
                            (person) => person.job === 'Director'
                        );
                        setDirectors(arrayDirectors);
            
                        const arrayActors = dataCredits.cast.filter(
                            (person) => person.order < MAX_ACTORS
                        );
                        setActors(arrayActors);
                    }
                } catch (error) {
                    // receive any error from fetchApiCallOrThrowError()
                    setErrorMessage(error.message);
                }
    
                setLoading(false);
            })(); // IIFE
        }, 
        [movie, directors, actors, id]
    );

    return (
        <>
            { loading && 
                <b>Loading...</b> 
            }

            { errorMessage && (
                <b>Error occured: { errorMessage }</b>
            )}

            { !loading && !errorMessage && movie && (
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
