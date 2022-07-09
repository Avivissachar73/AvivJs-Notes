import { Utils } from '../../../../../services/utils.service.js';


export const comMethods = {
  getComMove,
  getSimpleNextMove,
  getBestMove,
  getBestMove,
  comPlay,
  playNthMovesFromMove
}

function getComMove(state, amountOfMovesToPlay = 3, isRoot) {
    state = JSON.parse(JSON.stringify(state));
    var currPlayerId = state.currPlayerIdTurn;

    var players = state.players[currPlayerId];

    var allValidMoves = [];
    var allValidEatMoves = [];

    var isReTurn = state.isReTurn;

    var playersToCheck = players;
    if (isReTurn) {
        playersToCheck = [state.board[state.selectedPos.i][state.selectedPos.j]];
    }

    playersToCheck.forEach(curr => {
        let currValids = this.getAllValidMovesFromPos(curr.pos, state.board);
        currValids.forEach(pos => {
            allValidMoves.push({fromPos: curr.pos, toPos: pos, isEat: false});
        });

        let currEatValids = this.getAllEatMovesFromPos(curr.pos, state.board, state.isReTurn);
        currEatValids.forEach(pos => {
            allValidEatMoves.push({fromPos: curr.pos, toPos: pos, isEat: true});
        });
    });

    var allMoves = [...allValidEatMoves, ...allValidMoves];
    if (!allMoves.length) return;

    return this.getBestMove(allMoves, state, isRoot, amountOfMovesToPlay);
}

function getSimpleNextMove(moves) {
    var eatMoves = moves.filter(move => move.isEat);
    var regMoves = moves.filter(move => !move.isEat);

    if (eatMoves.length) {
        return eatMoves[Utils.getRandomInt(0, eatMoves.length-1)];
    } else {
        return regMoves[Utils.getRandomInt(0, regMoves.length-1)];
    }
}

function getBestMove(moves, state, isRoot, amountOfMovesToPlay) {
    state = JSON.parse(JSON.stringify(state));
    
    var friendlyId = state.currPlayerIdTurn;
    var enemyId = this.getOtherId(friendlyId);

    var prevPoints = {...state.playersPoints};

    for (let move of moves) {
        let currPoints = this.playNthMovesFromMove(move, amountOfMovesToPlay, state, isRoot).playersPoints;

        move.score = (currPoints[friendlyId] - prevPoints[friendlyId]) - (currPoints[enemyId] - prevPoints[enemyId]);
    }

    var bestScore = moves.sort((a, b) => b.score - a.score)[0].score;
    var bestMoves = moves.filter(move => move.score === bestScore);
    var moveToReturn = bestMoves[Utils.getRandomInt(0, bestMoves.length-1)];
    return moveToReturn;
}


function comPlay(state, move, amountOfMovesToPlay) {
    if (!state.isGameOn || !move) return;
    if (!move.isEat) state.validMovesPoss = [move.toPos];
    else state.validEatPoss = [move.toPos];
    // state.validMovesPoss = getAllValidMovesFromPos(fromPos, state.board);
    // state.validEatPoss = getAllEatMovesFromPos(fromPos, state.board, state.isReTurn);
    var moveRes = this.movePiece(state, move.fromPos, move.toPos);
    if (moveRes.isReTurn) {
        this.comPlay(state, this.getComMove(state, amountOfMovesToPlay, false));
    } else {
        this.checkVictory(state);
        this.setNextTurn(state);
    }
}


function playNthMovesFromMove(move, amountOfMovesToPlay, state, isRoot) {
    state = JSON.parse(JSON.stringify(state));
    var moveToPlay = {...move};

    if (amountOfMovesToPlay <= 0) return state;

    for (let i = 0; i < amountOfMovesToPlay; i++) {
        if (!state.isGameOn || amountOfMovesToPlay <= 0) break;
        for (let playerKey in state.players) {
            if (!state.isGameOn || amountOfMovesToPlay <= 0) break;
            this.comPlay(state, moveToPlay, amountOfMovesToPlay--);
            moveToPlay = this.getComMove(state, amountOfMovesToPlay--, false);
        }
    }
    return state;
}