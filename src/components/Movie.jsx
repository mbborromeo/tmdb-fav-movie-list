import { memo } from 'react';
import { Link } from 'react-router-dom';

import Credits from './Credits';
import ErrorFeedback from './ErrorFeedback';
import Genres from './Genres';
import ReleaseInfo from './ReleaseInfo';
import Votes from './Votes';
import Runtime from './Runtime';

import useFetchMovie from '../hooks/useFetchMovie';

import loadingGif from '../assets/images/gifer_loading_VAyR.gif';

import { BASE_URL_IMAGE } from '../utils/api';

const Movie = memo(({ id, genreFilter, dateOrder }) => {
    // https://developer.themoviedb.org/reference/configuration-details
    const POSTER_SIZE = 'w185'; // w154 w92

    const {
        loading,
        movie,
        directors,
        writers,
        novelists,
        actors,
        rating,
        errorMessage
    } = useFetchMovie(id);

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

                        <ReleaseInfo
                            releaseDate={movie.release_date}
                            rating={rating}
                        />
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

                            <Runtime runtime={movie.runtime} />

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
