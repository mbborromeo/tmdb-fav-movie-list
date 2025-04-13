import { useEffect, useState } from 'react';

import { fetchApiCallOrThrowError, BASE_URL } from '../utils/api';

const Trailer = ({ id }) => {
    const [trailer, setTrailer] = useState(undefined);

    useEffect(
        () => {
            (async () => {
                const data = await fetchApiCallOrThrowError(`${BASE_URL}/movie/${id}/videos?language=en-US`);

                if (data.results.length > 0) {
                    const trailer = data.results.find(
                        (video) => video.type === 'Trailer'
                    );
                    setTrailer(trailer);
                } else {
                    console.log('No trailers available');
                }
            })(); // IIFE
        }, 
        [id]
    );

    return (
        <>
            {trailer && (
                <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                >
                    <b>PLAY TRAILER</b>
                </a>
            )}
        </>
    );
};

export default Trailer;
