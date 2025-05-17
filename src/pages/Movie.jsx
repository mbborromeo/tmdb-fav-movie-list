import { useParams, useSearchParams, Link } from 'react-router-dom';

import MovieComponent from '../components/Movie';
import BackButton from '../components/BackButton';

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
                <BackButton />
            </div>

            <div className="content-wrapper page">
                <MovieComponent
                    id={id}
                    page={true}
                    genreFilter={genreFilter}
                    dateOrder={dateOrder}
                />
            </div>
        </>
    );
};

export default Movie;
