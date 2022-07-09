import { Utils } from '../../../../../services/utils.service.js';


export const mainMethods = {
  destroy,
  disConnectEvents,
  connectEvents,
  init,
  setState,
  startGame,
  pauseGame,
  clearIntervals,
  doGameOver,
  moveObj,
  moveEnemies,
  updateScore,
  setSupperMode,
  checkVictory,
  movePlayer,
  spreadCherry
}

function destroy() {
  this.clearIntervals();
  this.disConnectEvents();
}


function disConnectEvents() {
  this.offers.forEach(c => c?.());
}

function connectEvents() {
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


async function init(isStartGame) {
  this.clearIntervals();
  await this.setState();
  this.updateScore(0);
  if (isStartGame) this.startGame();
}

async function setState() {
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

function startGame() {
  const { state } = this;
  if (state.isGameOver) return;
  state.isGameOn = true;
  state.enemiesInterval = setInterval(() => this.moveEnemies() ,500);
  state.chrryInterval = setInterval(() => this.spreadCherry(state.board) ,5000);
  state.playerInterval = setInterval(() => this.movePlayer(), 150);
}
function pauseGame() {
  const { state } = this;
  if (!state.isGameOn) return;
  state.isGameOn = false;
  this.clearIntervals();
}
function clearIntervals() {
  const { state } = this;
  if (!state) return;
  clearInterval(state.enemiesInterval);
  clearInterval(state.chrryInterval);
  clearInterval(state.playerInterval);
}


async function doGameOver(isVictory = false) {
  const { state } = this;
  this.pauseGame();
  var isNewHighScore = false
  if (isVictory) {
      isNewHighScore = await this.constructor.checkNewHighScore(state.score);
  }
  state.isGameOver = true;
  this.EventManager.emit('game-over', isVictory, state.score, isNewHighScore);
}


function moveObj(obj, toPos) {
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

function moveEnemies() {
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

function updateScore(diff) {
  this.state.score += diff;
  this.EventManager.emit('score-update', this.state.score);
}

function setSupperMode() {
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


function checkVictory() {
  if (this.state.foodCount === this.state.eatCount) {
      this.doGameOver(true);
  }
}


function movePlayer() {
  var {player} = this.state;
  var diff = this.state.playerMoveDiff;
  if (!diff) return;
  this.moveObj(player, {i:player.pos.i+diff.i, j:player.pos.j+diff.j});
}


function spreadCherry(board) {
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