import { Route, Routes } from 'react-router-dom';
import Movies from './pages/Movies.jsx';
import Movie from './pages/Movie.jsx';
import Person from './pages/Person.jsx';
import PageNotFound from './pages/PageNotFound.jsx';

import './App.css';

function App() {
    return (
        <>
            <Routes>
                <Route exact path="/" element={<Movies />} />
                <Route path="/movie/:id" element={<Movie />} />
                <Route path="/person/:id" element={<Person />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    );
}

export default App;
