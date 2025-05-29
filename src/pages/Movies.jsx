import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

import { fetchApiCallOrThrowError, BASE_URL } from '../utils/api';
import { ensureEnv } from '../utils/helper';
import { scrollToTop } from '../utils/scrollToTop';

import Movie from '../components/Movie';
import ErrorFeedback from '../components/ErrorFeedback';

import loadingGif from '../assets/images/gifer_loading_VAyR.gif';

const Movies = ({ templateRef }) => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessages, setErrorMessages] = useState([]);
    const [pageLoaded, setPageLoaded] = useState(false);

    const filterButtonsRef = useRef(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const filter = searchParams.get('filter') || null;
    const sortby = searchParams.get('sortby') || '';
    const order = searchParams.get('order') || null;

    const [selectedSortBy, setSelectedSortBy] = useState(sortby);

    const handleSelectChange = (event) => {
        const sortValue = event.target.value || '';
        setSelectedSortBy(sortValue);

        setSearchParams({
            ...(sortValue ? { sortby: sortValue } : {}),
            ...(filter ? { filter: filter } : {}),
            ...(order ? { order: order } : {})
        });
    };

    const accountID = ensureEnv('VITE_TMDB_ACCOUNT_ID');

    const sortMovies = useCallback(
        (moviesArray) => {
            // sort by release date
            const sorted = [...moviesArray];
            sorted.sort((a, b) => {
                if (!selectedSortBy) {
                    return !order
                        ? Date.parse(b.release_date) -
                              Date.parse(a.release_date)
                        : Date.parse(a.release_date) -
                              Date.parse(b.release_date);
                } else if (selectedSortBy === 'stars') {
                    return !order
                        ? b.vote_average - a.vote_average
                        : a.vote_average - b.vote_average;
                }
            });

            return sorted;
        },
        [order, selectedSortBy]
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

            // Scroll animates into view, but has bug which causes page to zoom in and scroll down
            // currentFilterButton.scrollIntoView({
            //     behavior: 'smooth',
            //     block: 'start',
            //     inline: 'start'
            // });

            // filterButtonsNode.scrollLeft = currentFilterButton.offsetLeft;

            filterButtonsNode.scrollTo({
                left: currentFilterButton.offsetLeft,
                behavior: 'smooth'
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
            filter !== null && Object.keys(moviesCategorized).length > 0
                ? moviesCategorized[filter]
                : movies
        );
    }, [filter, moviesCategorized, movies, sortMovies]);

    return (
        <>
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
                                <select
                                    value={selectedSortBy}
                                    onChange={handleSelectChange}
                                >
                                    <option value="">Date</option>
                                    <option value="stars">Stars</option>
                                    {/* <option value="runtime">Runtime</option> */}
                                </select>

                                <Link
                                    to={{
                                        pathname: '/',
                                        search: new URLSearchParams({
                                            ...(filter
                                                ? { filter: filter }
                                                : {}),
                                            ...(sortby
                                                ? { sortby: sortby }
                                                : {}),
                                            ...(!order
                                                ? { order: 'Ascending' }
                                                : {})
                                        }).toString()
                                    }}
                                    className="btn order"
                                    onClick={() => {
                                        const headerHeight =
                                            templateRef.current?.getHeaderHeight() ||
                                            0;
                                        scrollToTop(headerHeight);
                                    }}
                                >
                                    <span
                                        className={`icon order${!order ? '' : ' asc'}`}
                                    ></span>
                                </Link>

                                <div
                                    className="buttons-filter"
                                    ref={filterButtonsRef}
                                >
                                    {Object.keys(moviesCategorized).length >
                                        0 && (
                                        <>
                                            <Link
                                                to={{
                                                    pathname: '/',
                                                    search: new URLSearchParams(
                                                        {
                                                            ...(order
                                                                ? {
                                                                      order: order
                                                                  }
                                                                : {}),
                                                            ...(sortby
                                                                ? {
                                                                      sortby: sortby
                                                                  }
                                                                : {})
                                                        }
                                                    ).toString()
                                                }}
                                                onClick={() => {
                                                    const headerHeight =
                                                        templateRef.current?.getHeaderHeight() ||
                                                        0;
                                                    scrollToTop(headerHeight);
                                                }}
                                                className={
                                                    filter === null
                                                        ? 'btn on'
                                                        : 'btn'
                                                }
                                                key="btn-all"
                                            >
                                                ALL
                                                <span> ({movies.length})</span>
                                            </Link>

                                            {Object.keys(moviesCategorized).map(
                                                (genre) => (
                                                    <Link
                                                        to={{
                                                            pathname: '/',
                                                            search: new URLSearchParams(
                                                                {
                                                                    ...(genre
                                                                        ? {
                                                                              filter: genre
                                                                          }
                                                                        : {}),
                                                                    ...(sortby
                                                                        ? {
                                                                              sortby: sortby
                                                                          }
                                                                        : {}),
                                                                    ...(order
                                                                        ? {
                                                                              order: order
                                                                          }
                                                                        : {})
                                                                }
                                                            ).toString()
                                                        }}
                                                        onClick={() => {
                                                            const headerHeight =
                                                                templateRef.current?.getHeaderHeight() ||
                                                                0;
                                                            scrollToTop(
                                                                headerHeight
                                                            );
                                                        }}
                                                        className={
                                                            filter === genre
                                                                ? 'btn on'
                                                                : 'btn'
                                                        }
                                                        key={`btn-${genre}`}
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
                                                    </Link>
                                                )
                                            )}
                                        </>
                                    )}
                                </div>
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
        </>
    );
};

export default Movies;
