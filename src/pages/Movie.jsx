import { useParams, useSearchParams, Link } from 'react-router-dom';

import Trailer from '../components/Trailer';
import Credits from '../components/Credits';
import ErrorFeedback from '../components/ErrorFeedback';
import Footer from '../components/Footer';
import Genres from '../components/Genres';
import ReleaseInfo from '../components/ReleaseInfo';
import Votes from '../components/Votes';
import Runtime from '../components/Runtime';

import useFetchMovie from '../hooks/useFetchMovie';

import loadingGif from '../assets/images/gifer_loading_VAyR.gif';

import { BASE_URL_IMAGE } from '../utils/api';

const Movie = () => {
    const { id } = useParams();

    const [searchParams] = useSearchParams();
    const filter = searchParams.get('filter');
    const genreFilter = filter ? filter : null;
    const order = searchParams.get('order');
    const dateOrder = order ? order : null;

    const POSTER_SIZE = 'w342'; /* w185 */

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

            {!loading && (
                <>
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
                        <div className="content-wrapper">
                            <h2>
                                {movie.title}

                                <ReleaseInfo
                                    releaseDate={movie.release_date}
                                    rating={rating}
                                />
                            </h2>

                            <div className="row row-movie page">
                                <img
                                    src={`${BASE_URL_IMAGE}${POSTER_SIZE}/${movie.poster_path}`}
                                    alt="Poster"
                                    width="338"
                                    height="508"
                                />

                                <Trailer id={id} />

                                <div className="description">
                                    <p>
                                        <em>{movie.tagline}</em>
                                    </p>

                                    <p>{movie.overview}</p>
                                </div>
                            </div>

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
                        </div>
                    )}

                    {errorMessage && <ErrorFeedback message={errorMessage} />}
                </>
            )}

            <Footer />
        </>
    );
};

export default Movie;
