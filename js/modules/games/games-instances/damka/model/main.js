import { Utils } from '../../../../../../lib/utils.service.js';


export const mainMethods = {
  $init,
  setState,
  $cellClicked,
  $checkGameVictory,
  $setGameNextTurn,
  toggleSelectCellByPos,
  movePiece,
  handleEat,
  getEatenPos,
  setNextTurn,
  checkVictory,
  $doHandleMoveRes,
  doComTurn,
  computerTurn,
  getOtherId,
  getEvs
}

function getEvs() {
    return [
        {
            on: 'set-game',
            do(isVsCom) {
                this.$init(isVsCom);
            }
        },
        {
            on: 'cell-clicked',
            do({i,j}) {
                this.$cellClicked({i,j});
            }
        },
        {
            on: 'skip-turn',
            do() {
                if (this.state.isVsCom && this.state.currPlayerIdTurn === this.constructor.PLAYER_COM_ID) return;
                this.$setGameNextTurn();
                if (this.state.isVsCom && this.state.currPlayerIdTurn === this.constructor.PLAYER_COM_ID) this.doComTurn(this.state, true);
            }
        }
    ]
}



function $init(isVsCom) {
    this.state = this.constructor.setState(isVsCom, this.boardSize);
    this.EvEmitter.emit('game-seted', Utils.copy(this.state));
    this.$setGameNextTurn()
}

function setState(isVsCom, boardSize) {
    const boardRes = this.createGameBoard(boardSize);
    var state = {
        board: boardRes.board,
        players: boardRes.players,
        boardSize: boardRes.size,
        selectedPos: null,
        validMovesPoss: [],
        validEatPoss: [],
        playersPoints: {},
        currPlayerIdTurn: null,
        amountOfPiecesOnBoard: 0,
        isReTurn: false,
        isGameOn: true,
        isVsCom
    }
    state.amountOfPiecesOnBoard = state.players[this.PLAYER_1_ID].length + state.players[this.PLAYER_2_ID].length;

    state.playersPoints[this.PLAYER_1_ID] = 0;
    state.playersPoints[this.PLAYER_2_ID] = 0;

    return state;
}


async function $cellClicked(currSelectedPos) {
    const { state } = this;
    if (!state.isGameOn) return;
    var prevSelectedPos = state.selectedPos;
    var {i,j} = currSelectedPos;
    var {board} = state;
    var clickedCell = state.board[i][j];
    
    if (state.isVsCom && clickedCell.playerId === this.constructor.PLAYER_COM_ID) return;
    
    if (state.isReTurn && 
        !state.validEatPoss.find(pos => pos.i === currSelectedPos.i && pos.j === currSelectedPos.j)) {
            return;
    }
        
    if (!prevSelectedPos) {
        if (clickedCell.playerId === state.currPlayerIdTurn) {
            this.constructor.toggleSelectCellByPos(currSelectedPos, state);
    
            let validMoves = this.constructor.getAllValidMovesFromPos(currSelectedPos, board);
            state.validMovesPoss = validMoves;
            let validEatMoves = this.constructor.getAllEatMovesFromPos(currSelectedPos, board, state.isReTurn);
            state.validEatPoss = validEatMoves;
    
            if (!validMoves.length && !validEatMoves.length) {
                state.selectedPos = null;
                return;
            }
            this.EvEmitter.emit('cell-selected', Utils.copy(currSelectedPos), 
                                               Utils.copy(validMoves), 
                                               Utils.copy(validEatMoves));
            return
        } else {
            return;
        }
    } 
    else if (!(state.validMovesPoss.find(pos => pos.i === currSelectedPos.i && pos.j === currSelectedPos.j) ||
               state.validEatPoss.find(pos => pos.i === currSelectedPos.i && pos.j === currSelectedPos.j))) {
        
        state.selectedPos = null;
        this.EvEmitter.emit('un-select');
        return;
    }
    else {
        let moveRes = this.constructor.movePiece(state, prevSelectedPos, currSelectedPos);
        this.EvEmitter.emit('un-select');
        await this.$doHandleMoveRes(moveRes);
    }
}

function $checkGameVictory() {
    let possibleWinnerId = this.constructor.checkVictory(this.state);
    if (possibleWinnerId) {
        this.EvEmitter.emit('game-over', possibleWinnerId, this.state.isVsCom, possibleWinnerId === this.constructor.PLAYER_COM_ID);
    }
}

function $setGameNextTurn() {
    this.constructor.setNextTurn(this.state);
    this.EvEmitter.emit('un-select');
    this.EvEmitter.emit('turn-setted', this.state.currPlayerIdTurn);
}

function toggleSelectCellByPos({i, j}, state) {
    var {board} = state;

    if ((!state.selectedPos || (state.selectedPos.i !== i || state.selectedPos.j !== j)) && !board[i][j].isEmpty) {
        state.selectedPos = {i,j};
    } else {
        state.selectedPos = null;
    }
}

export function movePiece(state, fromPos, toPos) {
    var {board} = state;
    state.selectedPos = null;

    var currPiece = board[fromPos.i][fromPos.j];

    var toPosInValidMoves = state.validMovesPoss.find(curr => toPos.i === curr.i && toPos.j === curr.j);
    var toPosInValidEats = state.validEatPoss.find(curr => toPos.i === curr.i && toPos.j === curr.j);

    if (!toPosInValidMoves && !toPosInValidEats) return;

    state.validMovesPoss = [];
    state.validEatPoss = [];

    board[fromPos.i][fromPos.j].pos = toPos;
    board[toPos.i][toPos.j].pos = fromPos;
    let temp = board[fromPos.i][fromPos.j];
    board[fromPos.i][fromPos.j] = board[toPos.i][toPos.j];
    board[toPos.i][toPos.j] = temp;


    var isEaten = false;
    var eatenPos = null;
    if (toPosInValidEats) {
        isEaten = true;
        eatenPos = this.handleEat(fromPos, toPos, state, currPiece);
    }

    if ((toPos.i === state.boardSize-1 && currPiece.movingdiff > 0) || (toPos.i === 0 && currPiece.movingdiff < 0)) {
        if (!currPiece.isKing) {
            currPiece.isKing = true;
            state.playersPoints[currPiece.playerId]++;
        }
    }
    var isMoved = true;

    let possibleNextEatPoss = this.getAllEatMovesFromPos(toPos, board, true);
    if (isEaten && possibleNextEatPoss.length) {
        state.isReTurn = true;
        state.selectedPos = toPos;
        state.validEatPoss = possibleNextEatPoss;
    } else {
        state.isReTurn = false;
    }

    return {isMoved, isReTurn: state.isReTurn, isEaten, eatenPos, fromPos, toPos};
}

function handleEat(fromPos, toPos, state, eater) {
    var {board} = state;
    let eatenPos = getEatenPos(fromPos, toPos, board);
    let eatenCell = board[eatenPos.i][eatenPos.j];
    let players = state.players;
    board[eatenPos.i][eatenPos.j] = this.createEmptyCell(eatenPos);
    
    let eatenIdx = players[eatenCell.playerId].findIndex(curr => curr.cellId === eatenCell.cellId);
    players[eatenCell.playerId].splice(eatenIdx, 1);
    
    state.playersPoints[eater.playerId]++;
    return eatenPos;
}

function getEatenPos(fromPos, toPos) {
    var diffI = 0;
    var diffJ = 0;
    let multDiff = 1
    if (fromPos.j === toPos.j || fromPos.i === toPos.i) multDiff = this.KING_ROW_STEP;

    if (fromPos.i > toPos.i)  diffI = 1*multDiff;
    else if (fromPos.i < toPos.i)  diffI = -1*multDiff;

    if (fromPos.j > toPos.j)  diffJ = 1*multDiff;
    else if (fromPos.j < toPos.j)  diffJ = -1*multDiff;

    return {i: toPos.i + diffI, j: toPos.j + diffJ};
}

export function setNextTurn(state) {
    state.isReTurn = false;
    state.validMovesPoss = [];
    state.validEatPoss = [];
    state.selectedPos = null;

    if (!state.currPlayerIdTurn) state.currPlayerIdTurn = this.PLAYER_1_ID;
    else state.currPlayerIdTurn = state.currPlayerIdTurn === this.PLAYER_1_ID ? this.PLAYER_2_ID : this.PLAYER_1_ID;
}

export function checkVictory(state) {
    var players = state.players;
    for (let playerId in players) {
        if (players[playerId].length === 0) {
            return this.getOtherId(playerId);
        }
    }
}


async function $doHandleMoveRes(moveRes = {}) {
    const { state } = this;
    if (moveRes.isMoved) {
        this.EvEmitter.emit('player-moved', Utils.copy(moveRes.fromPos), Utils.copy(moveRes.toPos), Utils.copy(state.board));
    }
    if (moveRes.isEaten) {
        this.EvEmitter.emit('player-eaten', Utils.copy(moveRes.eatenPos), Utils.copy(state.board), state.playersPoints);
    }
    if (moveRes.isReTurn) {
        if (state.isVsCom && state.currPlayerIdTurn === this.constructor.PLAYER_COM_ID) {
            this.doComTurn(state, true);
        }
        else this.EvEmitter.emit('cell-selected', Utils.copy(moveRes.toPos), [], Utils.copy(state.validEatPoss));
    } else {
            this.$checkGameVictory();
            this.$setGameNextTurn();
            if (state.isVsCom && state.currPlayerIdTurn === this.constructor.PLAYER_COM_ID) {
                await this.doComTurn(state, true);
            }
    }
}

function doComTurn(state, isDelay) {
    if (!state.isGameOn) return;
    if (isDelay) {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                await this.computerTurn(state);
                resolve();
            }, 100);
        
        }) 
    } else return this.computerTurn(state);
}

async function computerTurn(state) {
    if (!state.isGameOn) return;
    var comMove = this.constructor.getComMove(state, this.comStepsToCalcAhead, true);
    if (!comMove) {
        return this.$setGameNextTurn();
    } else {
        var {fromPos, toPos, isEat} = comMove;
        if (!isEat) state.validMovesPoss = [toPos];
        else state.validEatPoss = [toPos];
        var moveRes = this.constructor.movePiece(state, fromPos, toPos);
        await this.$doHandleMoveRes(moveRes);
    }
}

export function getOtherId(id) {
    id = +id;
    return id === this.PLAYER_1_ID ? this.PLAYER_2_ID : this.PLAYER_1_ID;
}