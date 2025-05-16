import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchApiCallOrThrowError, BASE_URL } from '../utils/api';
import { ensureEnv } from '../utils/helper';
import { scrollToTop } from '../utils/scrollToTop';

import Movie from '../components/Movie';
import ErrorFeedback from '../components/ErrorFeedback';
import PageTemplate from '../components/PageTemplate';

import loadingGif from '../assets/images/gifer_loading_VAyR.gif';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessages, setErrorMessages] = useState([]);
    const [pageLoaded, setPageLoaded] = useState(false);

    const filterButtonsRef = useRef(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const filter = searchParams.get('filter');
    const genreFilter = filter ? filter : null;
    const order = searchParams.get('order');
    const dateOrder = order ? order : null;

    const accountID = ensureEnv('VITE_TMDB_ACCOUNT_ID');

    const sortMovies = useCallback(
        (moviesArray) => {
            // sort by release date
            const sorted = [...moviesArray];
            sorted.sort((a, b) =>
                !dateOrder
                    ? Date.parse(a.release_date) - Date.parse(b.release_date)
                    : Date.parse(b.release_date) - Date.parse(a.release_date)
            );

            return sorted;
        },
        [dateOrder]
    );

    const getMoviesCategorized = useCallback((moviesArray, movieGenres) => {
        const moviesByGenre = {};

        // organize movies by genre
        moviesArray.forEach((movie) =>
            movie['genre_ids'].forEach((gid) => {
                let genre = movieGenres.find((obj) => obj.id === gid)['name'];

                // Abbreviate "Science Fiction" genre for button
                if (genre === 'Science Fiction') {
                    genre = 'Sci-Fi';
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
    }, []);

    const handleClickOrder = useCallback(
        (value) => {
            const newValue = !value ? 'Descending' : null;

            scrollToTop();

            setSearchParams({
                ...(genreFilter && { filter: genreFilter }),
                ...(newValue && { order: newValue })
            });
        },
        [genreFilter, setSearchParams]
    );

    const handleClickFilter = useCallback(
        (value) => {
            const newValue = !value ? null : value;

            scrollToTop();

            setSearchParams({
                ...(newValue && { filter: newValue }),
                ...(dateOrder && { order: dateOrder })
            });
        },
        [dateOrder, setSearchParams]
    );

    const handleLoad = useCallback(() => {
        setPageLoaded(true);
    }, []);

    // Resource: https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event#checking_whether_loading_is_already_complete
    useEffect(() => {
        if (document.readyState !== 'complete') {
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        } else {
            handleLoad();
        }
    }, [handleLoad]);

    useEffect(() => {
        /* scroll to selected filter button after page has loaded AND fetch call is not loading */

        if (!loading && pageLoaded && filterButtonsRef.current) {
            // Resource: https://medium.com/@ryan_forrester_/javascript-scroll-to-anchor-fast-easy-guide-48dde5878fbe
            const filterButtonsNode = filterButtonsRef.current;
            const currentFilterButton =
                filterButtonsNode.querySelector('.btn.on');

            currentFilterButton.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'start' // nearest
            });
        }
    }, [loading, pageLoaded]);

    useEffect(() => {
        (async () => {
            const errorsArray = [];

            try {
                const [genresPromise, moviesPromise] = await Promise.allSettled(
                    [
                        fetchApiCallOrThrowError(
                            `${BASE_URL}/genre/movie/list?language=en`
                        ),
                        fetchApiCallOrThrowError(
                            `${BASE_URL}/account/${accountID}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`
                        )
                    ]
                );

                if (genresPromise.status === 'rejected') {
                    console.error('Error:', genresPromise.reason);
                    errorsArray.push(
                        'Failed to load Genres. Error: ' + genresPromise.reason
                    );
                }

                if (genresPromise.status === 'fulfilled') {
                    const genresResponse = genresPromise.value;

                    if (
                        genresResponse &&
                        genresResponse.genres &&
                        genresResponse.genres.length > 0
                    ) {
                        // genresResponse undefined if nothing returned from fetch
                        setGenres(genresResponse.genres);
                    }
                }

                if (moviesPromise.status === 'rejected') {
                    console.error('Error:', moviesPromise.reason);
                    errorsArray.push(
                        'Failed to load Movies. Error: ' + moviesPromise.reason
                    );
                }

                if (moviesPromise.status === 'fulfilled') {
                    const moviesResponse = moviesPromise.value;

                    if (
                        moviesResponse &&
                        moviesResponse.results &&
                        moviesResponse.results.length > 0
                    ) {
                        // moviesResponse undefined if nothing returned from fetch
                        setMovies(moviesResponse.results);
                    }
                }
            } catch (error) {
                // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
                console.error('Error:', error);
                errorsArray.push('Promise rejected. Error: ' + error.message);
            }

            if (errorsArray.length > 0) {
                setErrorMessages(errorsArray);
            }

            setLoading(false); // after both genres and movies have been fetched
        })(); // IIFE
    }, [accountID]);

    const moviesCategorized = useMemo(() => {
        return movies.length > 0 && genres.length > 0
            ? getMoviesCategorized(movies, genres)
            : {};
    }, [movies, genres, getMoviesCategorized]);

    const moviesSorted = useMemo(() => {
        // need to check if moviesCategorized has been calculated yet
        return sortMovies(
            genreFilter !== null && Object.keys(moviesCategorized).length > 0
                ? moviesCategorized[genreFilter]
                : movies
        );
    }, [genreFilter, moviesCategorized, movies, sortMovies]);

    return (
        <PageTemplate>
            {loading && <img src={loadingGif} alt="loading" width="32" />}

            {errorMessages.length > 0 && (
                <ErrorFeedback errors={errorMessages} />
            )}

            {!loading && (
                <>
                    {moviesSorted.length === 0 &&
                        errorMessages.length === 0 && <b>No movies found!</b>}

                    {moviesSorted.length > 0 && (
                        <>
                            <div className="buttons-wrapper">
                                <button
                                    type="button"
                                    className="btn order"
                                    name="btn-order"
                                    value={dateOrder}
                                    onClick={(e) => {
                                        handleClickOrder(e.target.value);
                                    }}
                                >
                                    Date Order
                                    <span
                                        className={`icon order${!dateOrder ? '' : ' desc'}`}
                                    ></span>
                                </button>

                                <div
                                    className="buttons-filter"
                                    ref={filterButtonsRef}
                                >
                                    {Object.keys(moviesCategorized).length >
                                        0 && (
                                        <>
                                            <button
                                                type="button"
                                                name="btn-all"
                                                value={null}
                                                onClick={(e) => {
                                                    handleClickFilter(
                                                        e.target.value
                                                    );
                                                }}
                                                className={
                                                    genreFilter === null
                                                        ? 'btn on'
                                                        : 'btn'
                                                }
                                            >
                                                ALL
                                                <span>
                                                    {' '}
                                                    (
                                                    {
                                                        movies.length
                                                    }
                                                    )
                                                </span>
                                            </button>

                                            {Object.keys(moviesCategorized).map(
                                                (genre) => (
                                                    <button
                                                        type="button"
                                                        name={`btn-${genre}`}
                                                        key={`btn-${genre}`}
                                                        value={genre}
                                                        onClick={(e) => {
                                                            handleClickFilter(
                                                                e.target.value
                                                            );
                                                        }}
                                                        className={
                                                            genreFilter ===
                                                            genre
                                                                ? 'btn on'
                                                                : 'btn'
                                                        }
                                                    >
                                                        {genre}
                                                        <span>
                                                            {' '}
                                                            (
                                                            {
                                                                moviesCategorized[
                                                                    genre
                                                                ].length
                                                            }
                                                            )
                                                        </span>
                                                    </button>
                                                )
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <ol>
                                {moviesSorted.map((movie) => (
                                    <li key={movie.id}>
                                        <Movie
                                            id={movie.id}
                                            genreFilter={genreFilter}
                                            dateOrder={dateOrder}
                                        />
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}
                </>
            )}
        </PageTemplate>
    );
};

export default Movies;
