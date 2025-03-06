import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState([]);
  const [moviesSorted, setMoviesSorted] = useState([]);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNTY5ZWVhZjMzZWRlOGE0MjIxMjc3NmRmZDU5M2Y3OCIsIm5iZiI6MTc0MDM0NDU5MS42MDE5OTk4LCJzdWIiOiI2N2JiOGQwZmJmNTIxZjE5MGYwYTdlMDIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.DlkosZ7jr-U2IS5uC2nNj34zUQbVMcpoSoqaxvtt4Kg'
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
              <span>{movie.original_title} ({movie.release_date.split("-")[0]})</span>
            </li>
          ))
        }
      </ol>

    </>
  )
}

export default App
