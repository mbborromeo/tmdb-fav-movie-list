import { useState, useEffect } from 'react'

// import Genres from '../components/Genres';
import Movie from '../components/Movie';

const Movies = () => {
  // const [data, setData] = useState([]);
  const [moviesSorted, setMoviesSorted] = useState([]);
  // const [genreLookup, setGenreLookup] = useState([]);

  console.log('moviesSorted', moviesSorted);

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
        // .then(
        //   (res) => {
        //     setData(res);
        //     return res;
        //   }
        // )
        .then( 
          (res) => {
            const sorted = [...res.results];
            sorted.sort( (a, b) => Date.parse(a.release_date) - Date.parse(b.release_date) );
            setMoviesSorted( sorted );
          }
        )
        // .then( 
        //   () => {
        //     console.log('moviesSorted', moviesSorted); // why is this an empty array?
        //   }
        // )
        .catch(err => console.error(err));
    }, 
    []
  );  

  // useEffect( 
  //   () => {
  //     fetch(`https://api.themoviedb.org/3/genre/movie/list?language=en`, options)
  //       .then(res => res.json())
  //       .then(
  //         (res) => {
  //           setGenreLookup(res.genres);
  //         }
  //       )
  //       .catch(err => console.error(err));
  //   }, 
  //   []
  // );  

//   useEffect(() => {
//       console.log('moviesSorted updated:', moviesSorted);
//     }, 
//     [moviesSorted]
//   );

  return (
    <>
      {/* {
        data && data.page && data.total_pages &&
        <span>
          Page { data.page } / { data.total_pages }.
        </span> 
      }

      {
        data && data.total_results &&
        <span>
          Results: { data.total_results }
        </span> 
      } */}

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
