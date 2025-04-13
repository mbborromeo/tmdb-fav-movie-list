import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import Trailer from '../components/Trailer';
import Credits from '../components/Credits';

import { fetchApiCall, BASE_URL, BASE_URL_IMAGE } from '../utils/api';
import { formatRuntimeHoursAndMinutes } from '../utils/formatting';

const Movie = () => {
    const { id } = useParams();
    const location = useLocation();

    // location.state will be null if Movie page is opened in a new tab
    const [movie, setMovie] = useState(
        location.state ? location.state.movie : null
    );
    const [directors, setDirectors] = useState(
        location.state ? location.state.directors : null
    );
    const [actors, setActors] = useState(
        location.state ? location.state.actors : null
    );

    const POSTER_SIZE = 'w185';
    const MAX_ACTORS = 6;

    useEffect(
        () => {
            (async () => {
                if (!movie) {
                    const res = await fetchApiCall(`${BASE_URL}/movie/${id}?language=en-US`);
                    setMovie(res);
                }

                if (!directors || !actors) {
                    const res = await fetchApiCall(`${BASE_URL}/movie/${id}/credits?language=en-US`);
                    const directorsArray = res.crew.filter(
                        (person) => person.job === 'Director'
                    );
                    setDirectors(directorsArray);
        
                    const actorsArray = res.cast.filter(
                        (person) => person.order < MAX_ACTORS
                    );
                    setActors(actorsArray);
                }
            })(); // IIFE
        }, 
        [movie, directors, actors, id]
    );

    return (
        <>
            {movie && (
                <div>
                    <h2>
                        {movie.title} ({movie.release_date.split('-')[0]})
                    </h2>
                    <img
                        src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`}
                        alt="Poster"
                    />
                    <p>{movie.overview}</p>
                    <p>
                        <b>Stars:</b> {Math.round(movie.vote_average * 2) / 2}
                        /10 (from {movie.vote_count} votes)
                    </p>

                    <span>
                        <b>Genre:</b>
                        <ul>
                            {movie.genres &&
                                movie.genres.map((genre) => (
                                    <li key={genre.id}>{genre.name}</li>
                                ))}
                        </ul>
                    </span>

                    <p>
                        <b>Runtime:</b>{' '}
                        {movie.runtime &&
                            formatRuntimeHoursAndMinutes(movie.runtime)}
                    </p>

                    <Credits
                        directors={directors}
                        actors={actors}
                        showActorsPic={true}
                        displayLinks={true}
                    />

                    <Trailer id={id} />
                </div>
            )}
        </>
    );
};

export default Movie;
