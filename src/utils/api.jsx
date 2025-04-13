const BASE_URL = "https://api.themoviedb.org/3";

export const BASE_URL_IMAGE = 'https://image.tmdb.org/t/p/';

export const OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
};

export const ifHttpStatusNotOK_throwErrorsAndExit = (response) => {
    if (!response.ok) {
        console.error('Promise resolved but HTTP status failed');

        if (response.status === 404) {
            throw new Error('404, Not found');
        }

        if (response.status === 500) {
            throw new Error('500, internal server error');
        }

        throw new Error(response.status);
    }
};

export const getMovies = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`,
            OPTIONS
        );

        ifHttpStatusNotOK_throwErrorsAndExit(response);

        // Promise resolved and HTTP status is successful
        const res = await response.json();
        return res;
    } catch (error) {
        // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
        console.error('Error:', error);
    }
};

export const getMovie = async (id) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
            OPTIONS
        );

        ifHttpStatusNotOK_throwErrorsAndExit(response);

        // Promise resolved and HTTP status is successful
        const res = await response.json();
        return res;
    } catch (error) {
        // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
        console.error('Error:', error);
    }
};

export const getCredits = async (id) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
            OPTIONS
        );

        ifHttpStatusNotOK_throwErrorsAndExit(response);

        // Promise resolved and HTTP status is successful
        const res = await response.json();
        return res;
    } catch (error) {
        // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
        console.error('Error:', error);
    }
};

export const getTrailer = async (id) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
            OPTIONS
        );

        ifHttpStatusNotOK_throwErrorsAndExit(response);

        // Promise resolved and HTTP status is successful
        const res = await response.json();
        return res;
    } catch (error) {
        // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
        console.error('Error:', error);
    }
};

export const getPerson = async (id) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/person/${id}?language=en-US`,
            OPTIONS
        );

        ifHttpStatusNotOK_throwErrorsAndExit(response);

        // Promise resolved and HTTP status is successful
        const res = await response.json();
        return res;
    } catch (error) {
        // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
        console.error('Error:', error);
    }
};

export const getCreditMovies = async (id) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/person/${id}/movie_credits?language=en-US`,
            OPTIONS
        );

        ifHttpStatusNotOK_throwErrorsAndExit(response);

        // Promise resolved and HTTP status is successful
        const res = await response.json();
        return res;
    } catch (error) {
        // Promise rejected (Network or CORS issues) OR output thrown Errors from try statement above
        console.error('Error:', error);
    }
};
