import { Link } from 'react-router-dom';

import { BASE_URL_IMAGE } from '../utils/api';

const Person = ({
    person,
    movieId,
    genreFilter,
    dateOrder,
    showPic = false,
    character = '',
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
                <>
                    <Link
                        to={{
                            pathname: `/person/${person.id}`,
                            search: new URLSearchParams({
                                ...(genreFilter ? { filter: genreFilter } : {}),
                                ...(dateOrder ? { order: dateOrder } : {})
                            }).toString()
                        }}
                        state={{ movieId }}
                    >
                        {person.name}
                    </Link>
                    {character && <span>{` (${person.character})`}</span>}
                </>
            ) : (
                person.name
            )}
        </div>
    );
};

export default Person;
