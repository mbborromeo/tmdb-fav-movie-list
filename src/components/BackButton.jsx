import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            // navigated directly to current page (no history)
            navigate('/');
        }
    };

    return <button onClick={handleBack}>Back</button>;
};

export default BackButton;
