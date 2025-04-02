import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const Person = () => {
    const { id } = useParams();

    const [movies, setMovies] = useState([]);
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
            fetch(`https://api.themoviedb.org/3/person/${ id }?language=en-US`, options)
                .then(res => res.json())
                .then(
                    (res) => {
                        console.log('Person Details:', res);
                        setPerson(res);
                        return res;
                    }
                )
                .then(
                    (res1) => {
                        fetch(`https://api.themoviedb.org/3/person/${ id }/movie_credits?language=en-US`, options)
                        .then(res => res.json())
                        .then(
                            (res2) => {
                                console.log('movie_credits:', res2);

                                let moviesOfInterest = [];

                                if (res1.known_for_department==='Acting'){
                                    if (res2.cast && res2.cast.length > 0) {
                                        moviesOfInterest = [...res2.cast]; // shallow copy for sorting, so original immutable

                                        console.log('moviesOfInterest:', moviesOfInterest);

                                        // // sort by order
                                        // moviesOfInterest.sort( (a, b) => a.order - b.order );

                                        // // sort by order, then by popularity
                                        // moviesOfInterest.sort( (a, b) => a.order - b.order || b.popularity - a.popularity );
                                    
                                        // sort by popularity
                                        moviesOfInterest.sort( (a, b) => b.popularity - a.popularity );
                                    }
                                } else {
                                    if (res2.crew && res2.crew.length > 0) {
                                        moviesOfInterest = [...res2.crew];

                                        // filter out non-director jobs
                                        moviesOfInterest = moviesOfInterest.filter( (movie) => movie.job === 'Director' );

                                        // sort by popularity
                                        moviesOfInterest.sort( (a, b) => b.popularity - a.popularity );
                                    }
                                }
                                
                                // limit to 8 movies
                                if (moviesOfInterest.length > 8) {
                                    moviesOfInterest = moviesOfInterest.slice(0, 8);
                                }

                                setMovies( moviesOfInterest );
                            }
                        )
                        .catch(err => console.error(err));
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
                    movies.length > 0 && movies.map( (movie) => {
                        return (
                            <li key={`${movie.id}-${movie.job}`}>
                                { movie.title } ({ person.known_for_department==="Acting" ? movie.character : movie.job })
                            </li>
                        );
                    })
                }
            </ul>
        </>
    );
}

export default Person;
