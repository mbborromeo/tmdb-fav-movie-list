import Person from './Person';

const Credits = ({
    showActorsPic = false,
    actorsDisplayMaxThree = false,
    displayLinks = false,
    directors,
    writers,
    novelists,
    actors
}) => {
    const numberOfDirectors =
        directors && directors.length > 0 ? directors.length : 0;

    const numberOfWriters = writers && writers.length > 0 ? writers.length : 0;

    const numberOfNovelists =
        novelists && novelists.length > 0 ? novelists.length : 0;

    const numberOfActors = actors && actors.length > 0 ? actors.length : 0;

    const maximumActors =
        numberOfActors > 3 && actorsDisplayMaxThree ? 3 : numberOfActors;

    const arraysContainSamePeople = (array1, array2) => {
        if (array1.length !== array2.length) {
            return false;
        }
        const sortedArray1 = [...array1].sort();
        const sortedArray2 = [...array2].sort();

        return sortedArray1.every(
            (element, index) => element.name === sortedArray2[index].name
        );
    };

    const directorAndWriterAreSame =
        numberOfDirectors > 0 && numberOfWriters > 0
            ? arraysContainSamePeople(directors, writers)
            : false;

    return (
        <div className={`credits${!showActorsPic ? ' no-photos' : ''}`}>
            {directorAndWriterAreSame && (
                <div className="credits-wrapper">
                    <b>
                        {`Director${numberOfDirectors > 1 ? 's' : ''}/Writer${numberOfWriters > 1 ? 's' : ''}:`}{' '}
                    </b>
                    <div className="row persons-wrapper directors">
                        {directors &&
                            numberOfDirectors > 0 &&
                            directors.map((director) => (
                                <Person
                                    key={director.id}
                                    person={director}
                                    {...(displayLinks && {
                                        displayLinks: true
                                    })}
                                />
                            ))}
                    </div>
                </div>
            )}

            {!directorAndWriterAreSame && (
                <>
                    <div className="credits-wrapper">
                        <b>{`Director${numberOfDirectors > 1 ? 's' : ''}:`} </b>
                        <div className="row persons-wrapper directors">
                            {directors &&
                                numberOfDirectors > 0 &&
                                directors.map((director) => (
                                    <Person
                                        key={director.id}
                                        person={director}
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
                                        {...(displayLinks && {
                                            displayLinks: true
                                        })}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {numberOfNovelists > 0 && (
                <div className="credits-wrapper">
                    <b>{`Novelist${numberOfNovelists > 1 ? 's' : ''}:`} </b>
                    <div className="row persons-wrapper directors">
                        {novelists.map((novelist) => (
                            <Person
                                key={novelist.id}
                                person={novelist}
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
