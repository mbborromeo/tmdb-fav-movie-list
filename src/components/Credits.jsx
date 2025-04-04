import { useState, useEffect } from 'react';

import { Link } from "react-router-dom";

import Actor from './Actor';

const Credits = ({id, showActorsPic = false, actorsDisplayMaxThree = false, displayLinks = false, directors, actors}) => {
    const numberOfDirectors = (directors && directors.length > 0) ? directors.length : 0;

    return (
        <>
            <div>
                <b>{`Director${ numberOfDirectors > 1 ? 's' : '' }:`}</b>
                <ul>
                {
                    numberOfDirectors > 0 && directors.map( (director) => (
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
                <b>Actors:</b>
                <ul>
                {
                    actors && actors.length > 0 && actors.map( (actor, index) => (
                        actorsDisplayMaxThree ?
                            index < 3 && <Actor key={actor.id} actor={actor} { ...( showActorsPic && {showActorsPic: true} ) } { ...(displayLinks && {displayLinks: true}) } />
                        : <Actor key={actor.id} actor={actor} { ...(showActorsPic && {showActorsPic: true}) } { ...(displayLinks && {displayLinks: true}) } />
                    ))
                }
                </ul>
            </div>
        </>
    );
};

export default Credits;
