import { Utils } from '../../../services/utils.service.js'
import createBtnsController from '../services/btn-controls.cmp.js';
import { TableService } from './TableService.js';


export class SnakeModel {
  // import {createBoard} from '../services/utils.service.js';
  // import boardService from './board.service.js';
  // import playerService from './player.service.js';
  // import { Utils.getRandomInt } from '../services/utils.service.js';

  // import scoreService from './score.service.js';

  evManager = null;
  state = null;
  offers = [];

  static STORAGE_KEY = 'snake_best_score';



  constructor(evManager) {
    this.evManager = evManager;

    this.conectEvents();
  }


  static createState() {
      var board = this.createBoard();
      var playerParts = this.setPlayer(board);
      return {
          board,
          playerParts,
          playerInterval: null,
          moveDirection: 'RIGHT',
          directionToSet: 'RIGHT',
          foodInterval: null,
          score: 0,
          bestScore: this.loadScore(),
          isOn: false,
          isSuperMode: false,
          superModeTimeout: null,
          // isPaused: false
      }
  }

  destroy() {
    this.endGame();
    this.disConnectEvents();
  }


  disConnectEvents() {
    this.offers.forEach(c => c?.());
  }

  conectEvents() {
    let { state } = this;
    this.offers = [
      this.evManager.on('set_game', (isToStart) => {
          if (state) this.pauseGame();
          this.state = state = this.constructor.createState();
          this.evManager.emit('game_setted', {board:state.board, bestScore: state.bestScore});
          this.evManager.emit('score_update', 0);
          if (isToStart) this.startGame();
      }),
      this.evManager.on('pause_game', () => {
          this.pauseGame(true);
      }),
      this.evManager.on('resurme_game', () => this.startGame()),
      this.evManager.on('change_direction', direction => {
          state.directionToSet = direction;
      }),
      this.evManager.on('save_new_score', byPlayerName => {
          this.constructor.saveScore(state.score, byPlayerName);
      })
    ];

  }

  startGame() {
      const  {state} = this;
      if (!state || state.isOn) return;
      state.playerInterval = setInterval(() => {
          var direction = state.directionToSet;
          if (!(direction === 'UP' && state.moveDirection === 'DOWN') &&
              !(direction === 'DOWN' && state.moveDirection === 'UP') &&
              !(direction === 'RIGHT' && state.moveDirection === 'LEFT') &&
              !(direction === 'LEFT' && state.moveDirection === 'RIGHT')) {
                  state.moveDirection = direction;
              }
          try{this.movePlayer(state);}
          catch(e){this.endGame();}
      }, 100);
      state.foodInterval = setInterval(() => this.spreadFood(), 5000);
      this.spreadFood();
      state.isOn = true;
  }

  pauseGame(isToEmit) {
      const  {state} = this;
      if (!state || !state.isOn) return;
      clearInterval(state.playerInterval);
      clearInterval(state.foodInterval);
      state.isOn = false;
      if (isToEmit) this.evManager.emit('game_paused');
  }

  endGame() {
      const  {state} = this;
      this.pauseGame();
      var isNewScore = this.constructor.checkIfNewBestScore(state.score);
      this.evManager.emit('game_over', state.score, isNewScore);
      state.isOn = false;
  }

  spreadFood() {
      const  {state} = this;
      const board = state.board;
      var empties = [];
      for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; j++) {
              var item = board[i][j];
              if (item.type === 'FLOOR') empties.push({i,j});
          }
      }
      if (!empties.length) return;
      var idx = Utils.getRandomInt(0, empties.length-1);
      var pos = empties[idx];

      var food = {type: 'FOOD', score: 1};
      if (Math.random() > 0.9) {
          food = {
              type: 'FOOD',
              subtype: 'SUPER',
              score: 10,
              operation: () => {
                  if (state.superModeTimeout) clearTimeout(state.superModeTimeout);
                  state.isSuperMode = true;
                  this.evManager.emit('supermode_on');
                  state.superModeTimeout = setTimeout(() => {
                      state.isSuperMode = false;
                      this.evManager.emit('supermode_off');
                  }, 8000);
              }
          }
      }
      
      board[pos.i][pos.j] = food;
      this.evManager.emit('cell_updated', pos, food);
  }



  ///// playerService //////

  
  static setPlayer(board) {
    const { createPlayerPart } = this;
    var playerParts = [
        createPlayerPart('HEAD', 'RIGHT', {i:15,j:15}),
        createPlayerPart('BODY', 'RIGHT', {i:15,j:14}),
        createPlayerPart('TAIL', 'RIGHT', {i:15,j:13}),
    ];
    playerParts.forEach(curr => {
        let pos = curr.pos;
        board[pos.i][pos.j] = curr;
    });
    return playerParts;
  }


  movePlayer() {
    const { state } = this;
    var {playerParts, board} = state;
    var moveDiff = this.constructor.getMoveDiff(state.moveDirection);
    var firstPart = playerParts[0];
    var lastPart = playerParts[playerParts.length-1];
    var beforelast = playerParts[playerParts.length-2];
    var targetPos = this.constructor.getTargetPos(firstPart.pos, moveDiff, state);
    var targetCell = board[targetPos.i][targetPos.j];
    if (targetCell.type === 'WALL' || targetCell.type === 'PLAYER') {
        throw new Error('invalid move');
    }
    if (targetCell.type === 'FOOD') {
        var newPart = this.constructor.createPlayerPart('HEAD', state.moveDirection, targetPos);
        firstPart.part = 'BODY';
        firstPart = newPart;
        playerParts.push(newPart);
        board[targetPos.i][targetPos.j] = newPart;
        state.score += targetCell.score;
        this.evManager.emit('score_update', state.score);
        if (targetCell.operation) targetCell.operation();
    }
    var LastPrevPos = lastPart.pos;
    lastPart.faceDirection = state.moveDirection;
    lastPart.pos = targetPos;
    lastPart.part = 'HEAD';
    beforelast.part = 'TAIL';
    firstPart.part = 'BODY';
    var item = playerParts.pop();
    playerParts.unshift(item);
    board[LastPrevPos.i][LastPrevPos.j] = this.constructor.createBoardCell(LastPrevPos);
    board[targetPos.i][targetPos.j] = lastPart;

    this.evManager.emit('cell_updated', LastPrevPos, board[LastPrevPos.i][LastPrevPos.j]);
    this.evManager.emit('cell_updated', lastPart.pos, lastPart);
    this.evManager.emit('cell_updated', beforelast.pos, beforelast);
    this.evManager.emit('cell_updated', firstPart.pos, firstPart);
  }

  static getMoveDiff(moveDirection) {
    switch (moveDirection) {
        case 'UP': return {i:-1,j:0};
        case 'DOWN': return {i:1,j:0};
        case 'RIGHT': return {i:0,j:1};
        case 'LEFT': return {i:0,j:-1};
    }
  }


  static createPlayerPart(part = 'BODY', faceDirection = 'RIGHT', pos) {
    return {
        type: 'PLAYER', 
        part, 
        faceDirection, 
        pos
    }
  }

  static getTargetPos(pos, moveDiff, state) {
    var i = pos.i + moveDiff.i;
    var j = pos.j + moveDiff.j;
    if (state.isSuperMode) {
        let board = state.board;
        let isOnI = moveDiff.i !== 0;
        if (isOnI) {
            if (i === 0) i = board.length-2;
            else if (i === board.length-1) i = 1;
        } else {
            if (j === 0) j = board[0].length-2;
            else if (j === board[0].length-1) j = 1;
        }
    }
    return {i, j};
  }


  //////// board service //////////

  static BOARD_HIGHT = 30;
  static BOARD_WIDTH = 30;
  static createBoardCell(pos) {
      if (pos.i === 0 || pos.j === 0 || pos.i === this.BOARD_HIGHT -1 || pos.j === this.BOARD_WIDTH-1) {
          return {type: 'WALL'};
      } else return {type: 'FLOOR', isEmty: true};
  }
  static createBoard() {
      return Utils.createBoard(this.BOARD_HIGHT, this.BOARD_WIDTH, (pos) => this.createBoardCell(pos))
  }



  //////// score service //////

  
  static checkIfNewBestScore(score) {
    if (!score) return false;
    var prevScore = this.loadScore();
    if (!prevScore || prevScore.score < score) return true;
    return false;
  }

  static loadScore() {
    return Utils.loadFromStorage(this.STORAGE_KEY);
  }

  static saveScore(score, by) {
    Utils.storeToStorage(this.STORAGE_KEY, {score, by});
  }
}

export class SnakeController {

  tableService = null;

  constructor(Emitter, popupInstance, containerSelector) {
    this.evManager = Emitter;
    this.popup = popupInstance;
    this.container = document.querySelector(containerSelector);

    this.connectDomEvents();
    
    this.init(false);
  }
  
  async init(isStart) {
    this.connectEvents();
    this.evManager.emit('set_game', isStart);

    await this.popup.Alert('Play Snake!');
    this.evManager.emit('resurme_game');
  }

  connectDomEvents() {
    this.container.innerHTML = `
      <style>
        .board-container {
            width: 400px;
            margin-bottom: 10px;
        } @media (max-width: 500px) {
            .board-container {
                width: 90%;
            }  
        }
        
        
        .info >* {
            margin: 5px;
        }
        
        table {
            border-spacing: 0;
        }
        
        .wall {
            background-color: rgb(240, 199, 150);
        } 
        .supermode .wall {
            animation: supermode-animation 2s infinite;
        }
        .floor {
            background-color: rgb(207, 243, 171);
        }
        .player {
            background-color: rgb(247, 65, 65);
        }
        .food {
            background-color: rgb(145, 151, 236);
        }
        .food-super {
            background-color: rgb(145, 151, 236);
            animation: supermode-animation 2s infinite;
        }
        
        @keyframes supermode-animation {
            50% {
                opacity: 0.1;
            }
            100% {
                opacity: 1;
            }
        }
      </style>
      <div class="info flex align-center space-between wrap width-all container">
          <button class="pause-btn">Pause</button>
          <button class="restart-btn">Restart</button>
      </div>
      <div class="info flex align-center space-between wrap width-all container">
          <h5 class="score">Score: <span>0</span></h5>
          <h5 class="best-score">Best: <span>0</span></h5>
      </div>
      <div class="board-container container"></div>
    `;
    document.body.onkeydown = (ev) => this.handleKey(ev);
    document.querySelector('.restart-btn').onclick = () => this.evManager.emit('set_game', true);
    document.querySelector('.pause-btn').onclick = () => this.pauseGame();
    createBtnsController((ev) => this.handleKey(ev), null, 'main');
  }

  disconnectEvs() {
    this.offers.forEach(c => c?.());
  }

  connectEvents() {
    this.offers = [
      this.evManager.on('game_setted', ({board, bestScore}) => {
          if (bestScore) {
              document.querySelector('.best-score').hidden = false;
              document.querySelector('.best-score span').innerText = `${bestScore.score} - by ${bestScore.by}`;
          } else document.querySelector('.best-score').hidden = true;
          document.querySelector('.board-container').innerHTML = '';
          this.tableService = new TableService('.board-container', board, this.constructor.getCellHTML);
          this.tableService.render();
          this.tableService.setReSizeBoard(true);
      }),
      this.evManager.on('cell_updated', (pos, item) => {
          this.tableService.updateCell(pos, item);
      }),
      this.evManager.on('game_over', async (score, isNewBest) => {
          await Alert(`Game over..<br/><br/>Score: ${score}`);
          if (isNewBest) {
              const playerName = await this.popup.Prompt('You broke the high score!<br/><br/>Save it?', 'Your name');
              if (playerName) this.evManager.emit('save_new_score', playerName);
          }
          var isReplay = await this.popup.Confirm(`Play again?`);
          if (isReplay) {this.evManager.emit('set_game', true);}
      }),
      this.evManager.on('score_update', score => {
          document.querySelector('.score span').innerText = score;
      }),
      this.evManager.on('game_paused', async () => {
          await Alert('Game paused');
          this.evManager.emit('resurme_game');
      }),
      this.evManager.on('supermode_on', () => {
          document.querySelector('.board-container').classList.add('supermode');
      }),
      this.evManager.on('supermode_off', () => {
          document.querySelector('.board-container').classList.remove('supermode');
      }),
    ]
  }

  handleKey(ev) {
    const key = ev.key;
    if (['ArrowUp','ArrowDown','ArrowRight','ArrowLeft'].includes(key) && ev.preventDefault) {
        ev.preventDefault();
    }
    if (key === 'ArrowUp') return this.evManager.emit('change_direction', 'UP');
    if (key === 'ArrowDown') return this.evManager.emit('change_direction', 'DOWN');
    if (key === 'ArrowRight') return this.evManager.emit('change_direction', 'RIGHT');
    if (key === 'ArrowLeft') return this.evManager.emit('change_direction', 'LEFT');
    if (key === 'Escape') return this.pauseGame();
  }

  pauseGame() {
    this.evManager.emit('pause_game');
  }


  static getCellHTML(pos, item) {
    var content = '';
    // content = item.part? item.part.charAt(0) : '';
    var direction = (() => {
        if (item.faceDirection === 'UP') return 0;
        if (item.faceDirection === 'RIGHT') return 90;
        if (item.faceDirection === 'DOWN') return 180;
        if (item.faceDirection === 'LEFT') return 270;
        return 0;
    })();
    var className = item.type.toLowerCase();
    if (item.subtype) className += `-${item.subtype.toLowerCase()}`;
    return `<div class="${className} flex-center" style="transform:rotate(${direction}deg);height:100%;width:100%;">
                ${content}
            </div>`;
  }

}



export class SnakeGame {
  static name = 'Snake';
  constructor(Emitter, popupInstance, containerSelector) {
    this.model = new SnakeModel(Emitter);
    this.controller = new SnakeController(Emitter, popupInstance, containerSelector);
  }
  destroy() {
    this.model.destroy?.();
    this.controller.destroy?.();
  }
}
