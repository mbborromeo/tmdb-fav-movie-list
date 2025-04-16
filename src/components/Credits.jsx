import { Link } from 'react-router-dom';

import Actor from './Actor';

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

    return (
        <>
            <div>
                <b>{`Director${numberOfDirectors > 1 ? 's' : ''}:`}</b>
                <ul>
                    {numberOfDirectors > 0 &&
                        directors.map((director) => (
                            <li key={director.id}>
                                {displayLinks ? (
                                    <Link
                                        to={`/person/${director.id}`}
                                        state={{ movieId }}
                                    >
                                        {director.name}
                                    </Link>
                                ) : (
                                    director.name
                                )}
                            </li>
                        ))}
                </ul>
            </div>

            <div>
                <b>Actors:</b>
                <ul>
                    {actors &&
                        actors.length > 0 &&
                        actors.map((actor, index) =>
                            actorsDisplayMaxThree ? (
                                index < 3 && (
                                    <Actor
                                        key={actor.id}
                                        actor={actor}
                                        {...(showActorsPic && {
                                            showActorsPic: true
                                        })}
                                        {...(displayLinks && {
                                            displayLinks: true
                                        })}
                                        movieId={movieId}
                                    />
                                )
                            ) : (
                                <Actor
                                    key={actor.id}
                                    actor={actor}
                                    {...(showActorsPic && {
                                        showActorsPic: true
                                    })}
                                    {...(displayLinks && {
                                        displayLinks: true
                                    })}
                                    movieId={movieId}
                                />
                            )
                        )}
                </ul>
            </div>
        </>
    );
};

export default Credits;
