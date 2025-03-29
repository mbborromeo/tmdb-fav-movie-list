import { useState, useEffect } from 'react';

import Actor from './Actor';

const Credits = ({id}) => {
    const [directors, setDirectors] = useState([]);
    const [actors, setActors] = useState([]);

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
        }
    };
      
    useEffect(
        () => {
            fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, options)
                .then(res => res.json())
                .then(res => { 
                            console.log('credits:', res);
                            return res;
                        })
                .then(res => {
                    let directorsArray = [];
                    let actorsArray = [];
                    
                    res.crew.forEach( (person) => {
                        if (person.job === 'Director') {
                            directorsArray.push(person);
                        }
                    });
                    setDirectors(directorsArray);

                    res.cast.forEach( (person) => {
                        if (person.order < 3) {
                            actorsArray.push(person);
                        }
                    });
                    setActors(actorsArray);
                })
                .catch(err => console.error(err));
        },
        []
    );
    
    return (
        <>
            Director/s:
            <ul>
            {
                directors && directors.length > 0 && directors.map( (director) => (
                    <li key={director.id}>
                        {director.name}
                    </li>
                ))
            }
            </ul>

            Actors:
            <ul>
            {
                actors && actors.length > 0 && actors.map( (actor) => (
                    <Actor actor={actor} />
                ))
            }
            </ul>
        </>
    );
};

export default Credits;
