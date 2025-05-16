import { useEffect } from 'react';

import Header from './Header';
import Footer from './Footer';

import { scrollToTop } from '../utils/scrollToTop';

const PageTemplate = ({ children }) => {
    useEffect(() => {
        scrollToTop();
    }, []);

    return (
        <>
            <Header />

            {children}

            <Footer />
        </>
    );
};

export default PageTemplate;
