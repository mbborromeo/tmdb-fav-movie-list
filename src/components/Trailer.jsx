import { useEffect, useState } from 'react';

const Trailer = ( {id} ) => {
    const [trailer, setTrailer] = useState(undefined);

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
        }
    };
    
    useEffect(
        () => {
            fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
                .then(res => res.json())
                // .then(res => { 
                //         console.log(res);
                //         return res;
                //     })
                .then(res => { 
                        if (res.results.length > 0) {
                            const trailer = res.results.find( (video) => video.type === 'Trailer' );
                            setTrailer(trailer);
                        } else {
                            console.log('No trailers available');
                        }
                    }
                )
                .catch(err => console.error(err));
        }, 
        []
    );

    return (
        <>
            {
                trailer && <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank"><b>PLAY TRAILER</b></a>
            }
        </>
    );
}

export default Trailer;
