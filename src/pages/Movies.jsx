import { useState, useEffect } from 'react'

const Movies = () => {
  const [data, setData] = useState([]);
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
            console.log('res', res);
            setData(res);
            return res;
          }
        ).then( 
          (res) => {
            const sorted = [...res.results];
            sorted.sort( (a, b) => Date.parse(a.release_date) - Date.parse(b.release_date) );
            console.log('sorted', sorted);
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

  useEffect(() => {
    // This will log whenever moviesSorted changes
    console.log('moviesSorted updated:', moviesSorted);
  }, [moviesSorted]); // Dependency array ensures this runs when moviesSorted changes


  return (
    <>
      {
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
      }

      <ol>
        {
          moviesSorted && moviesSorted.map( (movie) => (
            <li key={movie.id}>
              <div className="row">
                <img src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`} alt="Poster" />
                <div className="column">
                  <a href={`/movie/${movie.id}`} title={`${movie.original_title} - details`}>{movie.original_title} ({movie.release_date.split("-")[0]})</a>
                  <p>
                    {movie.overview}
                  </p>
                  <p>{ Math.round(movie.vote_average * 2)/2 }/10 from {movie.vote_count} votes</p>
                </div>
              </div>
            </li>
          ))
        }
      </ol>
    </>
  )
}

export default Movies;
