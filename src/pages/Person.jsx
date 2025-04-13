import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { getPerson, getCreditMovies, BASE_URL_IMAGE } from '../utils/api';

const Person = () => {
    const { id } = useParams();

    const [person, setPerson] = useState(null);
    const [movies, setMovies] = useState([]);

    const PROFILE_SIZE = 'w185'; // w138_and_h175_face
    const POSTER_SIZE = 'w92';
    const MAX_MOVIES = 8;

    useEffect(
        () => {
            (async () => {
                let res1 = null; // initially
                res1 = await getPerson(id);
                setPerson(res1);
                
                if (res1) {                
                    const res2 = await getCreditMovies(id);

                    let moviesOfInterest = [];

                    if (res1.known_for_department === 'Acting') {
                        if (res2.cast && res2.cast.length > 0) {
                            moviesOfInterest = [...res2.cast]; // shallow copy for sorting, so original immutable

                            // // sort by order, then by popularity
                            // moviesOfInterest.sort( (a, b) => a.order - b.order || b.popularity - a.popularity );

                            // sort by popularity
                            moviesOfInterest.sort(
                                (a, b) => b.popularity - a.popularity
                            );
                        }
                    } else {
                        if (res2.crew && res2.crew.length > 0) {
                            moviesOfInterest = [...res2.crew];

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
            })();
        },
        [id]
    );

    return (
        <>
            {person && (
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

            <b>Movies:</b>
            <ul>
                {movies.length > 0 &&
                    movies.map((movie) => {
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
                    })}
            </ul>
        </>
    );
};

export default Person;
