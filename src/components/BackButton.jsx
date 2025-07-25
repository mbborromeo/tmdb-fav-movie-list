import { useNavigate, useLocation, Link } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation(); // to make the component re-render on history change

    const canGoBack = location.key !== 'default';

    return canGoBack ? (
        <button onClick={() => navigate(-1)} className="btn back">
            &laquo;Back
        </button>
    ) : (
        <Link to="/">&laquo;Back</Link>
    );
};

export default BackButton;
