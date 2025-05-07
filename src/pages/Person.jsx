import { useEffect, useState } from 'react';
import {
    useParams,
    useLocation,
    useSearchParams,
    Link
} from 'react-router-dom';

import ErrorFeedback from '../components/ErrorFeedback';
import Footer from '../components/Footer';

import loadingGif from '../assets/images/gifer_loading_VAyR.gif';

import {
    fetchApiCallOrThrowError,
    BASE_URL,
    BASE_URL_IMAGE
} from '../utils/api';

const Person = () => {
    const { id } = useParams();
    const location = useLocation();
    const movieId = location.state ? location.state.movieId : null;

    const [searchParams] = useSearchParams();
    const filter = searchParams.get('filter');
    const genreFilter = filter ? filter : null;
    const order = searchParams.get('order');
    const dateOrder = order ? order : null;

    const [person, setPerson] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const PROFILE_SIZE = 'w300'; // w185 w138_and_h175_face
    const POSTER_SIZE = 'w185'; // w92
    const MAX_MOVIES = 8;

    useEffect(() => {
        (async () => {
            let dataPerson = null;

            try {
                dataPerson = await fetchApiCallOrThrowError(
                    `${BASE_URL}/person/${id}?language=en-US`
                ); // if fetch error, value will stay undefined
                setPerson(dataPerson);
            } catch (error) {
                // receive any error from fetchApiCallOrThrowError()
                setErrorMessage(
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
                    // receive any error from fetchApiCallOrThrowError()
                    setErrorMessage(
                        'Failed to load Credits. Error: ' + error.message
                    );
                }
            }

            setLoading(false);
        })();
    }, [id]);

    return (
        <>
            {loading && <img src={loadingGif} alt="loading" width="64" />}

            {!loading && (
                <>
                    <div>
                        {movieId ? (
                            <Link
                                to={
                                    genreFilter && dateOrder
                                        ? `/movie/${movieId}?filter=${genreFilter}&order=${dateOrder}`
                                        : genreFilter && !dateOrder
                                          ? `/movie/${movieId}?filter=${genreFilter}`
                                          : !genreFilter && dateOrder
                                            ? `/movie/${movieId}?order=${dateOrder}`
                                            : `/movie/${movieId}`
                                }
                            >
                                <b>&laquo;Back to Movie</b>
                            </Link>
                        ) : (
                            <Link
                                to={
                                    genreFilter && dateOrder
                                        ? `/?filter=${genreFilter}&order=${dateOrder}`
                                        : genreFilter && !dateOrder
                                          ? `/?filter=${genreFilter}`
                                          : !genreFilter && dateOrder
                                            ? `/?order=${dateOrder}`
                                            : '/'
                                }
                            >
                                <b>&laquo;Back to Movies</b>
                            </Link>
                        )}
                    </div>

                    {person && (
                        <div className="content-wrapper">
                            <h2>{person.name}</h2>

                            <div className="row row-person">
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
                                <p className="description">
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
                                                        to={
                                                            genreFilter &&
                                                            dateOrder
                                                                ? `/movie/${movie.id}?filter=${genreFilter}&order=${dateOrder}`
                                                                : genreFilter &&
                                                                    !dateOrder
                                                                  ? `/movie/${movie.id}?filter=${genreFilter}`
                                                                  : !genreFilter &&
                                                                      dateOrder
                                                                    ? `/movie/${movie.id}?order=${dateOrder}`
                                                                    : `/movie/${movie.id}`
                                                        }
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

                    {errorMessage && <ErrorFeedback message={errorMessage} />}
                </>
            )}

            <Footer />
        </>
    );
};

export default Person;
