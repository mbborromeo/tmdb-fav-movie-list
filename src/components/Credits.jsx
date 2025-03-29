import { useState, useEffect } from 'react';

const Credits = ({id}) => {
    const [directors, setDirectors] = useState([]);

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
                    let directorArray = [];
                    res.crew.forEach( (person) => {
                        if (person.job === 'Director') {
                            // setDirectors( directors => [...directors, person] );
                            directorArray.push(person);
                        }
                    });
                    setDirectors(directorArray);
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
        </>
    );
};

export default Credits;
