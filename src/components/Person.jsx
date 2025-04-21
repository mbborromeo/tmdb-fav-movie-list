import { Link } from 'react-router-dom';

import { BASE_URL_IMAGE } from '../utils/api';

const Person = ({
    person,
    movieId,
    showPic = false,
    displayLinks = false,
    key
}) => {
    const PROFILE_SIZE = 'w92'; // w138_and_h175_face

    return (
        <span key={key}>
            {displayLinks ? (
                <Link to={`/person/${person.id}`} state={{ movieId }}>
                    {person.name}
                </Link>
            ) : (
                person.name
            )}

            {showPic && person.profile_path && (
                <img
                    src={BASE_URL_IMAGE + PROFILE_SIZE + person.profile_path}
                    alt="Photo"
                />
            )}
        </span>
    );
};

export default Person;
