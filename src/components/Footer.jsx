import { scrollToTop } from '../utils/scrollToTop';

const Footer = () => {
    return (
        <footer>
            <button onClick={scrollToTop}>Back to Top</button>
            <div>
                This website uses{' '}
                <a href="https://www.themoviedb.org" target="_blank">
                    TMDB
                </a>{' '}
                and the TMDB APIs but is not endorsed, certified, or otherwise
                approved by TMDB.
            </div>
        </footer>
    );
};

export default Footer;
