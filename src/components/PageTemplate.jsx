import Header from './Header';
import Footer from './Footer';

const PageTemplate = ({ children }) => {
    return (
        <>
            <Header />

            {children}

            <Footer />
        </>
    );
};

export default PageTemplate;
