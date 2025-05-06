const ReleaseInfo = ({releaseDate, rating}) => {
    return (
        <span className="release-data">
            ({releaseDate.split('-')[0]}
            {rating && `, ${rating}`})
        </span>
    );
};

export default ReleaseInfo;
