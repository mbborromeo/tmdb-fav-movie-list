import { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';

import Credits from './Credits';
import ErrorFeedback from './ErrorFeedback';
import Genres from './Genres';
import ReleaseInfo from './ReleaseInfo';
import Votes from './Votes';

import loadingGif from '../assets/images/gifer_loading_VAyR.gif';

import {
    fetchApiCallOrThrowError,
    BASE_URL,
    BASE_URL_IMAGE
} from '../utils/api';
import { formatRuntimeHoursAndMinutes } from '../utils/formatting';

const Movie = memo(({ id, genreFilter, dateOrder }) => {
    const [movie, setMovie] = useState(null);
    const [directors, setDirectors] = useState([]);
    const [writers, setWriters] = useState([]);
    const [novelists, setNovelists] = useState([]);
    const [actors, setActors] = useState([]);
    const [rating, setRating] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // https://developer.themoviedb.org/reference/configuration-details
    const POSTER_SIZE = 'w185'; // w154 w92
    const MAX_ACTORS = 8;

    useEffect(() => {
        (async () => {
            try {
                const [moviePromise, creditsPromise, releaseDataPromise] =
                    await Promise.allSettled([
                        fetchApiCallOrThrowError(
                            `${BASE_URL}/movie/${id}?language=en-US`
                        ),
                        fetchApiCallOrThrowError(
                            `${BASE_URL}/movie/${id}/credits?language=en-US`
                        ),
                        fetchApiCallOrThrowError(
                            `${BASE_URL}/movie/${id}/release_dates`
                        )
                    ]);

                // https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/

                if (moviePromise.status === 'rejected') {
                    console.error('Error:', moviePromise.reason);
                    setErrorMessage(
                        'Failed to load Movie. ' + moviePromise.reason
                    );
                }

                if (moviePromise.status === 'fulfilled') {
                    const movieResponse = moviePromise.value;
                    setMovie(movieResponse);
                }

                if (creditsPromise.status === 'rejected') {
                    console.error('Error:', creditsPromise.reason);
                    setErrorMessage(
                        'Failed to load Credits. ' + creditsPromise.reason
                    );
                }

                if (creditsPromise.status === 'fulfilled') {
                    const creditsResponse = creditsPromise.value;

                    const arrayDirectors = creditsResponse.crew.filter(
                        (person) => person.job === 'Director'
                    );
                    setDirectors(arrayDirectors);

                    const arrayWriters = creditsResponse.crew.filter(
                        (person) => person.job === 'Writer'
                    );
                    setWriters(arrayWriters);

                    const arrayNovelists = creditsResponse.crew.filter(
                        (person) => person.job === 'Novel'
                    );
                    setNovelists(arrayNovelists);

                    const arrayActors = creditsResponse.cast.filter(
                        (person) => person.order < MAX_ACTORS
                    );
                    setActors(arrayActors);
                }

                if (releaseDataPromise.status === 'rejected') {
                    console.error('Error:', releaseDataPromise.reason);
                    setErrorMessage(
                        'Failed to load Release Data. ' +
                            releaseDataPromise.reason
                    );
                }

                if (releaseDataPromise.status === 'fulfilled') {
                    const releaseDataResponse = releaseDataPromise.value;

                    let releaseDataOfInterest =
                        releaseDataResponse.results.find(
                            (country) => country['iso_3166_1'] === 'AU'
                        );
                    let releaseData = releaseDataOfInterest?.release_dates.find(
                        (rd) => rd['certification'] !== ''
                    );

                    if (!releaseDataOfInterest || !releaseData) {
                        releaseDataOfInterest =
                            releaseDataResponse.results.find(
                                (country) => country['iso_3166_1'] === 'US'
                            );
                        releaseData = releaseDataOfInterest?.release_dates.find(
                            (rd) => rd['certification'] !== ''
                        );
                    }

                    const movieCertification = releaseData?.certification;
                    if (movieCertification) {
                        setRating(movieCertification);
                    }
                }
            } catch (error) {
                // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
                console.error('Error:', error);
            }

            setLoading(false);
        })(); // IIFE
    }, [id]);

    return (
        <>
            {loading && <img src={loadingGif} alt="loading" width="32" />}

            {!loading && movie && (
                <div>
                    <h2 className="margin-bottom-none">
                        <Link
                            to={
                                genreFilter && dateOrder
                                    ? `/movie/${movie.id}/?filter=${genreFilter}&order=${dateOrder}`
                                    : genreFilter && !dateOrder
                                      ? `/movie/${movie.id}?filter=${genreFilter}`
                                      : !genreFilter && dateOrder
                                        ? `/movie/${movie.id}?order=${dateOrder}`
                                        : `/movie/${movie.id}`
                            }
                            state={{
                                movie,
                                directors,
                                writers,
                                novelists,
                                actors,
                                rating
                            }}
                        >
                            {movie.title}
                        </Link>

                        <ReleaseInfo releaseDate={movie.release_date} rating={rating} />
                    </h2>

                    <div className="row row-movie component">
                        <img
                            src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`}
                            alt="Poster"
                            width="185"
                            height="278"
                        />

                        <div className="data-column">
                            <Genres genres={movie.genres} />

                            <div>
                                <b>Runtime:</b>{' '}
                                {movie.runtime &&
                                    formatRuntimeHoursAndMinutes(movie.runtime)}
                            </div>

                            <Credits
                                directors={directors}
                                writers={writers}
                                novelists={novelists}
                                actors={actors}
                                actorsDisplayMaxThree={true}
                            />

                            <Votes
                                className="stars-voted" 
                                voteAverage={movie.vote_average} 
                                voteCount={movie.vote_count}
                            />

                            <div className="show-on-desktop">
                                <p>{movie.overview}</p>
                            </div>
                        </div>
                    </div>

                    <div className="show-on-mobile">
                        <p>{movie.overview}</p>
                    </div>
                </div>
            )}

            {errorMessage && <ErrorFeedback message={errorMessage} />}
        </>
    );
});

export default Movie;
