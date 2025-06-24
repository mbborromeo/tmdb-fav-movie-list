import { useEffect, useState } from 'react';

import ErrorFeedback from './ErrorFeedback';

import { fetchApiCallOrThrowError, BASE_URL } from '../utils/api';

const Trailer = ({ id }) => {
    const [trailer, setTrailer] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        (async () => {
            const errorsArray = [];

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
                errorsArray.push(
                    'Failed to load Trailer. Error: ' + error.message
                );
            }

            if (errorsArray.length > 0) {
                setErrorMessages(errorsArray);
            }

            setLoading(false);
        })(); // IIFE
    }, [id]);

    return (
        <>
            {errorMessages.length > 0 && (
                <ErrorFeedback errors={errorMessages} />
            )}

            <div className={`iframe-wrapper${loading ? ' loading' : ''}`}>
                {!loading && errorMessages.length === 0 && trailer && (
                    <iframe
                        id="ytplayer"
                        type="text/html"
                        // width="640"
                        // height="360"
                        frameborder="0"
                        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`}
                    ></iframe>
                )}
            </div>
        </>
    );
};

export default Trailer;
