import { useParams } from 'react-router-dom';

import MovieComponent from '../components/Movie';
import BackButton from '../components/BackButton';

const Movie = () => {
    const { id } = useParams();

    return (
        <>
            <div className="top-padding bottom-padding">
                <BackButton />
            </div>

            <div className="content-wrapper page">
                <MovieComponent id={id} page={true} />
            </div>
        </>
    );
};

export default Movie;
