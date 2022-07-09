
import { mainMethods } from './main.js';
import { boardMethods } from './board.js';
import { scoreMethods } from './score.js';

export class PackmanModel {
  state = {};
  EventManager = null;

  offers = [];

  constructor(Emitter) {
    this.EventManager = Emitter;
    this.connectEvents();
  }

  // MAIN METHODS::
  destroy = mainMethods.destroy;
  disConnectEvents = mainMethods.disConnectEvents;
  connectEvents = mainMethods.connectEvents;
  init = mainMethods.init;
  setState = mainMethods.setState;
  startGame = mainMethods.startGame;
  pauseGame = mainMethods.pauseGame;
  clearIntervals = mainMethods.clearIntervals;
  doGameOver = mainMethods.doGameOver;
  moveObj = mainMethods.moveObj;
  moveEnemies = mainMethods.moveEnemies;
  updateScore = mainMethods.updateScore;
  setSupperMode = mainMethods.setSupperMode;
  checkVictory = mainMethods.checkVictory;
  movePlayer = mainMethods.movePlayer;
  spreadCherry = mainMethods.spreadCherry;


  // BOARD SERVICE::
  static createGameBoard = boardMethods.createGameBoard;
  static createInitializedCell = boardMethods.createInitializedCell;
  static createEmptyCell = boardMethods.createEmptyCell;
  static createPlayerCell = boardMethods.createPlayerCell;
  static createEnemyCell = boardMethods.createEnemyCell;
  static creasteBoardCell = boardMethods.creasteBoardCell;
  static createSupperFoodCell = boardMethods.createSupperFoodCell;
  static createRegFoodCell = boardMethods.createRegFoodCell;
  static getIsborder = boardMethods.getIsborder;
  static getIsEnemyInitPos = boardMethods.getIsEnemyInitPos;
  static getAllEmptyPoss = boardMethods.getAllEmptyPoss;

  // SCORE SERVICE::  
  static loadBestScore = scoreMethods.loadBestScore;
  static saveScore = scoreMethods.saveScore;
  static checkNewHighScore = scoreMethods.checkNewHighScore;
}
