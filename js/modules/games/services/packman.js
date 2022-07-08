import { BaseBoardGame } from './BaseBoardGame.class.js';
import { Utils } from '../../../services/utils.service.js'
import boardGameUtils from '../services/board-game-utils.js';
import createBtnsController from '../services/btn-controls.cmp.js';



export class PackmanController {
  BOARD_SELECTOR = '#board';

  isSupperMode = false;
  isGameOver = true;
  WELCOME_MSG = 'Hello!<br/>do you think you can collect all the foods in the market without being infected by any of the other costumers?<br/>Lets play!';

  PAUSE_MSG = '';
  
  offers = [];

  popup = null;


  constructor(Emitter, popupInstance, containerSelector) {
    this.EventManager = Emitter;
    this.container = document.querySelector(containerSelector);
    this.popup = popupInstance;

    this.init();
  }
  
  async init() {
    this.connectEvents();
    this.setDomMethods();
    createBtnsController(this.handleKeyPress, null, 'main');
    this.initGame(false);
    // setReSizeBoard();
    if (await this.popup.Confirm(this.WELCOME_MSG)) {
        this.initGame(true);
        this.isGameOver = false;
    }
  }

  
  setDomMethods() {
      this.container.innerHTML = `
          <section class="game-info width-all flex align-center space-around wrap">
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
              </style>
              <button class="reset-btn">Restart</button>
              <h3>Score: <span class="score-span">0</span></h3>
              <button class="pause-btn">Pause</button>
          </section>
    
          <div id="board" class="board-container"></div>
      `;
      this.container.querySelector('.reset-btn').onclick = () => {
          initGame(true);
          this.isGameOver = false;
      }
      this.container.querySelector('.pause-btn').onclick = this.pauseGame;
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
      event.preventDefault?.();
      // if (event.preventDefault && !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
      //     event.preventDefault();
      // }
      if (key === 'ArrowLeft') this.EventManager.emit('move-player', {i:0,j:-1});
      if (key === 'ArrowRight') this.EventManager.emit('move-player', {i:0,j:1});
      if (key === 'ArrowUp') this.EventManager.emit('move-player', {i:-1,j:0});
      if (key === 'ArrowDown') this.EventManager.emit('move-player', {i:1,j:0});
      if (key === 'Escape') this.pauseGame();
  }
  
  initGame(isStart) {
      this.EventManager.emit('set-game', isStart);
  }
  
  
  disconnectEvs() {
    this.offers.forEach(c => c?.());
  }
  
  connectEvents() {
      this.offers = [
        this.EventManager.on('game-setted', (board, bestScore) => {
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
            console.log('game-over, isVictory:', isVictory, 'score:', score, 'isNewBest:', isNewHighScore);
            if (isVictory) {
                if (isNewHighScore) {
                    let playerName = await _Prompt(`You broke the high score! You got ${score} points! <br/> save score?`, 'Your name');
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
      boardGameUtils.renderBoard(board, cell => this.getCellHtmlStr(cell), this.BOARD_SELECTOR);
      boardGameUtils.setReSizeBoard(this.BOARD_SELECTOR, 'table');
  }
  
  renderCellByPos(pos, board) {
      boardGameUtils.renderCellByPos(pos, board, cell => this.getCellHtmlStr(cell));
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
}

export class PackmanModel {
  state = {};
  EventManager = null;
  static BOARD_SIZE = 21;
  static STORAGE_KEY = 'Pacman_best_score';

  offers = [];

  constructor(Emitter) {
    this.EventManager = Emitter;
    this.connectEvents();
  }

  destroy() {
    this.clearIntervals();
    this.disConnectEvents();
  }


  disConnectEvents() {
    this.offers.forEach(c => c?.());
  }

  connectEvents() {
    this.offers = [
      this.EventManager.on('set-game', async (isStartGame) => {
          await this.init(isStartGame);
          this.EventManager.emit('game-setted', this.state.board, this.state.bestScore);
      }),
      this.EventManager.on('move-player', posDiffs => {
          const {i : diffI, j : diffJ} = posDiffs;
          // var {player} = this.state;
          // this.state.playerDirection = (() => {
          //     if (i === -1 && j === 0) return 'UP';
          //     if (i === 1 && j === 0) return 'DOWN';
          //     if (i === 0 && j === 1) return 'RIGHT';
          //     if (i === 0 && j === -1) return 'LEFT';
          // })();
          this.state.playerMoveDiff = posDiffs
          // if (!this.state.playerInterval) this.state.playerInterval = setInterval(movePlayer, 100);
          // moveObj(player, {i:player.pos.i+diffI, j:player.pos.j+diffJ});
      }),
      this.EventManager.on('pause-game', () => this.pauseGame()),
      this.EventManager.on('resurm-game', () => this.startGame()),
      this.EventManager.on('save-score', name => {
          this.constructor.saveScore({name, score: this.state.score});
      })
    ]
}


  async init(isStartGame) {
    this.clearIntervals();
    await this.setState();
    this.updateScore(0);
    if (isStartGame) this.startGame();
  }

  async setState() {
    var boardRes = this.constructor.createGameBoard();
    var bestScore = await this.constructor.loadBestScore();
    this.state = {
        board: boardRes.board,
        score: 0,
        enemies: boardRes.enemies,
        enemiesInterval: null,
        player: boardRes.player,
        playerInterval: null,
        playerDirection: '',
        playerMoveDiff: null,
        isGameOn: false,
        isGameOver: false,
        isSuperMode: false,
        deadEnemies: [],
        foodCount: boardRes.foodCount,
        eatCount: 0,
        chrryInterval: null,
        bestScore
    }
  }

  startGame() {
    const { state } = this;
    if (state.isGameOver) return;
    state.isGameOn = true;
    state.enemiesInterval = setInterval(() => this.moveEnemies() ,500);
    state.chrryInterval = setInterval(() => this.spreadCherry(state.board) ,5000);
    state.playerInterval = setInterval(() => this.movePlayer(), 150);
  }
  pauseGame() {
    const { state } = this;
    if (!state.isGameOn) return;
    state.isGameOn = false;
    this.clearIntervals();
  }
  clearIntervals() {
    const { state } = this;
    if (!state) return;
    clearInterval(state.enemiesInterval);
    clearInterval(state.chrryInterval);
    clearInterval(state.playerInterval);
  }


  async doGameOver(isVictory = false) {
    const { state } = this;
    this.pauseGame();
    var isNewHighScore = false
    if (isVictory) {
        isNewHighScore = await this.constructor.checkNewHighScore(state.score);
    }
    state.isGameOver = true;
    this.EventManager.emit('game-over', isVictory, state.score, isNewHighScore);
  }


  moveObj(obj, toPos) {
    const { state } = this;
    function _fixToPos(pos, board) {
        const {i, j} = pos;
        if (i > board.length-1) pos.i = 0;
        else if (i < 0) pos.i = board.length-1;

        if (j > board[0].length-1) pos.j = 0;
        else if (j < 0) pos.j = board[0].length-1;
    }
    if (this.constructor.getIsEnemyInitPos(toPos)) return;
    if (obj.isDead) return;
    if (!state.isGameOn) return;
    var board = state.board;
    _fixToPos(toPos, board)
    var toPosObj = board[toPos.i][toPos.j];
    if (toPosObj.type === 'border') return;

    if (obj.type === 'player' && toPosObj.type === 'enemy' ||
        obj.type === 'enemy' && toPosObj.type === 'player') {
        if (state.isSuperMode) {
            let enemy = obj.type === 'enemy' ? obj : toPosObj;
            enemy.isDead = true;
            let {enemies, deadEnemies} = state;
            this.updateScore(enemy.score);
            if (enemy.content) {
                let content = enemy.content;
                this.updateScore(content.score || 0);
                if (content.type === 'food' && content.subtype !== 'cherry') state.eatCount++;
                enemy.content = null;
            }
            board[enemy.pos.i][enemy.pos.j] = this.constructor.createEmptyCell(enemy.pos);
        }    
        else return this.doGameOver();
    }
    else if (obj.type === 'player' && toPosObj.type === 'food') {
        if (toPosObj.subtype === 'supper-food') {
            if (state.isSuperMode) return;
            this.setSupperMode();
        }
        if (toPosObj.subtype !== 'cherry') state.eatCount++;
        this.updateScore(toPosObj.score);
        board[toPos.i][toPos.j] = this.constructor.createEmptyCell(toPos);
    }
    else if (obj.type === 'enemy' && toPosObj.type === 'food' && toPosObj.subtype === 'supper-food' ||
            obj.type === 'enemy' && toPosObj.type === 'enemy') return

    else if (obj.type === 'enemy' && toPosObj.type === 'food' && !obj.content) {
        // console.log('collecting')
        obj.content = toPosObj;
        board[toPos.i][toPos.j] = this.constructor.createEmptyCell(toPos);
    }

    var prevPos = {...obj.pos};
    
    if (obj.content && obj.content.pos.i === prevPos.i && obj.content.pos.j === prevPos.j) {
        board[prevPos.i][prevPos.j] = obj.content;
        if (toPosObj.type === 'food') obj.content = board[toPos.i][toPos.j];
        else obj.content = null;
    } else {
        board[prevPos.i][prevPos.j] = board[toPos.i][toPos.j];
        board[prevPos.i][prevPos.j].pos = prevPos;
    }
    board[toPos.i][toPos.j] = obj;
    obj.pos = toPos;

    this.EventManager.emit('object-moved', prevPos, toPos, board);

    this.checkVictory();
  }

  moveEnemies() {
    var {enemies} = this.state;
    for (let enemy of enemies) {
        // const posDiffs = {i:getRandomInt(-1,1), j:getRandomInt(-1,1)};
        const posDiffs = (() => {
            var rand = Utils.getRandomInt(1,4);
            switch (rand) {
                case 1: return {i:0,j:1};
                case 2: return {i:0,j:-1};
                case 3: return {i:1,j:0};
                case 4: return {i:-1,j:0};
            }
        })();
        const newPos = {i: enemy.pos.i+posDiffs.i, j:enemy.pos.j+posDiffs.j};
        if (this.constructor.getIsEnemyInitPos(newPos)) continue;
        this.moveObj(enemy, newPos);
    }
  }

  updateScore(diff) {
    this.state.score += diff;
    this.EventManager.emit('score-update', this.state.score);
  }

  setSupperMode() {
    const { state } = this;
    const supperDuration = 5000;
    const reviveEnemies = () => {
        state.isSuperMode = false;
        let {enemies, board} = state;
        for (let enemy of enemies) {
            if (!enemy.isDead) continue;
            enemy.isDead = false;
            enemy.pos = {...enemy.initialPos};
            board[enemy.initialPos.i][enemy.initialPos.j] = enemy;
            this.EventManager.emit('obj-added', enemy.pos, board);
        }
    }
    state.isSuperMode = true;
    setTimeout(reviveEnemies, supperDuration);
    this.EventManager.emit('supper-mode', supperDuration);
  }


  checkVictory() {
    if (this.state.foodCount === this.state.eatCount) {
        this.doGameOver(true);
    }
  }


  movePlayer() {
    var {player} = this.state;
    var diff = this.state.playerMoveDiff;
    if (!diff) return;
    this.moveObj(player, {i:player.pos.i+diff.i, j:player.pos.j+diff.j});
  }



  // BOARD SERVICE::

  static createGameBoard() {
    const { BOARD_SIZE } = this;
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

  static createInitializedCell(pos, boardHeight, boardWidth, res) {
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


  static createEmptyCell(pos) {
      return {
          initialPos: {...pos},
          isEmpty: true,
          cellId: Utils.getRandomId(),
          pos,
          // uiStr: _geCellUiStr('empty', 'empty', true)

      };
  }
  static createPlayerCell(pos) {
      return {
          initialPos: {...pos},
          type: 'player',
          cellId: Utils.getRandomId(),
          pos,
          // uiStr: _geCellUiStr('player')
      }
  }
  static createEnemyCell(pos) {
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
  static creasteBoardCell(pos) {
      return {
          initialPos: {...pos},
          type: 'border',
          cellId: Utils.getRandomId(),
          pos,
          // uiStr: _geCellUiStr('boarder')
      }
  }
  static createSupperFoodCell(pos) {
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
  static createRegFoodCell(pos) {
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


  static getIsborder(pos, boardHeight, boardWidth) {
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


  static getIsEnemyInitPos({i,j}) {
    return (i === 10 || i === 12) && (j === 9 || j === 11);
  }


  // CHERY SERVICE::

  

  static getAllEmptyPoss(board) {
    // var {board} = gState;
    var empties = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].isEmpty && !this.getIsEnemyInitPos({i,j})) empties.push({i,j});
        }
    }
    return empties;
  }


  spreadCherry(board) {
    // var board = gState.board;
    var emptyPoss = this.constructor.getAllEmptyPoss(board);
    if (!emptyPoss.length) return;
    let randomPos = emptyPoss[Utils.getRandomInt(0, emptyPoss.length-1)];
    var cherry = board[randomPos.i][randomPos.j] = {
        initialPos: randomPos,
        type: 'food',
        subtype: 'cherry',
        cellId: Utils.getRandomId(),
        pos: randomPos,
        score: 15,
        // uiStr: _geCellUiStr('food', 'cherry')
    }
    this.EventManager.emit('obj-added', randomPos, board);
  }


  // SCORE SERVICE::



  
  static async loadBestScore() {
      return await Utils.loadFromStorage(this.STORAGE_KEY);
  }
  
  static async saveScore(score) {
      Utils.storeToStorage(this.STORAGE_KEY, score);
      return Promise.resolve();
  }
  
  static async checkNewHighScore(score) {
      var prevBest = await this.loadBestScore();
      if (!prevBest) return true;
      return (score > prevBest.score);
  }
}


export class PackmanGame {
  name = 'Packman';
  constructor(Emitter, popupInstance, containerSelector) {
    this.model = new PackmanModel(Emitter);
    this.controller = new PackmanController(Emitter, popupInstance, containerSelector);
  }
  destroy() {
    this.model.destroy();
    this.controller.disconnectEvs();
  }
}


// function _geCellUiStr(type, subtype, isEmpty = false) {
//   if (isEmpty || type === 'border') return ' ';
//   if (type === 'player') return '🤠';
//   if (type === 'enemy') return ['😷','🤒','🤕','🤢','🤮','🤧'][0];
//   if (type === 'food' && subtype === 'food') return ' ';
//   if (subtype === 'supper-food') return ['☕','🥛','🍷','🍸','🍺','🍻','🥃','🥤'][0];
//   if (subtype === 'cherry') return ['🥑','🍒','🍆','🍉','🍌','🍅','🥥','🥔','🥦','🥕','🌽','🥒','🍄','🍇','🍞','🥐','🥨','🍦','🍨','🍩','🍪','🍰','🍔','🍟','🍕','🌮','🥪','🍿','🍲','🥘','🍳','🥡','🍭','🍬','🍫','🥫'][0];
//   return ' ';
// }