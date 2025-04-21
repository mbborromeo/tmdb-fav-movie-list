import { Link } from 'react-router-dom';

import Person from './Person';

const Credits = ({
    showActorsPic = false,
    actorsDisplayMaxThree = false,
    displayLinks = false,
    directors,
    actors,
    movieId
}) => {
    const numberOfDirectors =
        directors && directors.length > 0 ? directors.length : 0;

    const numberOfActors = actors && actors.length > 0 ? actors.length : 0;

    const maximumActors =
        numberOfActors > 3 && actorsDisplayMaxThree ? 3 : numberOfActors;

    return (
        <div className="credits">
            <div className="credits-wrapper">
                <b>{`Director${numberOfDirectors > 1 ? 's' : ''}:`} </b>
                <div
                    className={`row persons-wrapper${!showActorsPic ? ' no-photo' : ''}`}
                >
                    {directors &&
                        numberOfDirectors > 0 &&
                        directors.map((director) => (
                            <Person
                                key={director.id}
                                person={director}
                                movieId={movieId}
                                {...(displayLinks && {
                                    displayLinks: true
                                })}
                            />
                        ))}
                </div>
            </div>

            <div className="credits-wrapper">
                <b>Actors: </b>
                <div
                    className={`row persons-wrapper${!showActorsPic ? ' no-photo' : ''}`}
                >
                    {actors &&
                        numberOfActors > 0 &&
                        actors.slice(0, maximumActors).map((actor) => (
                            <Person
                                key={actor.id}
                                person={actor}
                                movieId={movieId}
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
