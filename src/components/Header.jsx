import { Link } from 'react-router-dom';

const Header = ({ ref }) => {
    return (
        <header ref={ref}>
            <h1>
                <Link to="/">Mike's movie picks</Link>
            </h1>
        </header>
    );
};

export default Header;
