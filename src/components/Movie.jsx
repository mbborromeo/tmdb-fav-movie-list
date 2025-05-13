import { memo } from 'react';
import { Link } from 'react-router-dom';

import Credits from './Credits';
import ErrorFeedback from './ErrorFeedback';
import Genres from './Genres';
import ReleaseInfo from './ReleaseInfo';
import Votes from './Votes';
import Runtime from './Runtime';
import Trailer from './Trailer';

import useFetchMovie from '../hooks/useFetchMovie';

import loadingGif from '../assets/images/gifer_loading_VAyR.gif';

import { BASE_URL_IMAGE } from '../utils/api';

const Movie = memo(({ id, genreFilter, dateOrder, page = false }) => {
    // https://developer.themoviedb.org/reference/configuration-details
    const POSTER_SIZE = page ? 'w342' : 'w185'; // w154 w92

    const {
        loading,
        movie,
        directors,
        writers,
        novelists,
        actors,
        rating,
        errorMessages
    } = useFetchMovie(id);

    return (
        <>
            {loading && <img src={loadingGif} alt="loading" width="32" />}

            {!loading && movie && (
                <>
                    <h2 className="margin-bottom-none">
                        {page ? (
                            movie.title
                        ) : (
                            <Link
                                to={{
                                    pathname: `/movie/${movie.id}`,
                                    search: new URLSearchParams({
                                        ...(genreFilter
                                            ? { filter: genreFilter }
                                            : {}),
                                        ...(dateOrder
                                            ? { order: dateOrder }
                                            : {})
                                    }).toString()
                                }}
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
                        )}

                        <ReleaseInfo
                            releaseDate={movie.release_date}
                            rating={rating}
                        />
                    </h2>

                    <div className="row row-movie">
                        <img
                            className={page ? ' show-on-desktop' : ''}
                            src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`}
                            alt="Poster"
                            width={page ? '338' : '185'}
                            height={page ? '508' : '278'}
                        />

                        {page ? (
                            <>
                                <Trailer id={id} />

                                <div className="description">
                                    <img
                                        className="show-on-mobile"
                                        src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`}
                                        alt="Poster"
                                        width={page ? '338' : '185'}
                                        height={page ? '508' : '278'}
                                    />

                                    <p>
                                        <em>{movie.tagline}</em>
                                    </p>

                                    <p>{movie.overview}</p>
                                </div>
                            </>
                        ) : (
                            <div className="data-column">
                                <Genres genres={movie.genres} />

                                <Runtime runtime={movie.runtime} />

                                <Credits
                                    directors={directors}
                                    writers={writers}
                                    novelists={novelists}
                                    actors={actors}
                                    actorsDisplayMaxThree={true}
                                    genreFilter={genreFilter}
                                    dateOrder={dateOrder}
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
                        )}
                    </div>

                    {page ? (
                        <>
                            <Genres genres={movie.genres} />

                            <Runtime runtime={movie.runtime} />

                            <Credits
                                directors={directors}
                                writers={writers}
                                novelists={novelists}
                                actors={actors}
                                showActorsPic={true}
                                displayLinks={true}
                                movieId={id}
                                genreFilter={genreFilter}
                                dateOrder={dateOrder}
                            />

                            <Votes
                                voteAverage={movie.vote_average}
                                voteCount={movie.vote_count}
                            />
                        </>
                    ) : (
                        <div className="show-on-mobile">
                            <p>{movie.overview}</p>
                        </div>
                    )}
                </>
            )}

            {errorMessages.length > 0 && (
                <ErrorFeedback errors={errorMessages} />
            )}
        </>
    );
});

export default Movie;
