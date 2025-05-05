import Person from './Person';

const Credits = ({
    showActorsPic = false,
    actorsDisplayMaxThree = false,
    displayLinks = false,
    directors,
    writers,
    actors,
    movieId,
    genreFilter,
    dateOrder
}) => {
    const numberOfDirectors =
        directors && directors.length > 0 ? directors.length : 0;

    const numberOfWriters =
        writers && writers.length > 0 ? writers.length : 0;

    const numberOfActors = actors && actors.length > 0 ? actors.length : 0;

    const maximumActors =
        numberOfActors > 3 && actorsDisplayMaxThree ? 3 : numberOfActors;

    return (
        <div className={`credits${!showActorsPic ? ' no-photos' : ''}`}>
            <div className="credits-wrapper">
                <b>{`Director${numberOfDirectors > 1 ? 's' : ''}:`} </b>
                <div className="row persons-wrapper directors">
                    {directors &&
                        numberOfDirectors > 0 &&
                        directors.map((director) => (
                            <Person
                                key={director.id}
                                person={director}
                                movieId={movieId}
                                genreFilter={genreFilter}
                                dateOrder={dateOrder}
                                {...(displayLinks && {
                                    displayLinks: true
                                })}
                            />
                        ))}
                </div>
            </div>

            {writers && numberOfWriters > 0 && (
                <div className="credits-wrapper">
                    <b>{`Writer${numberOfWriters > 1 ? 's' : ''}:`} </b>
                    <div className="row persons-wrapper directors">
                        {writers.map((writer) => (
                            <Person
                                key={writer.id}
                                person={writer}
                                movieId={movieId}
                                genreFilter={genreFilter}
                                dateOrder={dateOrder}
                                {...(displayLinks && {
                                    displayLinks: true
                                })}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="credits-wrapper">
                <b>Actors: </b>
                <div className="row persons-wrapper">
                    {actors &&
                        numberOfActors > 0 &&
                        actors.slice(0, maximumActors).map((actor) => (
                            <Person
                                key={actor.id}
                                person={actor}
                                character={actor.character}
                                movieId={movieId}
                                genreFilter={genreFilter}
                                dateOrder={dateOrder}
                                {...(showActorsPic && {
                                    showPic: true
                                })}
                                {...(displayLinks && {
                                    displayLinks: true
                                })}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Credits;
