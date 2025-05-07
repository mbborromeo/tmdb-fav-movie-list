import { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { fetchApiCallOrThrowError, BASE_URL, MAX_ACTORS } from '../utils/api';

const useFetchMovie = (id) => {
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // location.state will be null if Movie page is opened in a new tab
    const [movie, setMovie] = useState(
        location.state ? location.state.movie : null
    );
    const [directors, setDirectors] = useState(
        location.state ? location.state.directors : null
    );
    const [writers, setWriters] = useState(
        location.state ? location.state.writers : null
    );
    const [novelists, setNovelists] = useState(
        location.state ? location.state.novelists : null
    );
    const [actors, setActors] = useState(
        location.state ? location.state.actors : null
    );
    const [rating, setRating] = useState(
        location.state ? location.state.rating : null
    );

    useEffect(() => {
        const fetchMovie = async () => {
            if (
                !movie ||
                !directors ||
                !writers ||
                !novelists ||
                !actors ||
                !rating
            ) {
                try {
                    const [moviePromise, creditsPromise, releaseDataPromise] =
                        await Promise.allSettled([
                            fetchApiCallOrThrowError(
                                `${BASE_URL}/movie/${id}?language=en-US`
                            ),
                            fetchApiCallOrThrowError(
                                `${BASE_URL}/movie/${id}/credits?language=en-US`
                            ),
                            fetchApiCallOrThrowError(
                                `${BASE_URL}/movie/${id}/release_dates`
                            )
                        ]);

                    if (moviePromise.status === 'rejected') {
                        console.error('Error:', moviePromise.reason);
                        setErrorMessage(
                            'Failed to load Movie. ' + moviePromise.reason
                        );
                    }

                    if (moviePromise.status === 'fulfilled') {
                        const movieResponse = moviePromise.value;
                        setMovie(movieResponse);
                    }

                    if (creditsPromise.status === 'rejected') {
                        console.error('Error:', creditsPromise.reason);
                        setErrorMessage(
                            'Failed to load Credits. ' + creditsPromise.reason
                        );
                    }

                    if (creditsPromise.status === 'fulfilled') {
                        const creditsResponse = creditsPromise.value;

                        const arrayDirectors = creditsResponse.crew.filter(
                            (person) => person.job === 'Director'
                        );
                        setDirectors(arrayDirectors);

                        const arrayWriters = creditsResponse.crew.filter(
                            (person) => person.job === 'Writer'
                        );
                        setWriters(arrayWriters);

                        const arrayNovelists = creditsResponse.crew.filter(
                            (person) => person.job === 'Novel'
                        );
                        setNovelists(arrayNovelists);

                        const arrayActors = creditsResponse.cast.filter(
                            (person) => person.order < MAX_ACTORS
                        );
                        setActors(arrayActors);
                    }

                    if (releaseDataPromise.status === 'rejected') {
                        console.error('Error:', releaseDataPromise.reason);
                        setErrorMessage(
                            'Failed to load Release Data. ' +
                                releaseDataPromise.reason
                        );
                    }

                    if (releaseDataPromise.status === 'fulfilled') {
                        const releaseDataResponse = releaseDataPromise.value;

                        let releaseDataOfInterest =
                            releaseDataResponse.results.find(
                                (country) => country['iso_3166_1'] === 'AU'
                            );
                        let releaseData =
                            releaseDataOfInterest?.release_dates.find(
                                (rd) => rd['certification'] !== ''
                            );

                        if (!releaseDataOfInterest || !releaseData) {
                            releaseDataOfInterest =
                                releaseDataResponse.results.find(
                                    (country) => country['iso_3166_1'] === 'US'
                                );
                            releaseData =
                                releaseDataOfInterest?.release_dates.find(
                                    (rd) => rd['certification'] !== ''
                                );
                        }

                        const movieCertification = releaseData?.certification;
                        if (movieCertification) {
                            setRating(movieCertification);
                        }
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            setLoading(false);
        };

        fetchMovie();
    }, [id, movie, directors, writers, novelists, actors, rating]);

    return {
        loading,
        movie,
        directors,
        writers,
        novelists,
        actors,
        rating,
        errorMessage
    };
};

export default useFetchMovie;
