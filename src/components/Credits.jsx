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

    const maximumActors = actors.length > 3 && actorsDisplayMaxThree ? 3 : actors.length;

    return (
        <div className="credits">
            <div>
                <b>{`Director${numberOfDirectors > 1 ? 's' : ''}:`} </b>
                <div className="photos-wrapper">
                    {numberOfDirectors > 0 &&
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

            <div>
                <b>Actors: </b>
                    {actors && (
                        <div className="photos-wrapper">
                            {actors.slice(0, maximumActors).map((actor) => (
                                <Person
                                    key={actor.id}
                                    person={actor}
                                    movieId={movieId}
                                    {...(showActorsPic && {
                                        showPic: true,
                                    })}
                                    {...(displayLinks && {
                                        displayLinks: true,
                                    })}
                                />
                            ))}
                        </div>
                    )}
            </div>
        </div>
    );
};

export default Credits;
