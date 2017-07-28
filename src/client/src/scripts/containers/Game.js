import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import boardService from "../services/board";
import PlayersList from "../components/PlayersList";
import CurrentPlayer from "../components/CurrentPlayer";
import LeaderBoard from "../components/LeaderBoard";
import Board from "../components/Board";
import Deck from "../components/Deck";
import Discard from "../components/Discard";
import actions from "../store/actions";
import "../../styles/Game.css";

const GAME_STATUS = {
  WAITING_FOR_PLAYERS: "WAITING_FOR_PLAYERS",
  PLAYING: "PLAYING",
  COMPLETED: "COMPLETED"
};

const DESTINATION_TYPES = {
  DISCARD: "DISCARD",
  SLOT: "SLOT",
  PLAYER: "PLAYER"
};

const attachLinkedToStart = (card, index, cards) => {
  card.isLinkedToStart = boardService.isLinkedToStart(card, cards);
};

const computeGameClass = (game, selectedCard) =>
  [
    "game",
    selectedCard && "game--selected-card",
    game && `game--status-${game.status}`
  ].join(" ");

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

export class Game extends Component {
  state = {
    id: this.props.match.params.id
  };

  componentDidMount() {
    actions.getGame(this.state.id).then(this.updateGame.bind(this));
  }

  updateGame(game) {
    console.log("updateGame", JSON.stringify(game, null, 2));
    if (game.status === GAME_STATUS.COMPLETED) {
      this.setState({
        game,
        leaderBoard: getPlayersByRank(game.leaderBoard)
      });
      return;
    }

    let slots = [];

    const currentPlayerIndex = game.players
      .map(player => player.id)
      .indexOf(this.props.user.id);

    if (game.status === GAME_STATUS.PLAYING) {
      game.board.forEach(boardService.formatCardLayout);
      game.board.forEach(attachLinkedToStart);

      slots = boardService.createSlotsFromCards(game.board);

      // format current player cards
      game.players[currentPlayerIndex].cards.forEach(card => {
        if (card.layout) {
          card.canRotate = true;
          card.isRotated = false;
        }
        boardService.formatCardLayout(card);
        boardService.attachPlayability(card, slots, game.players);
      });
    }

    this.setState({
      game,
      slots,
      currentPlayer: game.players[currentPlayerIndex],
      players: game.players.filter(
        (player, index) => index !== currentPlayerIndex
      )
    });
  }

  kickPlayer = player => {
    actions.kick({ playerId: player.id, gameId: this.state.id });
  };

  onCardPlay(card) {
    if (!card.isPlayable) {
      return;
    }

    if (card === this.state.selectedCard) {
      this.setState({
        selectedCard: undefined
      });
      this.state.slots.concat(this.state.players).forEach(item => {
        item.isHighlighted = false;
      });
      return;
    }

    this.setState({
      selectedCard: card
    });

    this.updateHighlights(card);
  }

  confirmSelectedCardDestination(type, destinationItem) {
    if (
      !this.state.selectedCard ||
      (type !== DESTINATION_TYPES.DISCARD && !destinationItem.isHighlighted)
    ) {
      return;
    }

    const destination = {
      type
    };

    if (type === DESTINATION_TYPES.PLAYER) {
      destination.id = destinationItem.id;
    }

    if (type === DESTINATION_TYPES.SLOT) {
      destination.x = destinationItem.x;
      destination.y = destinationItem.y;
    }

    actions.playCard({
      gameId: this.state.id,
      cardId: this.state.selectedCard.id,
      isRotated: this.state.selectedCard.isRotated,
      destination
    });
  }

  updateHighlights(card) {
    this.state.slots.forEach(slot => {
      slot.isHighlighted = boardService.canPlayCardOnSlot(card, slot);
    });

    this.state.players.forEach(player => {
      player.isHighlighted = boardService.canPlayCardOnPlayer(card, player);
    });
  }

  startGame() {
    actions.startGame(this.state.game.id).then(this.updateGame.bind(this));
  }

  renderLobby() {
    return (
      <div className="game__lobby-status">
        <p className="game__players-count">
          {this.state.game.players.length} / {this.state.game.maxPlayers}{" "}
          players
        </p>
        {this.state.game.players.length < 2
          ? <p>You need at least 2 players to start</p>
          : <button type="button" onClick={this.startGame.bind(this)}>
              Start Game
            </button>}
      </div>
    );
  }

  renderPlayingGame() {
    return (
      <div>
        <Board
          slots={this.state.slots}
          selectSlot={this.confirmSelectedCardDestination.bind(
            this,
            DESTINATION_TYPES.SLOT
          )}
        />
        <Deck count={this.state.game.deck} />
        <Discard
          onDiscard={this.confirmSelectedCardDestination.bind(
            this,
            DESTINATION_TYPES.DISCARD
          )}
        />
      </div>
    );
  }

  renderCompletedGame() {
    return (
      <div>
        <LeaderBoard leaderBoard={this.state.leaderBoard} />
      </div>
    );
  }

  renderByStatus() {
    switch (this.state.game.status) {
      case GAME_STATUS.WAITING_FOR_PLAYERS:
        return this.renderLobby();
      case GAME_STATUS.PLAYING:
        return this.renderPlayingGame();
      case GAME_STATUS.COMPLETED:
        return this.renderCompletedGame();
      default:
        return <Redirect to="/" />;
    }
  }

  rotateCardLayout(card) {
    boardService.rotateCardLayout(card);
    if (this.state.selectedCard && card.id === this.state.selectedCard.id) {
      this.updateHighlights(card);
    }
    this.forceUpdate();
  }

  leave() {
    const confirmationSentence =
      this.state.game.hostId === this.state.currentPlayer.id
        ? "Watchout, you'll be removed from this game and won't be its host anymore"
        : "Watchout, you'll be removed from this game";

    const shouldLeave = window.confirm(confirmationSentence);

    if (!shouldLeave) {
      return;
    }

    actions.leaveGame(this.state.game.id).then(() => {
      this.props.history.replace("/");
    });
  }

  render() {
    return (
      <div
        className={computeGameClass(this.state.game, this.state.selectedCard)}
      >
        <div className="game__nav">
          {this.state.game &&
            this.state.game.status === GAME_STATUS.WAITING_FOR_PLAYERS &&
            <button
              type="button"
              className="game__nav__leave-button"
              onClick={() => {
                this.leave();
              }}
            >
              Leave
            </button>}
          <Link className="game__nav__back-button" to="/">
            Home
          </Link>
        </div>
        {this.state.players &&
          <PlayersList
            players={this.state.players}
            onKickPlayer={this.kickPlayer}
            canKickPlayer={this.state.game._canKick}
            selectPlayer={this.confirmSelectedCardDestination.bind(
              this,
              DESTINATION_TYPES.PLAYER
            )}
          />}
        {this.state.currentPlayer &&
          <CurrentPlayer
            player={this.state.currentPlayer}
            onCardPlay={this.onCardPlay.bind(this)}
            selectedCard={this.state.selectedCard}
            rotateCardLayout={this.rotateCardLayout.bind(this)}
          />}
        {this.state.game && this.renderByStatus()}
      </div>
    );
  }
}

export default Game;
