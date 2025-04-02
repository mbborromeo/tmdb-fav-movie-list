import { useState, useEffect } from 'react'

import Movie from '../components/Movie';

const Movies = () => {
  const [moviesSorted, setMoviesSorted] = useState([]);

  // https://developer.themoviedb.org/reference/configuration-details
  const BASE_URL_IMAGE = "http://image.tmdb.org/t/p/";
  const POSTER_SIZE = "w92";

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
    }
  };
  
  useEffect( 
    () => {
      fetch('https://api.themoviedb.org/3/account/21839127/favorite/movies?language=en-US&page=1&sort_by=created_at.asc', options)
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
