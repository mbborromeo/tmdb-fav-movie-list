import { useState, useEffect } from 'react'

const Genres = ({gids, possibleGenres}) => {
  return (
        <div>
            Genre:
            <ul>
                { gids && gids.length > 0 && possibleGenres && possibleGenres.length > 0 && 
                    gids.map( (gid) => {
                        const genreObj = possibleGenres.find( (g) => (g.id===gid) );

                        if (genreObj) {
                            return (
                                <li key={gid}>
                                    {genreObj.name}
                                </li>
                            );
                        }
                    })
                }
            </ul>
        </div>
  );
}

export default Genres;
