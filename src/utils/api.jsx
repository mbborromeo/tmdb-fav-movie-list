import { ensureEnv } from './helper';

export const BASE_URL = 'https://api.themoviedb.org/3';
export const BASE_URL_IMAGE = 'https://image.tmdb.org/t/p/';
export const MAX_ACTORS = 9;
export const MAX_MOVIES = 9;

const apiToken = ensureEnv('VITE_TMDB_TOKEN');

export const OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiToken}`
    }
};

export const fetchApiCallOrThrowError = async (url) => {
    try {
        const response = await fetch(url, OPTIONS);

        if (!response.ok) {
            console.error('Promise resolved but HTTP status failed');

            if (response.status === 404) {
                throw new Error(response.status + ', Not found');
            }

            if (response.status === 500) {
                throw new Error(response.status + ', Internal server error');
            }

            throw new Error(response.status);
        }

        // Promise resolved and HTTP status is successful
        const object = await response.json();
        return object;
    } catch (error) {
        // Network failure (DNS error, no internet connection, server unreachable)
        // CORS issues
        // Browser blocks the request for security reasons
        // JSON parsing error
        console.error('fetch call Error:', error);

        // pass on error to calling function
        throw error;
    }
};
