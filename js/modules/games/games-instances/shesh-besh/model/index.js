import { BaseGameModel } from "../../BaseBoardGame.class.js";

export class SheshBeshModel extends BaseGameModel {

  constructor(Emitter) {
    super(Emitter);
    this.connectEvents();
  }
  evs = [
    {
      on: 'set-game',
      do: () => {
        const state = this.constructor.createGameState();
        this.state = state;
        this.EvEmitter.emit('game-setted', state);
      }
    },
    {
      on: 'cell-clicked',
      do: (idx) => {
        const { state } = this;
        const cell = state.board[idx];
        if (state.selectedCell === null) {
          if (cell.pugs.length) {
            this.selectCell(cell.player, idx);
          }
        }
        else {
          if (idx === state.selectedCell) this.unselectCell();
          else if (state.posibleMoves.find(c => c.i === idx)) {
            const move = state.posibleMoves.find(c => c.i === idx);
            this.movePug(idx, move);
            this.unselectCell();
          }
          else if (cell.player) this.selectCell(cell.player, idx);
        }
      }
    },
    {
      on: 'eaten-pug-clicked',
      do: (player) => {
        const { state } = this;
        if (!state.eatenPugs[player].length) return;
        const selectedIdx = 'eaten-' + player;
        if (state.selectedCell === selectedIdx) return this.unselectCell();
        state.selectedCell = selectedIdx;
        state.posibleMoves = this.getAllPossibleResarectionMoves(player);
        this.EvEmitter.emit('cell-toggled', state.posibleMoves, state.selectedCell);
      }
    }
  ];

  selectCell(player, idx) {
    const posibleMoves = this.getAllPossibleWalkMoves(player, idx);
    this.state.posibleMoves = posibleMoves;
    this.state.selectedCell = idx;
    this.EvEmitter.emit('cell-toggled', posibleMoves, idx);
  }
  unselectCell() {
    this.state.posibleMoves = [];
    this.state.selectedCell = null;
    this.EvEmitter.emit('cell-toggled', [], null);
  }

  static initCellPoss = {
    4: 3,
    6: 5,
    12: 2,
    23: 5
  }
  static boardSize = 24;
  static createGameState() {
    const initBoardCell = (i) => {
      let player = null;
      const pugsInCell = [];
      const cellsWithInitPlayers = Object.keys(this.initCellPoss).map(c => +c);
      if (cellsWithInitPlayers.includes(i)) player = 1;
      else if (cellsWithInitPlayers.includes(this.boardSize-1 - i)) player = 2;
      if (player) {
        const pugsInCellCount = this.initCellPoss[i] || this.initCellPoss[this.boardSize-1 - i]
        for (let i = 0; i < pugsInCellCount; i++) pugsInCell.push({player});
      }
      return {
        player,
        pugs: pugsInCell
      }
    }
    const createGameBoard = () => {
      const board = [];
      for (let i = 0; i < this.boardSize; i++) board.push(initBoardCell(i));
      return board;
    }
    const state = {
      board: createGameBoard(),
      eatenPugs: {
        1: [],
        2: []
      },

      posibleMoves: [],
      selectedCell: null,

      cubes: [5, 2]
    };
    return state;
  }

  static playersMoveDirection = {
    1: -1,
    2: 1
  }
  
  static filterMovesByPlayerDirection(player, idxOnBoard, idxToCheck) {
    const direction = this.playersMoveDirection[player];
    if (direction === -1 && idxToCheck > idxOnBoard ||
      direction === 1 && idxToCheck < idxOnBoard) return true;
  }

  getAllPosibleMoves(player, idx, isFilterByDirection) {
    if (!player) return [];
    return this.state.board.reduce((acc, c, i) => {
      if (isFilterByDirection && this.constructor.filterMovesByPlayerDirection(player, idx, i)) return acc;
      const isValidRegMove = !c.pugs.length || c.player === player;
      const isValidEatMove = c.pugs.length === 1 && c.player !== player;
      return isValidRegMove || isValidEatMove? [...acc, {i, type: isValidEatMove? 'eat' : 'reg'}] : acc;
    }, []);
  }

  getAllPossibleWalkMoves(player, idx) {
    const { cubes } = this.state;
    const di = this.constructor.playersMoveDirection[player];
    const allMoves = this.getAllPosibleMoves(player, idx, true);
    return allMoves.filter(c => {
      return c.i === idx + cubes[0]*di || 
             c.i === idx + cubes[1]*di || 
             c.i === idx + (cubes[0]+cubes[1])*di;
    });
  }

  getAllPossibleResarectionMoves(player) {
    const allPosibleMoves = this.getAllPosibleMoves(player, undefined, false);
    const direction = this.constructor.playersMoveDirection[player];
    const { cubes } = this.state;
    const possibleMoves = allPosibleMoves.filter(c => {
      return (direction === 1 && c.i <= 5 || direction === -1 && c.i >= 17) &&
             (direction === 1 && cubes.includes(c.i+1) || direction === -1 && cubes.includes(this.constructor.boardSize - c.i))
    });
    return possibleMoves
  }

  movePug(idx, moveItem) {
    const { state } = this;
    const target = state.board[idx];
    const updatedData = [];
    let pug;
    if (moveItem.type === 'eat') {
      const eatenPug = target.pugs.pop();
      state.eatenPugs[eatenPug.player].push(eatenPug);
      target.player = null;
      updatedData.push({idx: 'eaten', data: state.eatenPugs});
    }
    if (typeof state.selectedCell === 'string') {
      const player = +state.selectedCell.split('-')[1];
      pug = state.eatenPugs[player].pop();
      if (!target.player) target.player = player;
      updatedData.push({idx: 'eaten', data: state.eatenPugs})
    } else {
      const origin = state.board[state.selectedCell];
      if (!origin.pugs.length) return;
      pug = origin.pugs.pop();
      if (!origin.pugs.length) origin.player = null;
      updatedData.push(
        {idx: state.selectedCell, cell: origin},
      );
      if (!target.player) target.player = origin.player;
    }
    target.pugs.push(pug);
    updatedData.push(
      {idx, cell: target}
    );
    this.EvEmitter.emit('cells-updated', updatedData);
  }
}