// import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // , useLocation

const BackButton = () => {
    const navigate = useNavigate();
    // const location = useLocation();

    console.log('BackButon: window.history.state', window.history.state);
    // console.log('location', location);

    // useEffect( 
    //     () => {
    //         console.log('BackButton has re-rendered upon location change');
    //     }, 
    //     [location]
    // );

    return (
        window.history.state.idx >= 1 && (
            <button onClick={() => navigate(-1)} className="btn back">
                &laquo;Back
            </button>
        )
    );
};

export default BackButton;
