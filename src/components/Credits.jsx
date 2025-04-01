import { useState, useEffect } from 'react';

import Actor from './Actor';

const Credits = ({id, showActorsPic = false, actorsDisplayMaxThree = false, directors, actors}) => {
    
    return (
        <>
            <div>
                Director/s:
                <ul>
                {
                    directors && directors.length > 0 && directors.map( (director) => (
                        <li key={director.id}>
                            {director.name}
                        </li>
                    ))
                }
                </ul>
            </div>

            <div>
                Actors:
                <ul>
                {
                    actors && actors.length > 0 && actors.map( (actor, index) => (
                        actorsDisplayMaxThree ?
                            index < 3 && (showActorsPic ? <Actor actor={actor} showActorsPic={true} /> : <Actor actor={actor} />)
                            : showActorsPic ? <Actor actor={actor} showActorsPic={true} /> : <Actor actor={actor} />
                    ))
                }
                </ul>
            </div>
        </>
    );
};

export default Credits;
