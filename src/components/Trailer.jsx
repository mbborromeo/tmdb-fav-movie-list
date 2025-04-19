import { useEffect, useState } from 'react';

import ErrorFeedback from './ErrorFeedback';

import { fetchApiCallOrThrowError, BASE_URL } from '../utils/api';

import loadingGif from '../assets/images/gifer_loading_VAyR.gif';

const Trailer = ({ id }) => {
    const [trailer, setTrailer] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchApiCallOrThrowError(
                    `${BASE_URL}/movie/${id}/videos?language=en-US`
                );

                if (data.results.length > 0) {
                    const trailer = data.results.find(
                        (video) => video.type === 'Trailer'
                    );
                    setTrailer(trailer);
                }
            } catch (error) {
                // receive any error from fetchApiCallOrThrowError()
                setErrorMessage(
                    'Failed to load Trailer. Error: ' + error.message
                );
            }

            setLoading(false);
        })(); // IIFE
    }, [id]);

    return (
        <>
            {loading && (
                <img
                    src={loadingGif}
                    alt="loading"
                    width="32"
                />
            )}

            {errorMessage && <ErrorFeedback message={errorMessage} />}

            {!loading && !errorMessage && trailer && (
                <iframe
                    id="ytplayer"
                    type="text/html"
                    width="640"
                    height="360"
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`} // &origin=http://example.com
                    frameborder="0"
                ></iframe>
                // <a
                //     href={`https://www.youtube.com/watch?v=${trailer.key}`}
                //     target="_blank"
                // >
                //     <b>PLAY TRAILER</b>
                // </a>
            )}
        </>
    );
};

export default Trailer;
