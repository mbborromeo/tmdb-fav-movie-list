import { useEffect, useState, useMemo, useCallback } from 'react';

import ifHttpStatusNotOK_throwErrorsAndExit from '../utils/fetch-utility';

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

                ifHttpStatusNotOK_throwErrorsAndExit(response);

                // Promise resolved and HTTP status is successful
                const res = await response.json();

                if (res.results.length > 0) {
                    const trailer = res.results.find( (video) => video.type === 'Trailer' );
                    setTrailer(trailer);
                } else {
                    console.log('No trailers available');
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
