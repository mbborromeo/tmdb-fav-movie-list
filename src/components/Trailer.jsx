import { useEffect, useState, useMemo, useCallback } from 'react';

const Trailer = ( {id} ) => {
    const [trailer, setTrailer] = useState(undefined);

    const options = useMemo(() => ({
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
            }
        }),
        []
    );

    const getTrailer = useCallback( 
        async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options);

                if (response.ok) {
                    const res = await response.json();

                    if (res.results.length > 0) {
                        const trailer = res.results.find( (video) => video.type === 'Trailer' );
                        setTrailer(trailer);
                    } else {
                        console.log('No trailers available');
                    }
                } else {
                    console.error('Promise resolved but HTTP status failed');
            
                    if (response.status === 404) {
                        throw new Error('404, Not found');
                    }
            
                    if (response.status === 500) {
                        throw new Error('500, internal server error');
                    }
            
                    throw new Error(response.status);
                }
            } catch (error) {
                // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
                console.error('Error:', error);
            }
        }, 
        [id, options]
    );
    
    useEffect(
        () => {
            getTrailer();
        }, 
        [getTrailer]
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
