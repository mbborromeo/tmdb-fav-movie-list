import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { fetchApiCallOrThrowError, BASE_URL, BASE_URL_IMAGE } from '../utils/api';

const Person = () => {
    const { id } = useParams();

    const [person, setPerson] = useState(null);
    const [movies, setMovies] = useState([]);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const PROFILE_SIZE = 'w185'; // w138_and_h175_face
    const POSTER_SIZE = 'w92';
    const MAX_MOVIES = 8;

    useEffect(
        () => {
            (async () => {
                try {
                    const dataPerson = await fetchApiCallOrThrowError(`${BASE_URL}/person/${id}?language=en-US`); // if fetch error, value will stay undefined
                    setPerson(dataPerson);
                    
                    if (dataPerson) {
                        const dataCreditMovies = await fetchApiCallOrThrowError(`${BASE_URL}/person/${id}/movie_credits?language=en-US`);

                        let moviesOfInterest = [];

                        if (dataPerson.known_for_department === 'Acting') {
                            if (dataCreditMovies.cast && dataCreditMovies.cast.length > 0) {
                                moviesOfInterest = [...dataCreditMovies.cast]; // shallow copy for sorting, so original immutable

                                // // sort by order, then by popularity
                                // moviesOfInterest.sort( (a, b) => a.order - b.order || b.popularity - a.popularity );

                                // sort by popularity
                                moviesOfInterest.sort(
                                    (a, b) => b.popularity - a.popularity
                                );
                            }
                        } else {
                            if (dataCreditMovies.crew && dataCreditMovies.crew.length > 0) {
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
                            moviesOfInterest = moviesOfInterest.slice(0, MAX_MOVIES);
                        }

                        setMovies(moviesOfInterest);
                    }
                } catch (error) {
                    // receive any error from fetchApiCallOrThrowError()
                    setErrorMessage(error.message);
                }
    
                setLoading(false);
            })();
        },
        [id]
    );

    return (
        <>
            { loading && 
                <b>Loading...</b> 
            }

            { errorMessage && (
                <b>Error occured: { errorMessage }</b>
            )}

            { !loading && !errorMessage && person && (
                <>
                    <h2>{person.name}</h2>
                    {person.profile_path && (
                        <img
                            src={
                                BASE_URL_IMAGE +
                                PROFILE_SIZE +
                                person.profile_path
                            }
                            alt={`${person.name}'s profile pic`}
                        />
                    )}
                    <p>{person.biography}</p>
                    <p>
                        <b>Known for department:</b>{' '}
                        {person.known_for_department}
                    </p>
                </>
            )}

            { !loading && !errorMessage && movies.length > 0 && (
                <>
                    <b>Movies:</b>
                    <ul>
                        { movies.map((movie) => {
                                return (
                                    <li key={`${movie.id}-${movie.job}`}>
                                        <Link to={`/movie/${movie.id}`}>
                                            {movie.title} (
                                            {person.known_for_department === 'Acting'
                                                ? movie.character
                                                : movie.job}
                                            )
                                            {movie.poster_path && (
                                                <img
                                                    src={
                                                        BASE_URL_IMAGE +
                                                        POSTER_SIZE +
                                                        movie.poster_path
                                                    }
                                                    alt={`${person.name}'s profile pic`}
                                                />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </>
            )}
        </>
    );
};

export default Person;
