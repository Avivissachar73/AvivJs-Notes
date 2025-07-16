import { BaseGameModel } from "../../BaseBoardGame.class.js";

import { fire, getAllBulletsOfShooter, createBullet, createBullets } from './bullets.js'
import { updateItemPos, handleHit, moveItems, terminateItem, getNextPos, doMoveItem, handleBulletHit, handleGiftHit, handlePathMove } from './move.js';
import { createPlayer, minimizePlayer } from "./player.js";
import { generateNewEnemies, createEnemy } from "./enemies.js";
import { generateGift, createBulletLevelGift, createGiftItem, createHealthGift } from "./gifts.js";

import { Utils } from "../../../services/common.js";

const boardItems = [
  {
    type: 'PATH',
    pos: {i: 30 || 50, j: 0},
    to: {i_: 30 || 50, j: 40-3},
    size: {w: 1, h: 5}
  },
  {
    type: 'PATH',
    pos: {i: 30 || 50, j: 40-1},
    to: {i_: 30 || 50, j: 2},
    size: {w: 1, h: 5}
  }
];

export class SpaceInvadersModel extends BaseGameModel {
  state = {};
  
  static SCORES_STORAGE_KEY = 'SPACE_INVADERS_SCORES';
  static SAVES_STORAGE_KEY = 'SPACE_INVADERS_SAVES';

  static BOARD_HIGHT = 40 || 60;
  static BOARD_WIDTH = 40;
  static BOARD_VIEW_SIZE_DATA = { w: this.BOARD_WIDTH, h: this.BOARD_HIGHT, b: 0 }; // { w: 40, h: 40, b: 5 };

  constructor(EvEmitter) {
    super(EvEmitter);
    this.connectEvents();
  }

  createState() {
    const state = {
      id: Utils.getRandomId(),
      boardData: {
        board: this.boardService.createBoard(this.constructor.BOARD_HIGHT, this.constructor.BOARD_WIDTH, (pos) => this.createBoardCell(pos, boardItems)),
        items: boardItems,
      },
      entities: [],
      players: [],
      bullets: [],
      enemies: [],
      gifts: [],
      score: 0,
      wave: 0,
    };
    return state;
  }

  
  
  static makeEmptySpace() {
    return {type: 'SPACE', content: []};
  }
  createBoardCell(pos, boardItems) {
      const item = boardItems.find(c => this.boardService.isSamePos(c.pos, pos));
      if (item) return { ...item };
      if (this.boardService.validateOnBorder(pos)) {
          return {type: 'WALL'};
      } else return this.constructor.makeEmptySpace();
  }

  evs = [
    {
      on: 'set_game',
      do(isToStart, loadGameId = '') {
        this.init(isToStart, loadGameId);
      }
    },
    {
      on: 'pause_game',
      do() {
        this.doPause();
      }
    },
    {
      on: 'resurme_game',
      do() { 
        this.doPlay();
      }
    },
    {
      on: 'save_game',
      async do(saveName) {
        await this.storageService.saveGame({...this.state, saveName: saveName || this.state.saveName, timerState: this.timer.state, time: this.timer.totalTimeMS});
        const savedGames = await this.loadSavedGames();
        this.EvEmitter.emit('game_saved', { savedGames });
      }
    },
    {
      on: 'toggle_play',
      do() {
        if (this.state.isGameOn) this.doPause();
        else this.doPlay();
      }
    },
    {
      on: 'create_player',
      do(clientId) {
        const existedPlayer = this.state.players.find(c => c.clientId === clientId);
        const newPlayer = existedPlayer || this.createPlayer(this.state, clientId);
        this.emitCellUpdate(newPlayer.pos, newPlayer);
      }
    },
    {
      on: 'move_player',
      do({playerId, diffs}) {
        if (!this.state.isGameOn) return;
        const player = this.activePlayers.find(c => c.clientId === playerId);
        if (!player) return;
        const fixedDiffes = this.boardService.constructor.parseDirections(diffs);
        this.updateItemPos(player, fixedDiffes);
      }
    },
    {
      on: 'fire',
      do({playerId}) {
        if (!this.state.isGameOn) return;
        const player = this.activePlayers.find(c => c.clientId === playerId);
        if (!player) return;
        this.fire(player, { i: -1, j: 0 });
      }
    },
    {
      on: 'save_score',
      async do({playerId, nickName}) {
        const score = this.state.score;
        const time = this.timer.totalTimeMS;
        await this.storageService.saveScore({gameId: this.state.id, score: score, playerId, nickName, time, wave: this.state.wave, players: this.state.players.map(this.constructor.minimizePlayer)});
        const scores = await this.storageService.loadScores();
        this.EvEmitter.emit('score_saved', { bestScores: scores });
      }
    },
  ];

  get activePlayers() {
    return this.state.players.filter(c => !c.dead);
  }

  doPause() {
    this.pause(true);
    this.EvEmitter.emit('game_paused');
  }

  doPlay() {
    this.play();
    this.EvEmitter.emit('game_resurmed');
  }

  async init(isToStart, loadGameId, clientId) {
    this.pause();
    this.reset();
    this.intervaler.setSpeed(1);
    const loadedState = await this.storageService.loadGame(loadGameId, false);
    if (loadedState) this.reviveState(loadedState);
    this.state = loadedState || this.createState();
    this.boardService.setBoard(this.state.boardData.board);
    this.boardService.getSlicedViewBoard(undefined, this.constructor.BOARD_VIEW_SIZE_DATA);
    this.intervaler.appendInterval(() => {
      this.moveItems(this.state.bullets);
    }, 50);
    // this.intervaler.appendInterval(() => {
    //   this.moveItems(this.state.gifts);
    // }, 500);
    this.intervaler.appendInterval(() => {
      this.gameInterval();
    }, 500);
    this.intervaler.appendInterval(() => {
      this.EvEmitter.emit('timer_update', this.timer.timeRes);
    }, 1000);
    const scores = await this.storageService.loadScores();
    const savedGames = await this.loadSavedGames();
    // this.EvEmitter.emit('game_setted', {board: this.state.boardData.board, bestScores: scores, savedGames, wave: this.state.wave, score: this.state.score, time: this.timer.timeRes});
    this.EvEmitter.emit('game_setted', {board: this.boardService.data.view.slicedBoard, bestScores: scores, savedGames, wave: this.state.wave, score: this.state.score, time: this.timer.timeRes});
    if (isToStart) this.play();
  }

  async loadSavedGames() {
    return (await this.storageService.loadGames()).map(c => ({id: c.id, saveName: c.saveName}));
  }

  async gameInterval() {
    this.moveItems(this.state.gifts);
    // this.moveItems(this.state.bullets);
    if (this.state.enemies.length) {
      this.moveItems(this.state.enemies);
      // TODO ENEMIES FIRE;
    }
    else {
      this.state.wave++;
      this.EvEmitter.emit('wave_update', this.state.wave);
      this.generateNewEnemies();
    }
    const isGameOver = this.checkGameOver();
    if (isGameOver) {
      this.pause();
      const isNewBest = await this.storageService.checkHighScore({ score: this.state.score })
      this.EvEmitter.emit('game_over', {score: this.state.score, isNewBest: isNewBest});
    }
  }
  
  

  updateScore(player, points) {
    player.score += points;
    this.state.score += points;
    this.EvEmitter.emit('score_update', this.state.score);
  }

  updateHealth(item, diff) {
    item.health += diff;
    if (item.health <= 0) this.terminateItem(item, item.type === 'PLAYER');
    else {
      if (!this.boardService.isPosInViewBoard(item.pos)) return;
      if (!this.boardService.isPosOut(item.pos)) this.EvEmitter.emit('health_update', this.boardService.convertPosToViewPos(item.pos, this.boardService.data.view.cornerPos), this.state.boardData.board[item.pos.i][item.pos.j]);
    }
  }

  checkGameOver() {
    return this.state.players.every(c => c.dead);
  }

  reviveState(state) {
    state.entities.forEach(c => {
      if (c.parentList) {
        const idx = state[c.parentList].findIndex(_ => _.id === c.id);
        if (idx !== -1) state[c.parentList][idx] = c;
      }
      if (c.pos && !this.boardService.isPosOut(c.pos)) {
        const idx = state.boardData.board[c.pos.i][c.pos.j].content.findIndex(_ => _.id === c.id);
        if (idx !== -1) state.boardData.board[c.pos.i][c.pos.j].content[idx] = c;
      }
    });
    if (state.timerState) {
      this.timer._init(state.timerState);
    }
  }
  

  emitCellUpdate(pos, item__) {
    const item = this.state.boardData.board?.[pos.i]?.[pos.j];
    if (!item) return;
    // return this.EvEmitter.emit('cell_updated', pos, item);
    
    const newData = this.boardService.getSlicedViewBoard(this.state.players[0]?.pos, this.constructor.BOARD_VIEW_SIZE_DATA);
    const didChange = !!newData.slicedBoard;
    if (!didChange) {
      if (!this.boardService.isPosInViewBoard(pos, this.boardService.data.view.cornerPos, this.boardService.data.view.size)) return;
      const posToEmit = this.boardService.convertPosToViewPos(pos, this.boardService.data.view.cornerPos);
      this.EvEmitter.emit('cell_updated', posToEmit, item);
    }
    else this.EvEmitter.emit('board_updated', this.boardService.data.view.slicedBoard);
  }


  createPlayer = createPlayer;
  static minimizePlayer = minimizePlayer;

  fire = fire;
  getAllBulletsOfShooter = getAllBulletsOfShooter;
  createBullet = createBullet;
  createBullets = createBullets;

  updateItemPos = updateItemPos;
  handleHit = handleHit;
  moveItems = moveItems;
  terminateItem = terminateItem;
  getNextPos = getNextPos;
  doMoveItem = doMoveItem;
  handleBulletHit = handleBulletHit;
  handleGiftHit = handleGiftHit;
  handlePathMove = handlePathMove;

  generateNewEnemies = generateNewEnemies;
  createEnemy = createEnemy;

  generateGift = generateGift;
  static createGiftItem = createGiftItem;
  createBulletLevelGift = createBulletLevelGift;
  createHealthGift = createHealthGift;
}