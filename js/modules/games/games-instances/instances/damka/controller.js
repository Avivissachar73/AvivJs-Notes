import { BaseGameController } from '../BaseBoardGame.class.js';

const MARKED_CLASS = 'marked';
const SELECTED_CLASS = 'selected'
const MARKED_TO_EAT_CLASS = 'eatable'

export class DamkaController extends BaseGameController {
  constructor(containerSelector, Emitter, popupInstance) {
    super(containerSelector, Emitter, popupInstance);

    // document.querySelector(containerSelector).innerHTML = 'COMING SOON';
    
    this.connectEvents();
    this.init(true);
  }

  evs = [
    {
        on: 'game-seted',
        do({board, isVsCom}) {
            this.container.innerHTML = this.constructor.HTMLcontent;
            this.container.querySelector('.skip-turn-btn').onclick = (ev) => this.onSkipTurn(ev);
            this.container.querySelector('#regMode').onclick = (ev) => this.init(false);
            this.container.querySelector('#comMode').onclick = (ev) => this.init(true);
            this.initTableService(board);
            isVsCom ? 
                this.selectBtn('comMode') :
                this.selectBtn('regMode') ;
        }
    },
    {
        on: 'select-el',
        do(pos) {
            this.selectElByPos(pos);
        }
    },
    {
        on: 'clear-select',
        do() {
            this.clearAllElsClass(SELECTED_CLASS);
        }
    },
    {
        on: 'player-moved',
        do(fromPos, toPos, board) {
            this.tableService.updateCell(fromPos, board[fromPos.i][fromPos.j]);
            this.tableService.updateCell(toPos, board[toPos.i][toPos.j]);
        }
    },
    {
        on: 'cell-selected',
        do(currSelectedPos, validMoves, validEatMoves) {
            this.toggleSelectCellByPos(currSelectedPos);
            this.toggleMarkCells(validMoves);
            this.toggleMarkEatCells(validEatMoves);
        }
    },
    {
        on: 'un-select',
        do() {
            this.clearAllElsClass(SELECTED_CLASS);
            this.clearAllElsClass(MARKED_CLASS);
            this.clearAllElsClass(MARKED_TO_EAT_CLASS);
        }
    },
    {
        on: 'player-eaten',
        do(pos, board) {
            this.tableService.updateCell(pos, board[pos.i][pos.j]);
        }
    },
    {
        on: 'game-over',
        do({winnerId, isComWinner, isVsCom}) {
            if (isVsCom) this.popup.Alert(isComWinner? 'Computer wins..' : `You win!`);
            else this.popup.Alert(`Player ${winnerId} won!`);
        }
    },
    {
        on: 'turn-setted',
        do(currPlayerId) {
            this.renderCurrPlayerTurn(currPlayerId);
        }
    }
  ]

  init(isVsCom) {
      this.EvEmitter.emit('set-game', isVsCom);
  }



  getCellHtmlStr(cell, pos) { return this.constructor.getCellHtmlStr(cell) }


  cellClicked(pos) {
      this.EvEmitter.emit('cell-clicked', pos);
  }


  toggleSelectCellByPos({i, j}) {
      var el = this.tableService._getElCellByPos({i, j});
      el.classList.toggle(SELECTED_CLASS);
  }

  clearAllElsClass(className) {
      var els = document.querySelectorAll(`.${className}`);
      els.forEach(curr => curr.classList.remove(className));
  }

  static getCellHtmlStr(cell) {
      // '♔♕ K ♚♛';
      if (cell.isEmpty) return '';
      else return `<div class="player player-${cell.playerId}">${cell.isKing? '<span>♛</span>' : ''}</div>`;
  }

  selectElByPos(pos) {
      this.clearAllElsClass(SELECTED_CLASS);
      var elCell = this.tableService._getElCellByPos(pos);
      elCell.classList.add(SELECTED_CLASS);
  }

  addClassToCellsByPosses(poses, selector) {
      let els = this.getElsByPoses(poses)
      els.forEach(curr => curr.classList.add(selector));
  }

  getElsByPoses(poss) {
      return poss.map(currPos => {
          return this.tableService._getElCellByPos(currPos);
      });
  }

  toggleMarkCells(validMoves) {
      var markedEls = document.querySelectorAll(`.${MARKED_CLASS}`);
      if (markedEls.length) this.clearAllElsClass(MARKED_CLASS);
      else this.addClassToCellsByPosses(validMoves, MARKED_CLASS);
  }

  toggleMarkEatCells(poses) {
      var markedEls = document.querySelectorAll(`.${MARKED_TO_EAT_CLASS}`);
      if (markedEls.length) this.clearAllElsClass(MARKED_TO_EAT_CLASS);
      else this.addClassToCellsByPosses(poses, MARKED_TO_EAT_CLASS);
  }

  onSkipTurn() {
      this.EvEmitter.emit('skip-turn');
  }

  renderCurrPlayerTurn(currPlayerId) {
      var elTurnSpan = document.querySelector('.player-turn span');
      elTurnSpan.classList = `player-${currPlayerId}`;
  }



  selectBtn(btnId) {
      const btnSelectedClass = 'btn-selected';
      document.querySelectorAll(`.${btnSelectedClass}`).forEach(elBtn => {
          elBtn.classList.remove(btnSelectedClass);
      });
      document.querySelector(`#${btnId}`).classList.add(btnSelectedClass);
  }


  static HTMLcontent = `
    <style>    
      .board-container {
          color: black;
          /* width: 50vw;
          height: 50vw; */
          width: 100%;
          background-color: #fff;
          /* height: 100%; */
      }
      
      .board-container table {
          /* border: 7.5px solid burlywood;
          border-radius: 7.5px; */
          border: 5px solid burlywood;
          border-radius: 5px;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
          margin: 0 auto;
          width: 100%;
          height: 100%;
          /* width: 500px;
          height: 500px; */
      }
      .board-container table td {
          /* width: 50px;
          height: 50px; */
          /* width: 12%;
          height: 12%; */
      }
      
      .board-container table tr:nth-child(even) td:nth-child(even), .board-container table tr:nth-child(odd) td:nth-child(odd) {
          background-color: rgb(255, 234, 164);
      }
      .board-container table tr:nth-child(even) td:nth-child(odd), .board-container table tr:nth-child(odd) td:nth-child(even) {
          background-color: rgb(119, 61, 36);
      }
      
      .board-container .board-cell.selected {
          outline: 3px solid gold;
      }
      .board-container .board-cell.marked {
          background-color: rgb(190, 188, 221) !important;
      }
      .board-container .board-cell.eatable {
          background-color: rgba(255, 8, 0, 0.5) !important;
          /* background-color: rgb(252, 86, 80) !important; */
      }
      
      .board-container .board-cell:hover {
          background-color: beige !important;
          cursor: pointer;
      }
      
      .board-container .board-cell .player {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          /* box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(0, 0, 0, 0.5); */
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
      
          position: relative;
      }
      
      .board-container .player span {
          /* font-size: 2.7em; */
          font-size: 1em;
          padding-bottom: 3px;
          position: absolute;
          bottom: 50%;
          right: 50%;
          transform: translate(50%, 50%);
      }
      
      .player-1 {
          background-color: rgb(63, 94, 153);
      }
      .player-2 {
          background-color: rgb(247, 71, 71);
      }







      .game-info {
          /* max-width: 60%; */
          /* max-width: 400px; */
          width: 100%;
          margin: 0 auto;
          margin-bottom: 5px;
      }
      
      /* .game-info >*:not(:last-child) {
          margin-right: 5px;
          margin-bottom: 5px;
      } */
      .game-info >* {
          margin: 5px;
      }
      
      .player-turn >* {
          /* margin: 0 5px; */
          margin-left: 5px;
      }
      
      .player-turn span {
          border: 1px solid rgba(90, 89, 89, 0.5);
          box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
          display: flex;
          width: 15px;
          height: 15px;
          border-radius: 50%;
      }
      
      .btn-selected {
          /* background-color: rgb(177, 241, 191); */
          /* box-shadow: 0px 0px 10px 3px rgb(237, 241, 177); */
          border: 1px solid #c4c4c4;
      }
    </style>    
    <section class="game-info width-all flex align-center space-around wrap">
      <button  id="regMode" onclick="init(false)">2 Players</button>
      <button id="comMode" onclick="init(true)">VS Com</button>
      <button class="skip-turn-btn" onclick="onSkipTurn()">Skip Turn</button>
      <div class="player-turn flex align-center"><p>Player: </p><span></span></div>
    </section>


    <div id="board" class="board-container"></div>
  `;
}