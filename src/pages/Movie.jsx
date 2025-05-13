import { useParams, useSearchParams, Link } from 'react-router-dom';

import Footer from '../components/Footer';
import MovieComponent from '../components/Movie';

const Movie = () => {
    const { id } = useParams();

    const [searchParams] = useSearchParams();
    const filter = searchParams.get('filter');
    const genreFilter = filter ? filter : null;
    const order = searchParams.get('order');
    const dateOrder = order ? order : null;

    return (
        <>
            <div>
                <Link
                    to={{
                        pathname: '/',
                        search: new URLSearchParams({
                            ...(genreFilter ? { filter: genreFilter } : {}),
                            ...(dateOrder ? { order: dateOrder } : {})
                        }).toString()
                    }}
                >
                    <b>&laquo;Back to Movies</b>
                </Link>
            </div>

            <div className="content-wrapper page">
                <MovieComponent
                    id={id}
                    page={true}
                    genreFilter={genreFilter}
                    dateOrder={dateOrder}
                />
            </div>

            <Footer />
        </>
    );
};

export default Movie;
