import { memo } from 'react';
import { Link } from 'react-router-dom';

import Credits from './Credits';
import ErrorFeedback from './ErrorFeedback';
import Genres from './Genres';
import ReleaseInfo from './ReleaseInfo';
import Votes from './Votes';
import Runtime from './Runtime';
import Trailer from './Trailer';
import ImageWrappingLoader from './ImageWrappingLoader';

import useFetchMovie from '../hooks/useFetchMovie';

import { BASE_URL_IMAGE } from '../utils/api';

const Movie = memo(({ id, page = false }) => {
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
            {!loading && (
                <>
                    {movie && (
                        <>
                            <h2>
                                {page ? (
                                    movie.title
                                ) : (
                                    <Link
                                        to={{
                                            pathname: `/movie/${movie.id}`
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
                                <ImageWrappingLoader
                                    imageSrc={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`}
                                    imageAlt="Poster"
                                    className={`image-wrapper${page ? ' show-on-desktop' : ''}`}
                                />

                                {page ? (
                                    <>
                                        <Trailer id={id} />

                                        <div className="description">
                                            <ImageWrappingLoader
                                                imageSrc={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`}
                                                imageAlt="Poster"
                                                className="image-wrapper show-on-mobile"
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
            )}
        </>
    );
});

export default Movie;
