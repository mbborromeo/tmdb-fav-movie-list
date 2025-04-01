import { useState, useEffect } from 'react';

import { Link } from "react-router-dom";

import Actor from './Actor';

const Credits = ({id, showActorsPic = false, actorsDisplayMaxThree = false, displayLinks = false, directors, actors}) => {
    
    return (
        <>
            <div>
                Director/s:
                <ul>
                {
                    directors && directors.length > 0 && directors.map( (director) => (
                        <li key={director.id}>
                            {
                                displayLinks ?
                                    <Link to={`/person/${director.id}`}>
                                        { director.name }
                                    </Link>
                                    : director.name
                            }
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
                            index < 3 && <Actor actor={actor} { ...( showActorsPic && {showActorsPic: true} ) } { ...(displayLinks && {displayLinks: true}) } />
                        : <Actor actor={actor} { ...(showActorsPic && {showActorsPic: true}) } { ...(displayLinks && {displayLinks: true}) } />
                    ))
                }
                </ul>
            </div>
        </>
    );
};

export default Credits;
