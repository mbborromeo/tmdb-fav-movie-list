import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState([]);

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
            console.log(res);
            setData(res);
          }
        ).catch(err => console.error(err));
    }, 
    []
  );  

  return (
    <>
      <h1>Vite + React</h1>
    </>
  )
}

export default App
