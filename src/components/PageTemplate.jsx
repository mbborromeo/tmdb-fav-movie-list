import { useRef, useImperativeHandle, forwardRef } from 'react';

import Header from './Header';
import Footer from './Footer';

const PageTemplate = forwardRef(({ children }, ref) => {
    const headerRef = useRef(null);

    // Expose the height via the forwarded ref
    useImperativeHandle(ref, () => ({
        getHeaderHeight: () =>
            headerRef?.current?.offsetHeight + headerRef?.current?.offsetTop ||
            100
        // , getHeaderSpan: () => headerRef?.current?.querySelector('h1 span')
    }));

    return (
        <>
            <Header ref={headerRef} />

            {children}

            <Footer />
        </>
    );
});

export default PageTemplate;
