import { scrollToTop } from '../utils/scrollToTop';

const Footer = () => {
    return (
        <footer>
            <div>
                This website uses{' '}
                <a href="https://www.themoviedb.org" target="_blank">
                    TMDB
                </a>{' '}
                and the TMDB APIs but is not endorsed, certified, or otherwise
                approved by TMDB.
            </div>
            <button onClick={scrollToTop}>Back to Top</button>
        </footer>
    );
};

export default Footer;
