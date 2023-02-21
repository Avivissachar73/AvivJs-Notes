import { Utils } from "../../../services/common.js";

export const mainMethods = {
  createState,
  startGame,
  pauseGame,
  endGame,
  spreadFood,
  getEvs,
  evs: getEvs(),
  destroy
}

function createState() {
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
      operation: 0,
      bestScore: this.loadScore(),
      isOn: false,
      isSuperMode: false,
      superModeTimeout: null,
      // isPaused: false
  }
}

function destroy() {
  this.pauseGame();
  this.disconnectEvs();
}

function getEvs(that) {
  return [
    {
      on: 'set_game',
      do(isToStart) {
        if (this.state) this.pauseGame();
        this.state = this.constructor.createState();
        this.EvEmitter.emit('game_setted', {board: this.state.board, bestScore: this.state.bestScore});
        this.EvEmitter.emit('score_update', 0);
        if (isToStart) this.startGame();
      }
    },
    {
      on: 'pause_game',
      do() {
        this.pauseGame(true);
      }
    },
    {
      on: 'resurme_game',
      do() { this.startGame(); }
    },
    {
      on: 'change_direction',
      do(direction) {
        this.state.directionToSet = direction;
      }
    },
    {
      on: 'save_new_score',
      do(byPlayerName) {
        this.constructor.saveScore(this.state.score, byPlayerName);
      }
    }
  ];
  // ].map(c => (c.do.bind(that || this), c));
}


function startGame() {
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

function pauseGame(isToEmit) {
  const  {state} = this;
  if (!state || !state.isOn) return;
  clearInterval(state.playerInterval);
  clearInterval(state.foodInterval);
  state.isOn = false;
  if (isToEmit) this.EvEmitter.emit('game_paused');
}

function endGame() {
  const {state} = this;
  this.pauseGame();
  var isNewScore = this.constructor.checkIfNewBestScore(state.score);
  this.EvEmitter.emit('game_over', { ...state, isNewScore });
  state.isOn = false;
}

function spreadFood() {
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
              this.EvEmitter.emit('supermode_on');
              state.superModeTimeout = setTimeout(() => {
                  state.isSuperMode = false;
                  this.EvEmitter.emit('supermode_off');
              }, 8000);
          }
      }
  }
  
  board[pos.i][pos.j] = food;
  this.EvEmitter.emit('cell_updated', pos, food);
}