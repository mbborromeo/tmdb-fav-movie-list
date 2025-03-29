import { useState, useEffect } from 'react';

const Actor = ({actor}) => {
    const BASE_URL_IMAGE = "http://image.tmdb.org/t/p/";
    const PROFILE_SIZE = "w138_and_h175_face/";

    const [profileImage, setProfileImage] = useState(null);

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
        }
    };
        
    useEffect(
        () => {
            fetch(`https://api.themoviedb.org/3/person/${actor.id}/images`, options)
                .then(res => res.json())
                .then(res => { 
                    console.log('actor images:', res);

                    if (res.profiles.length > 0) {
                        setProfileImage( res.profiles[0].file_path );
                    }
                })
                .catch(err => console.error(err));
        },
        []
    );

    return (
        <li key={actor.id}>
            {actor.name}
            <img src={ BASE_URL_IMAGE + PROFILE_SIZE + profileImage} alt={`${actor.name}'s profile pic`} />
        </li>
    );
}

export default Actor;
