import React, { Component } from "react";
import { teamToLabel } from "../services/game";
import gameRules from "saboteur-shared/dist/game";
import LeaderBoard from "./LeaderBoard";
import PlayersByRole from "./PlayersByRole";
import Button from "./Button";
import "../../styles/RoundEnd.css";

const goldToPoints = gold =>
  gold.reduce((acc, goldValue) => acc + goldValue, 0);

export default class PlayersList extends Component {
  _getPlayersByRank(leaderBoard) {
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
  }

  _renderTeam(selectWinners) {
    let team = this.props.game.winningPlayer.role;
    if (!selectWinners) {
      team = team === "BUILDER" ? "SABOTEUR" : "BUILDER";
    }
    return (
      <div className="round-end__team">
        {!selectWinners &&
          <h2 className="round-end__team-title">
            {teamToLabel(team)} lost this round
          </h2>}
        <PlayersByRole
          players={this.props.game.players}
          playerRole={team}
          shouldHighlight={selectWinners}
        />
      </div>
    );
  }

  render() {
    const { game, startGame } = this.props;
    return (
      <div className="view__content ">
        <p className="round-end__winner">
          {game.winningPlayer.role === "BUILDER"
            ? "Explorators"
            : "Natives"}{" "}
          team won this round!
        </p>
        {game.status !== gameRules.STATUSES.COMPLETED &&
          <div>
            {this._renderTeam(true)}
            <div className="round-end__team">
              {this._renderTeam()}
            </div>
            {game._canStart &&
              <div className="round-end__start">
                <Button
                  text={`Start Round ${game.currentRound + 1}`}
                  onClick={startGame}
                />
              </div>}
          </div>}
        {game.status === gameRules.STATUSES.COMPLETED &&
          <div className="view__section">
            <p className="round-end__winner round-end__winner--final">
              Game is finished!
            </p>
            <LeaderBoard leaderBoard={this._getPlayersByRank(game.players)} />
          </div>}
      </div>
    );
  }
}
