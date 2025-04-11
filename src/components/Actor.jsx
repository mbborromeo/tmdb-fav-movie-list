import { Link } from 'react-router-dom';

const Actor = ({ actor, showActorsPic = false, displayLinks = false }) => {
    const BASE_URL_IMAGE = 'http://image.tmdb.org/t/p/';
    const PROFILE_SIZE = 'w92'; // w138_and_h175_face

    return (
        <li>
            {displayLinks ? (
                <Link to={`/person/${actor.id}`}>{actor.name}</Link>
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
