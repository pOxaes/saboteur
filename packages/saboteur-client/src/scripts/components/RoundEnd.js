import React from "react";
import gameRules from "saboteur-shared/game";
import LeaderBoard from "./LeaderBoard";

const goldToPoints = gold =>
  gold.reduce((acc, goldValue) => acc + goldValue, 0);

const getPlayersByRank = leaderBoard => {
  leaderBoard
    .sort(
      (playerA, playerB) =>
        goldToPoints(playerB.gold) - goldToPoints(playerA.gold)
    )
    .reduce(
      (lastPlayer, player, index) => {
        player.rank =
          index && goldToPoints(lastPlayer.gold) !== goldToPoints(player.gold)
            ? index
            : lastPlayer.rank;
        return player;
      },
      { rank: 0 }
    );

  return leaderBoard.reduce((playersByRank, player) => {
    if (!playersByRank[player.rank]) {
      playersByRank[player.rank] = [];
    }
    playersByRank[player.rank].push(player);
    return playersByRank;
  }, []);
};

export default ({ game, startGame }) =>
  <div>
    <h3>
      Round #{game.currentRound} End
    </h3>
    <p>
      {game.winningPlayer.role} team won
    </p>
    {game.winningPlayer &&
      <p>
        {game.winningPlayer.name} won
      </p>}
    {game._canStart &&
      <button type="button" onClick={startGame}>
        Start Round {game.currentRound + 1}
      </button>}
    {game.state === gameRules.STATUSES.COMPLETED &&
      <LeaderBoard leaderBoard={getPlayersByRank(game.players)} />}
  </div>;
