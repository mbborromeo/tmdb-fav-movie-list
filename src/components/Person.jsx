import { Link } from 'react-router-dom';

import { BASE_URL_IMAGE } from '../utils/api';

const Person = ({
    person,
    movieId,
    genreFilter,
    dateOrder,
    showPic = false,
    displayLinks = false
}) => {
    const PROFILE_SIZE = 'w185'; // w92 w138_and_h175_face

    return (
        <div>
            {showPic && person.profile_path && (
                <img
                    src={BASE_URL_IMAGE + PROFILE_SIZE + person.profile_path}
                    alt="Photo"
                    width="164"
                    height="246"
                />
            )}

            {displayLinks ? (
                <Link
                    to={
                        genreFilter && dateOrder
                            ? `/person/${person.id}/?filter=${genreFilter}&order=${dateOrder}`
                            : genreFilter && !dateOrder
                              ? `/person/${person.id}?filter=${genreFilter}`
                              : !genreFilter && dateOrder
                                ? `/person/${person.id}?order=${dateOrder}`
                                : `/person/${person.id}`
                    }
                    state={{ movieId }}
                >
                    {person.name}
                </Link>
            ) : (
                person.name
            )}
        </div>
    );
};

export default Person;
