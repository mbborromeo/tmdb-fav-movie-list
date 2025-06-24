import { Link } from 'react-router-dom';

import ImageWrappingLoader from './ImageWrappingLoader';

import { BASE_URL_IMAGE } from '../utils/api';

const Person = ({
    person,
    showPic = false,
    character = '',
    displayLinks = false
}) => {
    const PROFILE_SIZE = 'w185'; // w92 w138_and_h175_face

    return (
        <div>
            {showPic && person.profile_path && (
                <ImageWrappingLoader
                    imageSrc={
                        BASE_URL_IMAGE + PROFILE_SIZE + person.profile_path
                    }
                    imageAlt="Photo"
                    className="image-wrapper"
                />
            )}

            {displayLinks ? (
                <>
                    <Link
                        to={{
                            pathname: `/person/${person.id}`
                        }}
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
