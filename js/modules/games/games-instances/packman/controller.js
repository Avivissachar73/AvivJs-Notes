// import { Utils } from '../../../../services/utils.service.js'
import createBtnsController from '../../services/btn-controls.cmp.js';

import { TableService } from '../../services/TableService.js';




export class PackmanController {
  isSupperMode = false;
  isGameOver = true;
  WELCOME_MSG = 'Hello!<br/>do you think you can collect all the foods in the market without being infected by any of the other costumers?<br/>Lets play!';
  PAUSE_MSG = '';
  offers = [];
  popup = null;
  tableService = null;

  constructor(Emitter, popupInstance, containerSelector) {
    this.EventManager = Emitter;
    this.container = document.querySelector(containerSelector);
    this.popup = popupInstance;

    this.init();
  }
  
  async init() {
    this.setDomMethods();
    this.connectEvents();
    createBtnsController((ev) => this.handleKeyPress(ev), null, 'main');
    this.initGame(false);
    // setReSizeBoard();
    if (await this.popup.Confirm(this.WELCOME_MSG)) {
        this.initGame(true);
        this.isGameOver = false;
    }
  }

  
  setDomMethods() {
      this.container.innerHTML = this.constructor.HTMLcontent;
      this.container.querySelector('.reset-btn').onclick = () => {
          this.initGame(true);
          this.isGameOver = false;
      }
      this.container.querySelector('.pause-btn').onclick = (ev) => this.pauseGame(ev);
      document.body.onkeydown = ev => this.handleKeyPress(ev);
      // document.querySelector(BOARD_SELECTOR).onkeydown = handleKeyPress;
  }
  
  async pauseGame() {
      if (this.isGameOver) return;
      this.EventManager.emit('pause-game');
      await this.popup.Alert(this.PAUSE_MSG);
      this.EventManager.emit('resurm-game');
  }
  
  handleKeyPress(event) {
      const key = event.key;
    //   event.preventDefault?.();
      if (event.preventDefault && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
          event.preventDefault();
      }
      if (key === 'ArrowLeft') this.EventManager.emit('move-player', {i:0,j:-1});
      if (key === 'ArrowRight') this.EventManager.emit('move-player', {i:0,j:1});
      if (key === 'ArrowUp') this.EventManager.emit('move-player', {i:-1,j:0});
      if (key === 'ArrowDown') this.EventManager.emit('move-player', {i:1,j:0});
      if (key === 'Escape') this.pauseGame();
  }
  
  initGame(isStart) {
      this.EventManager.emit('set-game', isStart);
  }

  destroy() {
    this.tableService.destroy();
    this.disconnectEvs();
  }
  
  
  disconnectEvs() {
    this.offers.forEach(c => c?.());
  }
  
  connectEvents() {
      this.offers = [
        this.EventManager.on('game-setted', (board, bestScore) => {
          if (this.tableService) this.tableService.destroy();
            this.tableService = new TableService('#board', board, (pos, cell) => this.getCellHtmlStr(cell));
            this.renderBoard(board);
            this.PAUSE_MSG = bestScore ? `Game paused <br/><br/> Best score: ${bestScore.score} by - ${bestScore.name}` : 'Game paused';
            // reSizeBoard();
        }),
        this.EventManager.on('object-moved', (fromPos, toPos, board) => {
            this.renderCellByPos(fromPos, board);
            this.renderCellByPos(toPos, board);
        }),
        this.EventManager.on('player-eaten', (pos, board) => {
            this.renderCellByPos(pos, board);
        }),
        this.EventManager.on('game-over', async (isVictory, score, isNewHighScore) => {
            // console.log('game-over, isVictory:', isVictory, 'score:', score, 'isNewBest:', isNewHighScore);
            if (isVictory) {
                if (isNewHighScore) {
                    let playerName = await this.popup.Prompt(`You broke the high score! You got ${score} points! <br/> save score?`, 'Your name');
                    if (playerName) this.EventManager.emit('save-score', playerName)
                }
                else this.popup.Alert(`You win! Score: ${score}`);
            }
            // else this.popup.Alert(`Game over...  Score: ${score}`);
            else this.popup.Alert(`Game over... <br/> You been infected by a sick costumer.. <br/> Score: ${score}`);
            this.isGameOver = true;
        }),
        this.EventManager.on('score-update', score => {
            document.querySelector('.score-span').innerText = score;
        }),
        this.EventManager.on('obj-added', (pos, board) => {
            this.renderCellByPos(pos, board);
        }),
        this.EventManager.on('supper-mode', duration => {
            this.isSupperMode = true;
            setTimeout(() => this.isSupperMode = false, duration);
        })
      ];
  }
  
  renderBoard(board) {
      this.tableService.render();
      this.tableService.setReSizeBoard();
      // boardGameUtils.renderBoard(board, cell => this.getCellHtmlStr(cell), '#board');
      // boardGameUtils.setReSizeBoard('#board', 'table');
  }
  
  renderCellByPos(pos, board) {
      this.tableService.updateCell(pos, board[pos.i][pos.j]);
      // boardGameUtils.renderCellByPos(pos, board, cell => this.getCellHtmlStr(cell));
  }
  
  
  getCellHtmlStr(cell) {
      // const contentStr = cell.uiStr;
      const contentStr = (() => {
        if (cell.isEmpty || cell.type === 'border') return ' ';
        if (cell.type === 'player') return '🤠';
        if (cell.type === 'enemy') return ['😷','🤒','🤕','🤢','🤮','🤧'][0];
        if (cell.type === 'food' && cell.subtype === 'food') return ' ';
        if (cell.subtype === 'supper-food') return ['☕','🥛','🍷','🍸','🍺','🍻','🥃','🥤'][0];
        if (cell.subtype === 'cherry') return ['🥑','🍒','🍆','🍉','🍌','🍅','🥥','🥔','🥦','🥕','🌽','🥒','🍄','🍇','🍞','🥐','🥨','🍦','🍨','🍩','🍪','🍰','🍔','🍟','🍕','🌮','🥪','🍿','🍲','🥘','🍳','🥡','🍭','🍬','🍫','🥫'][0];
        return ' ';
      })();
      const styleStr = (() => {
          var styleStr = '';
          if (cell.type === 'enemy') styleStr += ` background-color:${this.isSupperMode? '#b88ae8' : cell.color};`;
          return styleStr;
      })();
      const classListStr = (() => {
          return `${cell.subtype || cell.type || ''}`;
      })();
      return `<span style="${styleStr}" class="${classListStr}">${contentStr}</span>`;
  }


  static HTMLcontent = `
    <style>
      .board-container {
          width: 100%;
          max-width: 400px;
          background-color: #fff;
      }

      .board-container table {
          border-radius: 5px;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
          margin: 0 auto;
          width: 100%;
          height: 100%;
          border-collapse: collapse;
      }

      .board-cell {
          background-color: antiquewhite;
      }

      .board-cell span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
      }


      .board-cell .border {
          background-color: rgb(243, 235, 162);
      }

      .board-cell .food {
          background-color:#a2f3ba;
      }
      .game-info {
        margin-bottom: 20px;
      }
    </style>
    <section class="game-info width-all flex align-center space-around wrap">
        <button class="reset-btn">Restart</button>
        <h3>Score: <span class="score-span">0</span></h3>
        <button class="pause-btn">Pause</button>
    </section>

    <div id="board" class="board-container"></div>
  `;
}