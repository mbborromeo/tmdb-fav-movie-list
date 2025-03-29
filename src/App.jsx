import { Route, Routes } from 'react-router-dom';
import Movies from './pages/Movies.jsx';
import Movie from './pages/Movie.jsx';
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Movies />} />
        <Route path="/movie/:id" element={<Movie />} />
      </Routes>
    </>
  );
}

export default App
