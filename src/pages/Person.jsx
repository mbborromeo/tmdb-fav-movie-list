import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import ErrorFeedback from '../components/ErrorFeedback';
import BackButton from '../components/BackButton';

import loadingGif from '../assets/images/gifer_loading_VAyR.gif';

import {
    fetchApiCallOrThrowError,
    BASE_URL,
    BASE_URL_IMAGE,
    MAX_MOVIES
} from '../utils/api';

const Person = () => {
    const { id } = useParams();

    const [person, setPerson] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessages, setErrorMessages] = useState([]);

    const PROFILE_SIZE = 'w300'; // w185 w138_and_h175_face
    const POSTER_SIZE = 'w185'; // w92

    useEffect(() => {
        (async () => {
            let dataPerson = null;
            const errorsArray = [];

            try {
                dataPerson = await fetchApiCallOrThrowError(
                    `${BASE_URL}/person/${id}?language=en-US`
                ); // if fetch error, value will stay undefined
                setPerson(dataPerson);
            } catch (error) {
                // receive any error from fetchApiCallOrThrowError
                errorsArray.push(
                    'Failed to load Person. Error: ' + error.message
                );
            }

            if (dataPerson) {
                try {
                    const dataCreditMovies = await fetchApiCallOrThrowError(
                        `${BASE_URL}/person/${id}/movie_credits?language=en-US`
                    );

                    let moviesOfInterest = [];

                    if (dataPerson.known_for_department === 'Acting') {
                        if (
                            dataCreditMovies.cast &&
                            dataCreditMovies.cast.length > 0
                        ) {
                            moviesOfInterest = [...dataCreditMovies.cast]; // shallow copy for sorting, so original immutable

                            // // sort by order, then by popularity
                            // moviesOfInterest.sort( (a, b) => a.order - b.order || b.popularity - a.popularity );

                            // sort by popularity
                            moviesOfInterest.sort(
                                (a, b) => b.popularity - a.popularity
                            );
                        }
                    } else {
                        if (
                            dataCreditMovies.crew &&
                            dataCreditMovies.crew.length > 0
                        ) {
                            moviesOfInterest = [...dataCreditMovies.crew];

                            // filter out non-director jobs
                            moviesOfInterest = moviesOfInterest.filter(
                                (movie) => movie.job === 'Director'
                            );

                            // sort by popularity
                            moviesOfInterest.sort(
                                (a, b) => b.popularity - a.popularity
                            );
                        }
                    }

                    // limit to 8 movies
                    if (moviesOfInterest.length > MAX_MOVIES) {
                        moviesOfInterest = moviesOfInterest.slice(
                            0,
                            MAX_MOVIES
                        );
                    }

                    setMovies(moviesOfInterest);
                } catch (error) {
                    // receive any error from fetchApiCallOrThrowError
                    errorsArray.push(
                        'Failed to load Credits. Error: ' + error.message
                    );
                }
            }

            if (errorsArray.length > 0) {
                setErrorMessages(errorsArray);
            }

            setLoading(false);
        })();
    }, [id]);

    return (
        <>
            {loading && <img src={loadingGif} alt="loading" width="64" />}

            {!loading && (
                <>
                    <div className="back-button-wrapper">
                        <BackButton />
                    </div>

                    {person && (
                        <div className="content-wrapper page">
                            <h2>{person.name}</h2>

                            <div className="row row-person">
                                <p className="description">
                                    {person.profile_path && (
                                        <img
                                            src={
                                                BASE_URL_IMAGE +
                                                PROFILE_SIZE +
                                                person.profile_path
                                            }
                                            alt={`${person.name}'s profile pic`}
                                            width="246"
                                            height="368"
                                        />
                                    )}

                                    {person.biography}
                                </p>
                            </div>

                            <div>
                                <b>Known for department:</b>{' '}
                                {person.known_for_department}
                            </div>

                            {movies.length > 0 && (
                                <div>
                                    <b>Movies:</b>
                                    <div className="row movies-wrapper">
                                        {movies.map((movie) => {
                                            return (
                                                <div
                                                    key={`${movie.id}-${movie.job}`}
                                                >
                                                    {movie.poster_path && (
                                                        <img
                                                            src={
                                                                BASE_URL_IMAGE +
                                                                POSTER_SIZE +
                                                                movie.poster_path
                                                            }
                                                            alt="Poster"
                                                            width="123"
                                                            height="184"
                                                        />
                                                    )}

                                                    <Link
                                                        to={`/movie/${movie.id}`}
                                                    >
                                                        {movie.title}
                                                    </Link>
                                                    <span>
                                                        {person.known_for_department ===
                                                        'Acting'
                                                            ? ` (${movie.character})`
                                                            : ` (${movie.job})`}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {errorMessages.length > 0 && (
                        <ErrorFeedback errors={errorMessages} />
                    )}
                </>
            )}
        </>
    );
};

export default Person;
