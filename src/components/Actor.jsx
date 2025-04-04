import { useState, useEffect } from 'react';

import { Link } from "react-router-dom";

const Actor = ({actor, showActorsPic = false, displayLinks = false}) => {
    const BASE_URL_IMAGE = "http://image.tmdb.org/t/p/";
    const PROFILE_SIZE = "w92"; // w138_and_h175_face

    const [profileImage, setProfileImage] = useState(null);

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
        }
    };
        
    useEffect(
        () => {
            fetch(`https://api.themoviedb.org/3/person/${actor.id}/images`, options)
                .then(res => res.json())
                .then(res => { 
                    if (res.profiles && res.profiles.length > 0) {
                        setProfileImage( res.profiles[0].file_path );
                    }
                })
                .catch(err => console.error(err));
        },
        []
    );

    return (
        <li>
            { displayLinks ?
                <Link to={`/person/${actor.id}`}>
                    { actor.name }
                </Link>
                : actor.name
            }

            { showActorsPic && profileImage &&
                <img src={ BASE_URL_IMAGE + PROFILE_SIZE + profileImage} alt="Photo" />
            }
        </li>
    );
}

export default Actor;
