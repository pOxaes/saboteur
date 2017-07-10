import React from 'react';

import Game from './Game';

export default ({ games, onSelectGame }) => (
  <div className="games">
    {
      games.length === 0
        ? (<p>Empty</p>)
        : (<ul className="games__list">
          {
            games.map((game) => (
              <li className="game-list__item" key={ game.id }>
                <Game game={ game } onClick={ onSelectGame } />
              </li>
            ))
      }
      </ul>)
    }
  </div>
);
