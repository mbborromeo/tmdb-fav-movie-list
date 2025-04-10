import { useState, useEffect, useMemo, useCallback } from 'react'

import Movie from '../components/Movie';

const Movies = () => {
  const [movies, setMovies] = useState([]);

  const TMDB_ACCOUNT_ID = 21839127;

  const options = useMemo(() => ({
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
        }
    }),
    []
  );

  const getMovies = useCallback( 
    async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/account/${TMDB_ACCOUNT_ID}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`, options);

        if (response.ok) {
          console.log('Promise resolved and HTTP status is successful');
          const res = await response.json();

          if (res.results) {
            setMovies(res.results);
          }
        } else {
          console.error('Promise resolved but HTTP status failed');

          if (response.status === 404) {
            throw new Error('404, Not found');
          }

          if (response.status === 500) {
            throw new Error('500, internal server error');
          }

          throw new Error(response.status);
        }
      } catch (error) {
        // Promise rejected: Network or CORS issues
        // OR output thrown Errors from try statement above
        console.error('Error:', error);
      }
    }, 
    [options]
  );
  
  useEffect( 
    () => {
      getMovies();
    }, 
    [getMovies]
  );  

  // Memoize sorted movies to avoid unnecessary re-renders
  const moviesSorted = useMemo(() => {
    const sorted = [...movies];
    if (movies.length > 0) {
      sorted.sort( (a, b) => Date.parse(a.release_date) - Date.parse(b.release_date) );
    }

    return sorted;
  }, [movies]);

  return (
    <>
      <ol>
        {
          movies.length > 0 && moviesSorted.length > 0 && moviesSorted.map( (movie) => (
            <li key={movie.id}>
              <Movie id={movie.id} />
            </li>
          ))
        }
      </ol>
    </>
  )
}

export default Movies;
