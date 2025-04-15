import { useEffect, useState } from 'react';

import { fetchApiCallOrThrowError, BASE_URL } from '../utils/api';

const Trailer = ({ id }) => {
    const [trailer, setTrailer] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(
        () => {
            (async () => {
                try {
                    const data = await fetchApiCallOrThrowError(`${BASE_URL}/movie/${id}/videos?language=en-US`);

                    if (data.results.length > 0) {
                        const trailer = data.results.find(
                            (video) => video.type === 'Trailer'
                        );
                        setTrailer(trailer);
                    } else {
                        console.log('No trailers available');
                    }
                } catch (error) {
                    // receive any error from fetchApiCallOrThrowError()
                    setErrorMessage("Failed to load Trailer. Error: " + error.message);
                }
    
                setLoading(false);
            })(); // IIFE
        }, 
        [id]
    );

    return (
        <>
            { loading && (
                <img src="/images/gifer_loading_VAyR.gif" alt="loading" width="32" />
            )}

            { errorMessage && (
                <b>{ errorMessage }</b>
            )}

            { !loading && !errorMessage && trailer && (
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
