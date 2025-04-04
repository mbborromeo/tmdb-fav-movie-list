import { useState, useEffect } from 'react'

import Movie from '../components/Movie';

const Movies = () => {
  const [moviesSorted, setMoviesSorted] = useState([]);

  const TMDB_ACCOUNT_ID = 21839127;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
  };
  
  useEffect( 
    () => {
      fetch(`https://api.themoviedb.org/3/account/${TMDB_ACCOUNT_ID}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`, options)
        .then(res => res.json())
        .then( 
          (res) => {
            const sorted = [...res.results];
            sorted.sort( (a, b) => Date.parse(a.release_date) - Date.parse(b.release_date) );
            setMoviesSorted( sorted );
          }
        )
        .catch(err => console.error(err));
    }, 
    []
  );  

  return (
    <>
      <ol>
        {
          moviesSorted && moviesSorted.map( (movie) => (
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
