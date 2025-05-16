import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        window.history.state.idx >= 1 && (
            <button onClick={() => navigate(-1)} className="btn back">
                &laquo;Back
            </button>
        )
    );
};

export default BackButton;
