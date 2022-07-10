import { Utils } from '../../../../../../lib/utils.service.js';


export const BOARD_SIZE = 6;


export const boardMethods = {
  createGameBoard,
  createInitializedCell,
  createEmptyCell,
  createPlayerCell
}

export function createGameBoard(size = BOARD_SIZE) {
    const players = {};
    players[this.PLAYER_1_ID] = [];
    players[this.PLAYER_2_ID] = [];
    
    var board = [];
    for (let i = 0; i < size; i++) {
      board[i] = [];
      for (let j = 0; j < size; j++) {
        board[i][j] = this.createInitializedCell({i,j}, players, size);
      }
    }
    // board[4][2].isKing = true;
    // board[1][3].isKing = true;
    return {board, players, size};
}

function createInitializedCell(pos, players, size) {
    var {i, j} = pos;
    if (i < Math.floor(size/8*3) && (i%2 !== 0 && j%2 !== 0 || i%2 === 0 && j%2 === 0)) {
        let player =  this.createPlayerCell(this.PLAYER_1_ID, pos, 1);
        players[this.PLAYER_1_ID].push(player)
        return player;
    } else if (i >= Math.ceil(size/8*5) && (i%2 !== 0 && j%2 !== 0 || i%2 === 0 && j%2 === 0)) {
        let player =  this.createPlayerCell(this.PLAYER_2_ID, pos, -1);
        players[this.PLAYER_2_ID].push(player)
        return player;
    }
    return this.createEmptyCell(pos);
}


export function createEmptyCell(pos) {
    return {
        isEmpty: true,
        cellId: Utils.getRandomId(),
        pos
    };
}


function createPlayerCell(playerId, pos, movingdiff) {
    return {
        playerId,
        cellId: Utils.getRandomId(),
        isKing: false,
        movingdiff,
        pos
    }
}