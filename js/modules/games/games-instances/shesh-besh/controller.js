import { BaseGameController } from "../BaseBoardGame.class.js";

export class SheshBeshController extends BaseGameController {
  constructor(Emitter, popupInstance, containerSelector) {
    super(Emitter, popupInstance, containerSelector);
    
    this.init();
  }
  evs = [
    {
      on: 'game-setted',
      do: (state) => {
        this.state = {...state};
        this.container.innerHTML = 'Shesh-Besh is COMING SOON';
        this.container.innerHTML = `
          <style>
            .shesh-besh-container {
              height: 100%;
              width: 100%;
              max-width: 400px;
              outline: 2px solid red;
            }
            .cell, .boarder, .out {
              height: 100%;
              width: 100%;
              display: flex;
              flex-direction: column
            }
            .cell.reversed {
              justify-content: flex-end 
            }
            .cell.white {
              background-color: bisque
            }
            .cell.black {
              background-color: black
            }
            .cell.light {
              background-color: green
            }
            .cell.selected {
              background-color: gold
            }
            .boarder, .out {
              height: 100%;
              background-color: brown;
              justify-content: flex-end 
            }
            .boarder.reversed, .out.reversed {
              height: 100%;
              background-color: brown;
              justify-content: flex-start 
            }
            .pug {
              width: 100%;
              padding-top: 100%;
              text-align: center;
              border-radius: 50%;
              cursor: pointer;
            }
            .pug.player-1 {
              background-color: red
            }
            .pug.player-2 {
              background-color: blue
            }
            .out
          </style>
          <div class="shesh-besh-container" id="board"></div>
        `;
        this.initTableService(this.constructor.getBoardToView(state));
      },
    },
    {
      on: 'cell-toggled',
      do: (posibleMoves, selectedCell) => {
        this.state.posibleMoves = posibleMoves;
        this.state.selectedCell = selectedCell;
        this.tableService.updateBoard(this.constructor.getBoardToView(this.state));
      }
    },
    {
      on: 'cells-updated',
      do: (updateData) => {
        updateData.forEach(c => {
          if (c.idx === 'eaten') this.state.eatenPugs = c.data;
          else this.state.board.splice(c.idx, 1, c.cell);
        });
        this.tableService.updateBoard(this.constructor.getBoardToView(this.state));
      }
    }
  ];
  
  init() {
    this.connectEvents();
    this.EvEmitter.emit('set-game');
  }

  static getBoardToView(state) {
    const {board} = state;
    const mapedBoard = [
      {type: 'boarder'},
      ...board.map((c, i) => ({
        ...c,
        realIdx: i,
        type: 'cell',
        isWhite: i % 2 === 0,
        selected: i === state.selectedCell,
        light: state.posibleMoves.find(c => c.i === i)
      })),
      {type: 'boarder'},
    ];
    mapedBoard.splice(7, 0, {type: 'out', player: 1, pugs: state.eatenPugs[1]});
    mapedBoard.splice(20, 0, {type: 'out', player: 2, pugs: state.eatenPugs[2]});
    const boardToView = [
      mapedBoard.slice(0, mapedBoard.length/2),
      mapedBoard.slice(mapedBoard.length/2).reverse(),
    ];
    return boardToView;
  }

  static getCellHtmlStr(cell, pos) {
    return `<div class="${cell.type} ${cell.isWhite? 'white' : 'black'} ${pos.i? 'reversed' : ''} ${cell.selected? 'selected' : ''} ${cell.light? 'light' : ''}">
      ${
        cell.pugs && cell.pugs.map(c => `
          <div class="pug player-${c.player}"></div>
        `).join('') || ''
      } 
    </div>`;
  }

  cellClicked(pos, cell) {
    if ('realIdx' in cell) {
      this.EvEmitter.emit('cell-clicked', cell.realIdx);
    }
    else if (cell.type === 'out') {
      if (!cell.pugs.length) return;
      this.EvEmitter.emit('eaten-pug-clicked', cell.player);
    }
    else if (cell.type === 'boarder') {

    }
  }
}