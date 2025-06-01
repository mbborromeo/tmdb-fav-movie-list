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
    const decade = searchParams.get('decade') || '1990';

    const scrollToTopOffsetHeader = () => {
        const headerHeight = templateRef.current?.getHeaderHeight() || 0;
        scrollToTop(headerHeight);
    };

    const scrollToCurrentFilterButton = useCallback((ref) => {
        const filterButtonsNode = ref;
        const currentFilterButton = filterButtonsNode.querySelector('.btn.on');

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
    }, []);

    const handleSelectChange = (event) => {
        const sortValue = event.target.value || '';

        scrollToTopOffsetHeader();

        setSearchParams({
            ...(decade ? { decade: decade } : {}),
            ...(filter ? { filter: filter } : {}),
            ...(sortValue ? { sortby: sortValue } : {}),
            ...(order ? { order: order } : {})
        });
    };

    const handleClickButtonOrder = () => {
        scrollToTopOffsetHeader();

        setSearchParams({
            ...(decade ? { decade: decade } : {}),
            ...(filter ? { filter: filter } : {}),
            ...(sortby ? { sortby: sortby } : {}),
            ...(!order ? { order: 'Ascending' } : {})
        });
    };

    const handleRangeSelection = (event) => {
        const selectedDecade = event.target.value;

        scrollToTopOffsetHeader();

        setSearchParams({
            ...{ decade: selectedDecade },
            ...(sortby ? { sortby: sortby } : {}),
            ...(order ? { order: order } : {})
        });
    };

    const listID_80s = ensureEnv('VITE_TMDB_LIST_ID_80S');
    const listID_90s = ensureEnv('VITE_TMDB_LIST_ID_90S');
    const listID_00s = ensureEnv('VITE_TMDB_LIST_ID_00S');

    const sortMovies = useCallback(
        (moviesArray) => {
            // sort by release date
            const sorted = [...moviesArray];
            sorted.sort((a, b) => {
                if (!sortby) {
                    return !order
                        ? Date.parse(b.release_date) -
                              Date.parse(a.release_date)
                        : Date.parse(a.release_date) -
                              Date.parse(b.release_date);
                } else if (sortby === 'stars') {
                    return !order
                        ? b.vote_average - a.vote_average
                        : a.vote_average - b.vote_average;
                } else if (sortby === 'votes') {
                    return !order
                        ? b.vote_count - a.vote_count
                        : a.vote_count - b.vote_count;
                }
            });

            return sorted;
        },
        [order, sortby]
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

            scrollToCurrentFilterButton(filterButtonsRef.current);
        }
    }, [loading, pageLoaded, scrollToCurrentFilterButton]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const errorsArray = [];

            const getListID = () => {
                let id;
                switch (decade) {
                    case '1980':
                        id = listID_80s;
                        break;
                    case '2000':
                        id = listID_00s;
                        break;
                    default:
                        id = listID_90s;
                }
                return id;
            };

            const listID = getListID();

            try {
                const [genresPromise, moviesPromise] = await Promise.allSettled(
                    [
                        fetchApiCallOrThrowError(
                            `${BASE_URL}/genre/movie/list?language=en`
                        ),
                        fetchApiCallOrThrowError(
                            `${BASE_URL}/list/${listID}?language=en-US&page=1&sort_by=created_at.asc`
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
                        moviesResponse.items &&
                        moviesResponse.items.length > 0
                    ) {
                        setMovies(moviesResponse.items);
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
    }, [decade, listID_80s, listID_90s, listID_00s]);

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
            <div className="range-wrapper">
                <div className="slider-row">
                    <span>80's</span>
                    <input
                        type="range"
                        id="decade"
                        name="decade"
                        list="values"
                        min="1980"
                        max="2000"
                        step="10"
                        value={decade}
                        onChange={handleRangeSelection}
                    />
                    <span>00's</span>
                </div>
                <datalist id="values">
                    <option
                        value="1980"
                        // label="80's"
                    ></option>
                    <option
                        value="1990"
                        // label="90's"
                    ></option>
                    <option
                        value="2000"
                        // label="00's"
                    ></option>
                </datalist>
            </div>

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
                            {/* <div className="stick-to-top"> */}
                            <div className="buttons-wrapper">
                                <select
                                    value={sortby}
                                    onChange={handleSelectChange}
                                >
                                    <option value="">Date</option>
                                    <option value="stars">Stars</option>
                                    <option value="votes">Votes</option>
                                </select>

                                <button
                                    type="button"
                                    className="btn order"
                                    onClick={handleClickButtonOrder}
                                >
                                    <span
                                        className={`icon${!order ? '' : ' asc'}`}
                                    ></span>
                                </button>

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
                                                            ...(decade
                                                                ? {
                                                                      decade: decade
                                                                  }
                                                                : {}),
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
                                                onClick={
                                                    scrollToTopOffsetHeader
                                                }
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
                                                                    ...(decade
                                                                        ? {
                                                                              decade: decade
                                                                          }
                                                                        : {}),
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
                                                        onClick={
                                                            scrollToTopOffsetHeader
                                                        }
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
                            {/* </div> */}

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
