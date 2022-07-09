import { Utils } from '../../../../../services/utils.service.js'
import { mainMethods } from './main.js';
import { playerMethods } from './player.js';


export class SnakeModel {
  evManager = null;
  state = null;
  offers = [];

  static STORAGE_KEY = 'snake_best_score';

  constructor(evManager) {
    this.evManager = evManager;

    this.conectEvents();
  }

  // main methods:
  static createState = mainMethods.createState;
  destroy = mainMethods.destroy;
  disConnectEvents = mainMethods.disConnectEvents;
  conectEvents = mainMethods.conectEvents;
  startGame = mainMethods.startGame;
  pauseGame = mainMethods.pauseGame;
  endGame = mainMethods.endGame;
  spreadFood = mainMethods.spreadFood;

  ///// playerService //////
  static setPlayer = playerMethods.setPlayer;
  movePlayer = playerMethods.movePlayer;
  static getMoveDiff = playerMethods.getMoveDiff;
  static createPlayerPart = playerMethods.createPlayerPart;
  static getTargetPos = playerMethods.getTargetPos;
  


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
