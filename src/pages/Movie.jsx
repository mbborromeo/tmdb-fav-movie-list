import { useEffect, useState } from 'react';
import {
    useParams,
    useLocation,
    useSearchParams,
    Link
} from 'react-router-dom';

import Trailer from '../components/Trailer';
import Credits from '../components/Credits';
import ErrorFeedback from '../components/ErrorFeedback';
import Footer from '../components/Footer';

import loadingGif from '../assets/images/gifer_loading_VAyR.gif';

import {
    fetchApiCallOrThrowError,
    BASE_URL,
    BASE_URL_IMAGE
} from '../utils/api';
import { formatRuntimeHoursAndMinutes } from '../utils/formatting';

const Movie = () => {
    const { id } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    let [searchParams] = useSearchParams();
    const filter = searchParams.get('filter');
    const genreFilter = filter ? filter : null;
    const order = searchParams.get('order');
    const dateOrder = order ? order : null;

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

    useEffect(() => {
        (async () => {
            if (!movie) {
                try {
                    const dataMovie = await fetchApiCallOrThrowError(
                        `${BASE_URL}/movie/${id}?language=en-US`
                    );
                    setMovie(dataMovie);
                } catch (error) {
                    // receive any error from fetchApiCallOrThrowError()
                    setErrorMessage(
                        'Failed to load Movie. Error: ' + error.message
                    );
                }
            }

            if (!directors || !actors) {
                try {
                    const dataCredits = await fetchApiCallOrThrowError(
                        `${BASE_URL}/movie/${id}/credits?language=en-US`
                    );
                    const arrayDirectors = dataCredits.crew.filter(
                        (person) => person.job === 'Director'
                    );
                    setDirectors(arrayDirectors);

                    const arrayActors = dataCredits.cast.filter(
                        (person) => person.order < MAX_ACTORS
                    );
                    setActors(arrayActors);
                } catch (error) {
                    // receive any error from fetchApiCallOrThrowError()
                    setErrorMessage(
                        'Failed to load Credits. Error: ' + error.message
                    );
                }
            }

            setLoading(false);
        })(); // IIFE
    }, [movie, directors, actors, id]);

    return (
        <>
            {loading && <img src={loadingGif} alt="loading" width="128" />}

            {!loading && (
                <div>
                    <div>
                        <Link
                            to={
                                genreFilter && dateOrder
                                    ? `/?filter=${genreFilter}&order=${dateOrder}`
                                    : genreFilter && !dateOrder
                                      ? `/?filter=${genreFilter}`
                                      : !genreFilter && dateOrder
                                        ? `/?order=${dateOrder}`
                                        : '/'
                            }
                        >
                            <b>&laquo;Back to Movies</b>
                        </Link>
                    </div>

                    {movie && (
                        <>
                            <h2>
                                {movie.title} (
                                {movie.release_date.split('-')[0]})
                            </h2>

                            <div className="row row-movie">
                                <img
                                    src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`}
                                    alt="Poster"
                                />

                                <Trailer id={id} />

                                <div className="description">
                                    <p>
                                        <em>{movie.tagline}</em>
                                    </p>

                                    <p>{movie.overview}</p>
                                </div>
                            </div>

                            <div>
                                <b>Genre: </b>{' '}
                                {movie.genres.map((genre, i) =>
                                    i < movie.genres.length - 1 ? (
                                        <span key={genre.id}>
                                            {genre.name},{' '}
                                        </span>
                                    ) : (
                                        <span key={genre.id}>{genre.name}</span>
                                    )
                                )}
                            </div>
                            <br />

                            <div>
                                <b>Runtime:</b>{' '}
                                {movie.runtime &&
                                    formatRuntimeHoursAndMinutes(movie.runtime)}
                            </div>
                            <br />

                            <Credits
                                directors={directors}
                                actors={actors}
                                showActorsPic={true}
                                displayLinks={true}
                                movieId={id}
                                genreFilter={genreFilter}
                                dateOrder={dateOrder}
                            />

                            <p>
                                <b>Stars:</b>{' '}
                                {Math.round(movie.vote_average * 2) / 2}
                                /10 ({movie.vote_count} votes)
                            </p>
                        </>
                    )}

                    {errorMessage && <ErrorFeedback message={errorMessage} />}
                </div>
            )}

            <Footer />
        </>
    );
};

export default Movie;
