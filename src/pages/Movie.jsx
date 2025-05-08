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

    const urlParamsString =
        genreFilter && dateOrder
            ? `?filter=${genreFilter}&order=${dateOrder}`
            : genreFilter && !dateOrder
              ? `?filter=${genreFilter}`
              : !genreFilter && dateOrder
                ? `?order=${dateOrder}`
                : '';

    return (
        <>
            <div>
                <Link to={`/${urlParamsString}`}>
                    <b>&laquo;Back to Movies</b>
                </Link>
            </div>

            <MovieComponent
                id={id}
                page={true}
                genreFilter={genreFilter}
                dateOrder={dateOrder}
            />

            <Footer />
        </>
    );
};

export default Movie;
