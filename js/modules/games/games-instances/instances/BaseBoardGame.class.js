import { TableService } from '../services/TableService.js';
import { A_Alert, EventEmiter, Utils } from '../services/common.js';
import { Intervaler } from '../services/common.js';
import { Timer } from '../services/common.js';

export class BaseGameEntity {
  evs = []; // [{on: 'example-event', do: () => console.log('example-event is running')}];
  offers = [];
  state = null
  constructor(Emitter) {
    this.EvEmitter = Emitter;
    this.connectEvents();
  }

  connectEvents() {
    if (this.offers.length) this.disconnectEvs();
    this.offers = this.evs.map(c => c = this.EvEmitter.on(c.on, c.do.bind(this)));
  }
  disconnectEvs() {
    this.offers.forEach(c => c?.());
    this.offers = [];
  }

  destroy() {
    this.disconnectEvs();
  }
}

export class BaseBoardGame extends BaseGameEntity {
  static name = 'BaseBoardGame';
  modelInstance = null;
  controllerInstance = null;

  constructor(modelInstance, controllerInstance, containerSelector, popupInstance, events = [ /* { on: 'game_over', do(data) { console.log('WOWOWO GAMEOVER', data) } } */ ]) {
    const EventManager = new EventEmiter();
    super(EventManager);
    this.modelInstance = modelInstance;
    this.controllerInstance = controllerInstance;
    this.model = new this.modelInstance(EventManager);
    this.controller = new this.controllerInstance(containerSelector, EventManager, popupInstance);
    this.evs = events;
    this.connectEvents();
  }

  destroy = () => {
    super.destroy();
    this.model.destroy?.();
    this.controller.destroy?.(); // this.controller.destroy exists, not clear yet wtf;
  }
}


export class BaseGameModel extends BaseGameEntity {
  gameId = Utils.getRandomId('');
  state = {};
  static SCORES_STORAGE_KEY = 'SCORES';
  static SAVES_STORAGE_KEY = 'SAVES';
  constructor(Emitter) {
    super(Emitter);
    this.boardService = new BoardService();
    this.intervaler = new Intervaler();
    this.storageService = new GameStorageService(this.constructor.SCORES_STORAGE_KEY, this.constructor.SAVES_STORAGE_KEY);
    this.timer = new Timer();
  }

  play() {
    this.timer.play();
    this.intervaler.run();
    this.state.isGameOn = true;
    this.EvEmitter.emit('game-played', this.timer.totalTimeMS);
  }
  
  stop() {
    this.timer.pause();
    this.intervaler.stop();
    this.state.isGameOn = false;
  }

  pause() {
    this.stop();
    this.EvEmitter.emit('game-paused', this.timer.timeRes);
  }

  reset() {
    this.stop();
    this.timer.reset();
    this.intervaler.reset();
    this.EvEmitter.emit('game-resetted');
  }
  
  destroy() {
    super.destroy();
    this.stop();
    this.EvEmitter.emit('game-destroyed');
  }
}



export class BaseGameController extends BaseGameEntity {
  elId = Utils.getRandomId('');
  constructor(containerSelector, Emitter, popupInstance) {
    super(Emitter);
    this.containerSelector = containerSelector;
    this.parentContainer = document.querySelector(containerSelector);
    this.parentContainer.innerHTML = `<div style="width:100%;height:100%;" id="${this.elId}">
      <div style="width:100%;height:100%;" class="game-container"></div>
    </div>`;
    this.container = this.parentContainer.querySelector('.game-container');
    this.popup = popupInstance || new A_Alert(`#${this.elId}`, true);
    this.connectEvents();
  }

  tableService = null;
  async initTableService(board) {
    if (this.tableService) this.tableService.destroy();
    const getHtmlCb = (this.getCellHtmlStr?.bind(this) || this.constructor.getCellHtmlStr?.bind(this.constructor))
    this.tableService = new TableService(`#${this.elId} #board`, board, (pos, cell) => getHtmlCb(cell, pos), (pos, cell, elTd) => this.cellClicked(pos, cell, elTd));
    this.tableService.render();
    this.tableService.setReSizeBoard(true);
  }

  cellClicked(pos) {
    this.EvEmitter.emit('cell-clicked', pos);
  }
  static getCellHtmlStr(cell) {
    return `<div>${cell}</div>`;
  }

  destroy() {
    super.destroy();
    this.tableService.destroy();
    this.tableService = null;
    this.popup.reset?.();
    this.popup.destroy?.();
  }

  static wrapInDefaultHtml(htmlContent = '') {
    return `
      <style>
        .game-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }
        .game-container .board-container {
            flex: 1;
        }
      </style>
      <div class="game-container">
        ${htmlContent}
      </div>
    `
  }
}



class GameStorageService {
  constructor(scoreKey = 'SCORES_KEY', savesKey = 'SAVES_KEY') {
    this.SCORES_STORAGE_KEY = scoreKey;
    this.SAVES_STORAGE_KEY = savesKey;
  }
  async saveScore(newScoreItem) {
    const scores = await this.loadScores();
    scores.push(newScoreItem);
    Utils.storeToStorage(this.SCORES_STORAGE_KEY, scores);
    return newScoreItem;
  }
  async loadScores() {
    return Utils.loadFromStorage(this.SCORES_STORAGE_KEY) || [];
    // [ 
    //   {score: 17, playerId: 1, nickName: 'abbaadasdasdasd', time: 123345},
    //   {score: 30, playerId: 4, nickName: 'epba', time: 983345}
    // ];
  }
  async checkHighScore(scoreItem = { gameId: '', score: 0 }) {
    const scores = await this.loadScores();
    const relevantScores = scores.filter(c => c.gameId !== scoreItem.gameId);
    const higherScores = relevantScores.filter(c => c.score > scoreItem.score);
    return !higherScores.length;
  }
  
  async loadGames() {
    return Utils.loadFromStorage(this.SAVES_STORAGE_KEY) || [];
  }
  async loadGame(gameId, getDefault) {
    const games = await this.loadGames();
    return games.find(c => c.id === gameId) || (getDefault? games[0] : null);
  }
  async saveGame(state = { id: '' }) {
    const games = await this.loadGames();
    const idx = games.findIndex(c => c.id === state.id);
    if (idx === -1) games.push(state);
    else games.splice(idx, 1, state);
    Utils.storeToStorage(this.SAVES_STORAGE_KEY, games);
    return state;
  }
}

class BoardService {
  BOARD_HIGHT = 0;
  BOARD_WIDTH = 0;
  data = {};
  resetState() {
    this.data = {
      board: [],
      view: {
        cornerPos: { i: 0, j: 0 },
        slicedBoard: null,
        size: {w: 0, h: 0, b: 0}
      }
    }
  }

  constructor(board) {
    this.resetState();
    if (board) this.setBoard(board);
  }
    
  setBoard(board) {
    this.resetState();
    this.data.board = board;
    this.BOARD_HIGHT = board.length;
    this.BOARD_WIDTH = board[0].length;
  }

  isPosOut(pos) {
    return this.isOutOfBoard(pos) || this.validateOnBorder(pos);
  }
  validateOnBorder(pos) {
    return pos.i === 0 || pos.j === 0 || pos.i === this.BOARD_HIGHT -1 || pos.j === this.BOARD_WIDTH-1;
  }
  isOutOfBoard(pos) {
    return pos.i < 0 || pos.j < 0 || pos.i >= this.BOARD_HIGHT || pos.j >= this.BOARD_WIDTH;
  }
  makeEmptyCell() {
    return {type: 'EMPTY', content: []};
  }
  isEmptyCell(pos, emptyTypes = ['EMPTY']) {
    return (this.data.board[pos.i]?.[pos.j]?.content?.length === 0) &&
           (emptyTypes.includes(this.data.board[pos.i]?.[pos.j]?.type));
  }
  isSamePos = (posA, posB) => (posA.i === posB.i) && (posA.j === posB.j);
  defaultCreateBoardCell(pos) {
      if (this.validateOnBorder(pos)) {
          return {type: 'WALL'};
      } else return this.makeEmptyCell();
  }
  createBoard(boardHeight, boardWidth, createBoardCell) { // static
    this.BOARD_HIGHT = boardHeight;
    this.BOARD_WIDTH = boardWidth;
    this.data.board = Utils.createBoard(this.BOARD_HIGHT, this.BOARD_WIDTH, (pos) => (createBoardCell || this.defaultCreateBoardCell)(pos));
    return this.data.board;
  }

  placeOnBoard(pos, item) {
    if (!this.isOutOfBoard(pos) && !this.validateOnBorder(pos)) this.data.board[pos.i][pos.j].content.push(item);
  }

  moveItem(item, newPos, makeEmptyCell) {
    const prevPos = {...item.pos};
    item.pos = newPos;
    let didPutOnBoard = false;
    if (!this.isPosOut(newPos)) {
      Utils.removeFromList(this.data.board[prevPos.i][prevPos.j].content, item, 'id');
      this.data.board[newPos.i][newPos.j].content.push(item);
      didPutOnBoard = true;
    }
    return {newPos, prevPos, didPutOnBoard};
  }


  static parseDirections(diffs) {
    const fixVal = (val) => {
      if (val > 0) return 1;
      if (val < 0) return -1;
      return 0;
    }
    const directions = { i: fixVal(diffs.i), j: fixVal(diffs.j) };
    return directions;
  }
  
  
  getHittedItemsBetweenPoss(item, fromPos, toPos, possibleHitEntities = [], emptyTypes) {
    const hitBoard = this.getHitBoard(item, possibleHitEntities);
    const iDiff = fromPos.i - toPos.i;
    const jDiff = fromPos.j - toPos.j;
    const directions = this.constructor.parseDirections({ i: iDiff, j: jDiff });
    fromPos = {...fromPos};
    const sortedI = [fromPos.i, toPos.i].sort((a, b) => a - b);
    const sortedJ = [fromPos.j, toPos.j].sort((a, b) => a - b);
    let startI = directions.i > 0 ? sortedI[0] - Math.floor(item.size.h/2) : fromPos.i;
    let endI = directions.i < 0 ? sortedI[1] + Math.floor(item.size.h/2) : fromPos.i;
    let startJ = directions.j > 0 ? sortedJ[0] - Math.floor(item.size.w/2) : fromPos.j;
    let endJ = directions.j < 0 ? sortedJ[1] + Math.floor(item.size.w/2) : fromPos.j;
    const hitItems = [];
    for (let i = startI; i <= endI; i++) {
      for (let j = startJ; j <= endJ; j++) {
        const currP = { i, j };
        if (this.isOutOfBoard(currP)) continue;
        if (this.isSamePos(fromPos, currP)) continue;
        if (hitBoard?.[i]?.[j]) return (hitBoard?.[i]?.[j]);
        if (this.isEmptyCell({ i, j }, emptyTypes)) continue;
        if (this.data.board[i]?.[j]?.content?.[0]) return (this.data.board[i][j].content[0]);
        if (this.data.board[i]?.[j]) return this.data.board[i]?.[j];
      }
    }

    return hitItems[0] || null;
  }




  getHitBoard(selfItem = null, possibleHitEntities = []) {
    const hitBoard = [];
    possibleHitEntities.forEach(c => {
      if (selfItem?.id === c.id) return;
      const geoPoss = this.getEntityGeoPsitions(c.pos, c.size);
      geoPoss.forEach(p => {
        if (!hitBoard[p.i]) hitBoard[p.i] = [];
        hitBoard[p.i][p.j] = c;
      });
    });
    return hitBoard;
  }

  getEntityGeoPsitions(pos, size) {
    const startI = pos.i - Math.floor(size.h/2);
    const endI = pos.i + Math.floor(size.h/2);
    const startJ =  pos.j - Math.floor(size.w/2);
    const endJ =  pos.j + Math.floor(size.w/2);
    const poss = [];
    for (let i = startI; i <= endI; i++) {
      for (let j = startJ; j <= endJ; j++) {
        if (this.isOutOfBoard({i,j})) continue;
        poss.push({i,j});
      }
    }
    return poss;
  }


  getSlicedViewBoard(mainPos, size = null) {
    if (size) this.data.view.size = size;
    if (!mainPos) mainPos = { i: Math.floor(this.BOARD_HIGHT/2), j: Math.floor(this.BOARD_WIDTH/2) };
    const viewBoardData = this.data.view;
    const VIEW_SIZE_W = viewBoardData.size.w;
    const VIEW_SIZE_H = viewBoardData.size.h;
    const VIEW_SIZE_BORDER = viewBoardData.size.b;
    const lastCornerPos = viewBoardData.cornerPos;
    let cornerPos = (lastCornerPos.i < mainPos.i) && (lastCornerPos.j < mainPos.j)
      ? {...lastCornerPos}
      : { i: mainPos.i - Math.floor(VIEW_SIZE_W/2), j: mainPos.j - Math.floor(VIEW_SIZE_H/2) };
    if (mainPos.i > (cornerPos.i + VIEW_SIZE_H - VIEW_SIZE_BORDER)) cornerPos.i += (mainPos.i - (cornerPos.i + VIEW_SIZE_H - VIEW_SIZE_BORDER));
    if (mainPos.j > (cornerPos.j + VIEW_SIZE_W - VIEW_SIZE_BORDER)) cornerPos.j += (mainPos.j - (cornerPos.j + VIEW_SIZE_W - VIEW_SIZE_BORDER));
    if (mainPos.i < (cornerPos.i + VIEW_SIZE_BORDER)) cornerPos.i -= ((cornerPos.i + VIEW_SIZE_BORDER) - mainPos.i);
    if (mainPos.j < (cornerPos.j + VIEW_SIZE_BORDER)) cornerPos.j -= ((cornerPos.j + VIEW_SIZE_BORDER) - mainPos.j);
   const res = {};
    const isSame = this.isSamePos(viewBoardData.cornerPos, cornerPos);
    if (!isSame) res.cornerPos = cornerPos;
    if (!isSame || !viewBoardData.slicedBoard) {
      const slicedBoard = [];
      for (let i = 0; i < VIEW_SIZE_H; i++) {
        slicedBoard[i] = [];
        for (let j = 0; j < VIEW_SIZE_W; j++) {
          slicedBoard[i][j] = this.data.board[i+cornerPos.i]?.[j+cornerPos.j] || {type: 'NONE'};
        }
      }
      res.slicedBoard = slicedBoard;
    } else {
    }
    this.data.view = {
      ...this.data.view,
      ...res
    }
    return res;
  }


  isPosInViewBoard(pos) {
    const { cornerPos, size } = this.data.view;
    return (pos.i >= cornerPos.i) && (pos.i <= cornerPos.i+size.h) && (pos.j >= cornerPos.j) && (pos.j <= cornerPos.j+size.w);
  }

  convertPosToViewPos(pos) {
    const { cornerPos } = this.data.view;
    const viewPos = {i: pos.i - cornerPos.i, j: pos.j - cornerPos.j};
    return viewPos
  }
}