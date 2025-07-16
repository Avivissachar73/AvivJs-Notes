
import { Utils } from "../../../services/common.js";

export function createPlayer(state, clientId) {
  const { boardData: {board}, players, entities } = state;
  const playerPos = { i: board.length-3, j: Math.ceil(board[0].length / 2) };
  const player = {
    parentList: 'players',
    type: 'PLAYER',
    id: Utils.getRandomId(),
    clientId, // refer to witch client device
    pos: playerPos,
    speed: 1,
    img: 'images/space_ship.png',
    size: { w: 3, h: 2.5 },
    health: 100,
    maxHealth: 100,
    points: 10,
    score: 0,
    killCount: 0,
    bulletData: {
      type: '',
      level: 1,
    },
  };
  players.push(player);
  entities.push(player);
  this.boardService.placeOnBoard(playerPos, player);
  return player;
}

export function minimizePlayer(player) { // static
  return {
    ...player
    // id: player.id,
    // nickName: player.nickName,
    // clientId: player.clientId,
    // score: player.score,
    // killCount: player.killCount,
    // img: player.img,
  }
}