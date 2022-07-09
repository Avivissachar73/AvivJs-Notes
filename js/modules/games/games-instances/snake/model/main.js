import { Utils } from '../../../../../services/utils.service.js'

export const mainMethods = {
  createState,
  destroy,
  disConnectEvents,
  conectEvents,
  startGame,
  pauseGame,
  endGame,
  spreadFood,

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
      bestScore: this.loadScore(),
      isOn: false,
      isSuperMode: false,
      superModeTimeout: null,
      // isPaused: false
  }
}

function destroy() {
  this.pauseGame();
  this.disConnectEvents();
}


function disConnectEvents() {
  this.offers.forEach(c => c?.());
}

function conectEvents() {
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
  if (isToEmit) this.evManager.emit('game_paused');
}

function endGame() {
  const  {state} = this;
  this.pauseGame();
  var isNewScore = this.constructor.checkIfNewBestScore(state.score);
  this.evManager.emit('game_over', state.score, isNewScore);
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