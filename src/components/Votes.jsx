const Votes = ({className, voteAverage, voteCount}) => {
    return (
        <div 
            {...(className ? { className: className } : {})}
        >
            <b>Stars:</b>{' '}
            {Math.round(voteAverage * 2) / 2}/10
            <span> ({voteCount} votes)</span>
        </div>
    );
};

export default Votes;
