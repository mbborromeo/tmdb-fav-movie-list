import { useState, useEffect } from 'react';

import ifHttpStatusNotOK_throwErrorsAndExit from '../utils/fetch-utility';

import Movie from '../components/Movie';

const Movies = () => {
    const [moviesSorted, setMoviesSorted] = useState([]);

    useEffect(
      () => {
          const getMovies = async () => {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
                }
            };
          
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`,
                    options
                );

                ifHttpStatusNotOK_throwErrorsAndExit(response);

                // Promise resolved and HTTP status is successful
                const res = await response.json();

                if (res.results) {
                    const movies = res.results;

                    // sort by release date
                    const sorted = [...movies];
                    if (movies.length > 0) {
                        sorted.sort(
                            (a, b) =>
                                Date.parse(a.release_date) - Date.parse(b.release_date)
                        );
                    }

                    setMoviesSorted(sorted);
                }
            } catch (error) {
                // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
                console.error('Error:', error);
            }
          }

          getMovies();
      }, 
      []
    );

    return (
        <>
            <ol>
                { moviesSorted.length > 0 &&
                    moviesSorted.map((movie) => (
                        <li key={movie.id}>
                            <Movie id={movie.id} />
                        </li>
                    ))
                }
            </ol>
        </>
    );
};

export default Movies;
