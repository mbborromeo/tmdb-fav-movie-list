const Genres = ({genres}) => {
    return (
        <div>
            <b>Genre: </b>{' '}
            {genres.length > 0 && genres.map((genre, i) => (
                <span key={genre.id}>
                    {genre.name}
                    {i < genres.length - 1 && (`, `)}
                </span>
            ))}
        </div>
    );
};

export default Genres;
