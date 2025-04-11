const ifHttpStatusNotOK_throwErrorsAndExit = (response) => {
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
}

export default ifHttpStatusNotOK_throwErrorsAndExit;
