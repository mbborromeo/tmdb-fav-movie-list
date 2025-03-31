import { useState, useEffect } from 'react';

import Actor from './Actor';

const Credits = ({id, showActorsPic = false, actorsDisplayMaxThree = false}) => {
    const [directors, setDirectors] = useState([]);
    const [actors, setActors] = useState([]);

    const MAX_ACTORS = 6;

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
                        if (person.order < MAX_ACTORS) {
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
            <div>
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
            </div>

            <div>
                Actors:
                <ul>
                {
                    actors && actors.length > 0 && actors.map( (actor, index) => (
                        actorsDisplayMaxThree ?
                            index < 3 && (showActorsPic ? <Actor actor={actor} showActorsPic={true} /> : <Actor actor={actor} />)
                            : showActorsPic ? <Actor actor={actor} showActorsPic={true} /> : <Actor actor={actor} />
                    ))
                }
                </ul>
            </div>
        </>
    );
};

export default Credits;
