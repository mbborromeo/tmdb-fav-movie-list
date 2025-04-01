import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const Person = () => {
    const { id } = useParams();

    const [moviesCastedFor, setMoviesCastedFor] = useState([]);
    const [person, setPerson] = useState(null);

    const BASE_URL_IMAGE = "http://image.tmdb.org/t/p/";
    const PROFILE_SIZE = "w138_and_h175_face/";
  
    const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
      }
    };

    useEffect(
        () => {
            fetch(`https://api.themoviedb.org/3/person/${ id }/movie_credits?language=en-US`, options)
                .then(res => res.json())
                .then(
                    (res) => {
                        console.log('movie_credits:', res);

                        const moviesCastedOn = [];

                        if (res.cast && res.cast.length > 0) {
                            moviesCastedOn.push( res.cast[0] );
                            setMoviesCastedFor( moviesCastedOn );
                        }
                    }
                )
                .catch(err => console.error(err));
        }, 
        []
    );

    useEffect(
        () => {
            fetch(`https://api.themoviedb.org/3/person/${ id }?language=en-US`, options)
                .then(res => res.json())
                .then(
                    (res) => {
                        console.log('Person Details:', res);
                        setPerson(res);
                    }
                )
                .catch(err => console.error(err));
        }, 
        []
    );

    return (
        <>
            { person && 
                <>
                    <p>Name: {person.name}</p>
                    <p>Biography: {person.biography}</p>
                    <p>Known for department: {person.known_for_department}</p>
                    { person.profile_path &&
                        <img src={ BASE_URL_IMAGE + PROFILE_SIZE + person.profile_path } alt={`${person.name}'s profile pic`} />
                    }
                </>
            }

            <h4>Movies:</h4>
            <ul>
                {
                    moviesCastedFor.length > 0 && moviesCastedFor.map( (movie) => {
                        console.log('Person movie:', movie);

                        return (
                            <li key={movie.id}>
                                { movie.title }
                            </li>
                        );
                    })
                }
            </ul>
        </>
    );
}

export default Person;
