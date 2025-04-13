import { useState, useEffect } from 'react';

import { fetchApiCallOrThrowError, BASE_URL } from '../utils/api';

import Movie from '../components/Movie';

const Movies = () => {
    const [moviesSorted, setMoviesSorted] = useState([]);

    useEffect(
      () => {
        (async () => {
            // need to await here, since getMovies() is async returning a promise
            const data = await fetchApiCallOrThrowError(`${BASE_URL}/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`); 

            if (data.results) {
                const movies = data.results;

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
        })(); // IIFE
        
        // // Alternative approach: Resolve promise returned by getMovies() using then()
        // getMovies()
        //   .then( (data) => {
        //     if (data.results) {
        //         ...
        //     }
        //   });
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

            <span>
              This website uses <a href="https://www.themoviedb.org" target="_blank">TMDB</a> and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
            </span>
        </>
    );
};

export default Movies;
