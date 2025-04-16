import { Link } from 'react-router-dom';

import { BASE_URL_IMAGE } from '../utils/api';

const Actor = ({ actor, movieId, showActorsPic = false, displayLinks = false }) => {
    const PROFILE_SIZE = 'w92'; // w138_and_h175_face

    return (
        <li>
            {displayLinks ? (
                <Link to={`/person/${actor.id}`} state={{ movieId }}>{actor.name}</Link>
            ) : (
                actor.name
            )}

            {showActorsPic && actor.profile_path && (
                <img
                    src={BASE_URL_IMAGE + PROFILE_SIZE + actor.profile_path}
                    alt="Photo"
                />
            )}
        </li>
    );
};

export default Actor;
