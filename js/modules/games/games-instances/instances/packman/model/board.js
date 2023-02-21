import { Utils } from "../../../services/common.js";


export const boardMethods = {
  createGameBoard,
  createInitializedCell,
  createEmptyCell,
  createPlayerCell,
  createEnemyCell,
  creasteBoardCell,
  createSupperFoodCell,
  createRegFoodCell,
  getIsborder,
  getIsEnemyInitPos,
  getAllEmptyPoss
}

const BOARD_SIZE = 21;


function createGameBoard() {
    var board = [];
    var res = {
        board,
        player: null,
        enemies: [],
        foodCount: 0
    }
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = this.createInitializedCell({i,j}, BOARD_SIZE, BOARD_SIZE, res);
        }
    }
    return res;
    // return board;
}

function createInitializedCell(pos, boardHeight, boardWidth, res) {
    var {i, j} = pos;
    
    // if (i === 0 || j === 0 || i === boardHeight-1 || j === boardWidth-1) {
    if (this.getIsborder(pos, boardHeight, boardWidth)) {
        return this.creasteBoardCell(pos);
    }

    if (i === 5 && j === 10) {
        let player = this.createPlayerCell(pos);
        res.player = player;
        return player;
    }

    if (this.getIsEnemyInitPos(pos)) {
        let enemy = this.createEnemyCell(pos);
        res.enemies.push(enemy);
        return enemy;
    }

    if (i === 1 && j === 1 || i === 1 && j === boardWidth-2 ||
        i === boardHeight-2 && j === 1 || i === boardHeight-2 && j === boardWidth-2) {
            res.foodCount ++;
            return this.createSupperFoodCell(pos);
    }
        
    res.foodCount ++;
    return this.createRegFoodCell(pos);
}


function createEmptyCell(pos) {
    return {
        initialPos: {...pos},
        isEmpty: true,
        type: this.getIsEnemyInitPos({...pos})? 'enemyBase' : 'empty',
        cellId: Utils.getRandomId(),
        pos,
        // uiStr: _geCellUiStr('empty', 'empty', true)

    };
}
function createPlayerCell(pos) {
    return {
        initialPos: {...pos},
        type: 'player',
        cellId: Utils.getRandomId(),
        pos,
        // uiStr: _geCellUiStr('player')
    }
}
function createEnemyCell(pos) {
    return {
        initialPos: {...pos},
        type: 'enemy',
        cellId: Utils.getRandomId(),
        pos,
        color: Utils.getRandomColor(),
        score: 20,
        // uiStr: _geCellUiStr('enemy')
    }
}
function creasteBoardCell(pos) {
    return {
        initialPos: {...pos},
        type: 'border',
        cellId: Utils.getRandomId(),
        pos,
        // uiStr: _geCellUiStr('boarder')
    }
}
function createSupperFoodCell(pos) {
    return {
        initialPos: {...pos},
        type: 'food',
        subtype: 'supper-food',
        cellId: Utils.getRandomId(),
        pos,
        score: 20,
        // uiStr: _geCellUiStr('food', 'supper-food')
    }
}
function createRegFoodCell(pos) {
    return {
        initialPos: {...pos},
        type: 'food',
        subtype: 'food',
        cellId: Utils.getRandomId(),
        pos,
        score: 1,
        // uiStr: _geCellUiStr('food', 'food')
    }
}


function getIsborder(pos, boardHeight, boardWidth) {
    const {i,j} = pos;

    if ((i === 10 && (j === boardWidth-1 || j === 0)) || 
        (j === 10 && (i === boardHeight-1 || i === 0))) return false;

    if (i === 0 || j === 0 || i === boardHeight-1 || j === boardWidth-1) return true;

    if ((i >= 10 && i <= 15) && 
        (j === 7 || j === 13) ||
        i === 15 && j <= 13 && j >= 7) {
            return true;
    }

    return false
}


function getIsEnemyInitPos({i,j}) {
  return (i === 10 || i === 12) && (j === 9 || j === 11);
}

function getAllEmptyPoss(board) {
  // var {board} = gState;
  var empties = [];
  for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
          if (board[i][j].isEmpty && !this.getIsEnemyInitPos({i,j})) empties.push({i,j});
      }
  }
  return empties;
}