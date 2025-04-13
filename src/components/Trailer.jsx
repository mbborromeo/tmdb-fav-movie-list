import { useEffect, useState } from 'react';

import { getTrailer } from '../utils/api';

const Trailer = ({ id }) => {
    const [trailer, setTrailer] = useState(undefined);

    useEffect(
        () => {
            (async () => {
                const res = await getTrailer(id);

                if (res.results.length > 0) {
                    const trailer = res.results.find(
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
