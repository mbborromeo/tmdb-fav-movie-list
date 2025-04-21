import { useState, useEffect, useMemo, useCallback } from 'react';

import { fetchApiCallOrThrowError, BASE_URL } from '../utils/api';

import Movie from '../components/Movie';
import ErrorFeedback from '../components/ErrorFeedback';
import Footer from '../components/Footer';

import loadingGif from '../assets/images/gifer_loading_VAyR.gif';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [dateOrder, setDateOrder] = useState('ascending');
    const [moviesCategorized, setMoviesCategorized] = useState({});
    const [genreOfInterest, setGenreOfInterest] = useState('all');

    const sortMovies = useCallback(
        (moviesArray) => {
            // sort by release date
            const sorted = [...moviesArray];
            sorted.sort((a, b) =>
                dateOrder === 'ascending'
                    ? Date.parse(a.release_date) - Date.parse(b.release_date)
                    : Date.parse(b.release_date) - Date.parse(a.release_date)
            );

            return sorted;
        },
        [dateOrder]
    );

    const toggleDateOrder = useCallback(() => {
        if (dateOrder === 'ascending') {
            setDateOrder('descending');
        } else {
            setDateOrder('ascending');
        }
    }, [dateOrder]);

    useEffect(() => {
        (async () => {
            let genres = [];

            try {
                const data = await fetchApiCallOrThrowError(
                    'https://api.themoviedb.org/3/genre/movie/list?language=en'
                );

                if (data && data.genres && data.genres.length > 0) {
                    // data undefined if nothing returned from fetch
                    genres = data.genres;
                }
            } catch (error) {
                setErrorMessage(
                    'Failed to load Genres. Error: ' + error.message
                );
            }

            if (genres.length > 0) {
                try {
                    // need to await here, since fetchApiCallOrThrowError() is async returning a promise
                    const data = await fetchApiCallOrThrowError(
                        `${BASE_URL}/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`
                    );

                    const getMoviesCategorized = (moviesArray) => {
                        const moviesByGenre = {};

                        // organize movies by genre
                        moviesArray.forEach((movie) =>
                            movie['genre_ids'].forEach((gid) => {
                                let genre = genres.find(
                                    (obj) => obj.id === gid
                                )['name'];

                                // Abbreviate "Science Fiction" genre for button
                                if (genre === "Science Fiction" ) {
                                    genre = "Sci-Fi";
                                }

                                // if that genre does not exist yet, create an array for that genre
                                // if (moviesByGenre[genre] === undefined) {
                                if (!Object.hasOwn(moviesByGenre, genre)) {
                                    moviesByGenre[genre] = [];
                                }

                                // add movie JSON object to corresponding genre array
                                moviesByGenre[genre].push(movie);
                            })
                        );

                        return moviesByGenre;
                    };

                    if (data && data.results && data.results.length > 0) {
                        const movies = data.results;
                        // data undefined if nothing returned from fetch
                        setMovies(movies);
                        setMoviesCategorized(getMoviesCategorized(movies));
                    }
                } catch (error) {
                    // receive any error from fetchApiCallOrThrowError()
                    // console.log("fileName", error.fileName); // only works in Firefox
                    setErrorMessage(
                        'Failed to load Movies. Error: ' + error.message
                    );
                }
            }

            setLoading(false);
        })(); // IIFE
    }, []);

    const moviesSorted = useMemo(() => {
        return sortMovies(
            genreOfInterest !== 'all'
                ? moviesCategorized[genreOfInterest]
                : movies
        );
    }, [genreOfInterest, moviesCategorized, movies, sortMovies]);

    return (
        <>
            <h2>20 Great Movies from '79-'99</h2>

            {loading && <img src={loadingGif} alt="loading" width="128" />}

            {errorMessage && <ErrorFeedback message={errorMessage} />}

            {!loading && !errorMessage && (
                <>
                    {moviesSorted.length === 0 && <b>No movies found!</b>}

                    {moviesSorted.length > 0 && (
                        <>
                            <div className="buttons-order-filter">
                                <button
                                    onClick={toggleDateOrder}
                                    className="btn-order"
                                    name="date-order"
                                >
                                    Release Date: {dateOrder}
                                </button>

                                <button
                                    value="all"
                                    onClick={() => {
                                        if (genreOfInterest !== 'all') {
                                            setGenreOfInterest('all');
                                        }
                                    }}
                                    className={
                                        genreOfInterest === 'all' ? 'on' : ''
                                    }
                                    name="genre"
                                >
                                    ALL Genres
                                </button>

                                {Object.keys(moviesCategorized).length > 0 &&
                                    Object.keys(moviesCategorized).map(
                                        (genre) => (
                                            <button
                                                value={genre}
                                                onClick={() => {
                                                    if (
                                                        genreOfInterest !==
                                                        genre
                                                    ) {
                                                        setGenreOfInterest(
                                                            genre
                                                        );
                                                    }
                                                }}
                                                className={
                                                    genreOfInterest === genre
                                                        ? 'on'
                                                        : ''
                                                }
                                                name="genre"
                                                key={`btn-${genre}`}
                                            >
                                                {genre}
                                            </button>
                                        )
                                    )}
                            </div>

                            <ol>
                                {moviesSorted.map((movie) => (
                                    <li key={movie.id}>
                                        <Movie id={movie.id} />
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}
                </>
            )}

            <Footer />
        </>
    );
};

export default Movies;
