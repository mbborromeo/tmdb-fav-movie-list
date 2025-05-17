import { useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import Movies from './pages/Movies.jsx';
import Movie from './pages/Movie.jsx';
import Person from './pages/Person.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import PageTemplate from './components/PageTemplate.jsx';

import './App.css';

function App() {
    const templateRef = useRef(null);

    return (
        <PageTemplate ref={templateRef}>
            <Routes>
                <Route
                    exact
                    path="/"
                    element={<Movies templateRef={templateRef} />}
                />
                <Route path="/movie/:id" element={<Movie />} />
                <Route path="/person/:id" element={<Person />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </PageTemplate>
    );
}

export default App;
