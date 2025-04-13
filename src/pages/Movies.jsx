import { useState, useEffect } from 'react';

import { getMovies } from '../utils/api';

import Movie from '../components/Movie';

const Movies = () => {
    const [moviesSorted, setMoviesSorted] = useState([]);

    useEffect(
      () => {
        (async () => {
            const res = await getMovies(); // need to await here, since getMovies() is async returning a promise
            
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
        })(); // IIFE
        
        // // Alternative approach: Resolve promise returned by getMovies() using then()
        // getMovies()
        //   .then( (res) => {
        //     if (res.results) {
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
