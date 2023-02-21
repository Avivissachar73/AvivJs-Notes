const IS_BACKWORD_EAT = false;
const IS_ROW__MOVE_KING = false;


export const moveMethods = {
  getAllValidMovesFromPos,
  getAllEatMovesFromPos,
  _getAllMovesForRegular,
  _checkIfValidRegularMove,
  _getAllMovesForKing,
  _getDirectionMovesForKing,
  _getAllEatMovesForRegular,
  _checkRegularEatDirection,
  _getAllEatMovesForKing,
  _getDirectionEatMoveForKing
}

export function getAllValidMovesFromPos(pos, board) {
    var validMoves = [];
    var currCell = board[pos.i][pos.j];
    if (!currCell.isKing) {
        validMoves = this._getAllMovesForRegular(pos, board);
    } else {
        validMoves = this._getAllMovesForKing(pos, board);
    }
    return validMoves;
}



export function getAllEatMovesFromPos(pos, board, isBackwardEat) {
    var validMoves = [];
    var currCell = board[pos.i][pos.j];
    if (!currCell.isKing) {
        validMoves = this._getAllEatMovesForRegular(pos, board, isBackwardEat);
    } else {
        validMoves = this._getAllEatMovesForKing(pos, board);
    }
    // gState.validEatPos = validMoves;
    return validMoves;
}


/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

/* MOVE UTILS */ 

function _getAllMovesForRegular(pos, board) {
    var validMoves = []
    for (let i = pos.i-1; i <= pos.i+1; i++) {
        for (let j = pos.j-1; j <= pos.j+1; j++) {
            if (!board[i] || !board[i][j] ||
                i === pos.i && j === pos.j) continue;
            if (this._checkIfValidRegularMove(pos, {i,j}, board)) {
                validMoves.push({i,j});
            }
        }
    }
    return validMoves;
}
function _checkIfValidRegularMove(fromPos, toPos, board) {
    var itemToMove = board[fromPos.i][fromPos.j];
    if (toPos.i - (fromPos.i + itemToMove.movingdiff) !== 0) return; 
    if (toPos.i === fromPos.i || toPos.j === fromPos.j) return false
    var absI = Math.abs(fromPos.i-toPos.i);
    var absJ = Math.abs(fromPos.j-toPos.j);
    return (absI === 1 && absJ === 1 && board[toPos.i][toPos.j].isEmpty);
}

function _getAllMovesForKing(pos, board) {
    var validPoss = []
    if (IS_ROW__MOVE_KING) {
        validPoss.push(...this._getDirectionMovesForKing(board, pos, 1*this.KING_ROW_STEP, 0));     // ROWS
        validPoss.push(...this._getDirectionMovesForKing(board, pos, -1*this.KING_ROW_STEP, 0));
        validPoss.push(...this._getDirectionMovesForKing(board, pos, 0, 1*this.KING_ROW_STEP));
        validPoss.push(...this._getDirectionMovesForKing(board, pos, 0, -1*this.KING_ROW_STEP));
    }

    validPoss.push(...this._getDirectionMovesForKing(board, pos, 1, 1));     // DIAGONALS
    validPoss.push(...this._getDirectionMovesForKing(board, pos, -1, -1));
    validPoss.push(...this._getDirectionMovesForKing(board, pos, 1, -1));
    validPoss.push(...this._getDirectionMovesForKing(board, pos, -1, 1));
    return validPoss;
}

function _getDirectionMovesForKing(board, pos, difI, difJ) {
    var validPoss = []
    for (let counter = 1; counter < board[0].length; counter++) {
        let currI = pos.i + (counter*difI);
        let currJ = pos.j + (counter*difJ);
        if (!board[currI] || !board[currI][currJ]) break;
        if (board[currI][currJ].isEmpty) validPoss.push({i: currI, j: currJ});
        else break;
    }
    return validPoss;
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

/* EAT MOVE UTILS */ 

function _getAllEatMovesForRegular(pos, board, isBackwardEat) {
    var currPice = board[pos.i][pos.j];
    var moveDiff = currPice.movingdiff;
    var testDiffs = [{i: moveDiff, j: 1},{i: moveDiff, j: -1}];
    if (IS_BACKWORD_EAT || isBackwardEat) testDiffs.push({i: -moveDiff, j: -1},{i: -moveDiff, j: 1});
                    
    
    var validMoves = [];

    for (let diff of testDiffs) {
        let checkEatPos = this._checkRegularEatDirection(board, pos, diff.i, diff.j);
        if (checkEatPos) validMoves.push(checkEatPos);
    }

    return validMoves;
}
function _checkRegularEatDirection(board, pos, directionI, directionJ) {
    var currPice = board[pos.i][pos.j];
    var testI = pos.i + directionI;
    var testJ = pos.j + directionJ;
    if (!board[testI] || !board[testI][testJ]) return
    var testCell = board[testI][testJ];
    if (!testCell.isEmpty && testCell.playerId !== currPice.playerId) {
        let checkI = pos.i + (directionI*2);
        let checkJ = pos.j + (directionJ*2);
        if (board[checkI] && board[checkI][checkJ] && board[checkI][checkJ].isEmpty) {
            return {i: checkI, j: checkJ};
        }
    }
}

function _getAllEatMovesForKing(pos, board) {
    var currPice = board[pos.i][pos.j];
    var validMoves = [];

    var testDiffs = [
        {i: 1, j: 1},{i: 1, j: -1}, {i: -1, j: 1},{i: -1, j: -1} // DIAGONALS
    ]; 
    if (IS_ROW__MOVE_KING) {testDiffs.push(
        {i: 1*this.KING_ROW_STEP, j: 0},{i: -1*this.KING_ROW_STEP, j: 0}, {i: 0, j: 1*this.KING_ROW_STEP},{i: 0, j: -1*this.KING_ROW_STEP},  // ROWS
    )}

    for (let posDiff of testDiffs) {
        let eatDiff = 1;
        if (posDiff.i === 0 || posDiff.j === 0) eatDiff = this.KING_ROW_STEP;
        let checkEatPos = this._getDirectionEatMoveForKing(board, pos, posDiff.i, posDiff.j, eatDiff);
        if (checkEatPos) validMoves.push(checkEatPos);
    }
    
    return validMoves;
}


function _getDirectionEatMoveForKing(board, pos, difI, difJ, eatDiff) {
    var currPice = board[pos.i][pos.j];
    for (let counter = 1; counter < board[0].length; counter++) {
        let currI = pos.i + (counter*difI);
        let currJ = pos.j + (counter*difJ);
        if (!board[currI] || !board[currI][currJ]) break;
        let checkCell = board[currI][currJ];
        if (checkCell.isEmpty) continue;
        else if (checkCell.playerId !== currPice.playerId) {
            let testI = pos.i + ((counter+eatDiff)*difI);
            let testJ = pos.j + ((counter+eatDiff)*difJ);
            if (board[testI] && board[testI][testJ] && board[testI][testJ].isEmpty) {
                return {i: testI, j: testJ};
            } else break;
        }
        else break;
    }
    return;
}