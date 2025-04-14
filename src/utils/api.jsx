export const BASE_URL = "https://api.themoviedb.org/3";
export const BASE_URL_IMAGE = 'https://image.tmdb.org/t/p/';

export const OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
};

// export const ifHttpStatusNotOK_throwErrorsAndExit = (response) => {
//     if (!response.ok) {
//         console.error('Promise resolved but HTTP status failed');

//         if (response.status === 404) {
//             throw new Error('404, Not found');
//         }

//         if (response.status === 500) {
//             throw new Error('500, internal server error');
//         }

//         throw new Error(response.status);
//     }
// };

export const fetchApiCallOrThrowError = async (url) => {
    try {
        const response = await fetch(url, OPTIONS);
        
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

        // Promise resolved and HTTP status is successful
        const object = await response.json();
        return object;
    } catch (error) {
        console.error('fetchApiCallOrThrowError Error:', error);
        // pass error to caller
        throw error;
    }
};
