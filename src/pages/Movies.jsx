import { useState, useEffect } from 'react';

import { fetchApiCallOrThrowError, BASE_URL } from '../utils/api';

import Movie from '../components/Movie';
import ErrorFeedback from '../components/ErrorFeedback';
import Footer from '../components/Footer';

const Movies = () => {
    const [moviesSorted, setMoviesSorted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        (async () => {
            try {
                // need to await here, since getMovies() is async returning a promise
                const data = await fetchApiCallOrThrowError(
                    `${BASE_URL}/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`
                );

                if (data && data.results) {
                    // data undefined if nothing returned from fetch
                    const movies = data.results;

                    // sort by release date
                    const sorted = [...movies];
                    if (movies.length > 0) {
                        sorted.sort(
                            (a, b) =>
                                Date.parse(a.release_date) -
                                Date.parse(b.release_date)
                        );
                    }

                    setMoviesSorted(sorted);
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

    return (
        <>
            <h2>20 Great Movies from '79-'99</h2>

            {loading && (
                <img
                    src="/images/gifer_loading_VAyR.gif"
                    alt="loading"
                    width="128"
                />
            )}

            {errorMessage && <ErrorFeedback message={errorMessage} />}

            {!loading && !errorMessage && (
                <>
                    {moviesSorted.length === 0 && <b>No movies found!</b>}

                    {moviesSorted.length > 0 && (
                        <ol>
                            {moviesSorted.map((movie) => (
                                <li key={movie.id}>
                                    <Movie id={movie.id} />
                                </li>
                            ))}
                        </ol>
                    )}
                </>
            )}

            <Footer />
        </>
    );
};

export default Movies;
