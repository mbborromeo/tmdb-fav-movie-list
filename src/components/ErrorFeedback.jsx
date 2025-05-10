const ErrorFeedback = ({ errors }) => {
    return errors.map((error, index) => (
        <div key={index}>
            <b style={{ color: 'red' }}>{error}</b>
        </div>
    ));
};

export default ErrorFeedback;
