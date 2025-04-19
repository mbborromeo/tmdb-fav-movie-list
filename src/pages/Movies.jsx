import { useState, useEffect } from 'react';

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

    const sortMovies = (moviesArray) => {
        // sort by release date
        const sorted = [...moviesArray];
        if (moviesArray.length > 1) {
            sorted.sort((a, b) =>
                dateOrder === 'ascending'
                    ? Date.parse(a.release_date) - Date.parse(b.release_date)
                    : Date.parse(b.release_date) - Date.parse(a.release_date)
            );
        }

        return sorted;
    };

    const toggleDateOrder = () => {
        if (dateOrder === 'ascending') {
            setDateOrder('descending');
        } else {
            setDateOrder('ascending');
        }
    };

    useEffect(() => {
        (async () => {
            try {
                // need to await here, since fetchApiCallOrThrowError() is async returning a promise
                const data = await fetchApiCallOrThrowError(
                    `${BASE_URL}/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`
                );

                if (data && data.results && data.results.length > 0) {
                    // data undefined if nothing returned from fetch
                    setMovies(data.results);
                }
            } catch (error) {
                // receive any error from fetchApiCallOrThrowError()
                // console.log("fileName", error.fileName); // only works in Firefox
                setErrorMessage(
                    'Failed to load Movies. Error: ' + error.message
                );
            }

            setLoading(false);
        })(); // IIFE
    }, []);

    const moviesSorted = sortMovies(movies);

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
                            <button
                                onClick={toggleDateOrder}
                                className="btn-order"
                            >
                                Release Date: {dateOrder}
                            </button>

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
