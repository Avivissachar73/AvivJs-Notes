import { mainMethods } from "./main.js";
import { comMethods } from "./com.js";
import { boardMethods } from "./board.js";
import { moveMethods } from "./move.js";


export class DamkaModel {
  state = null;
  static PLAYER_1_ID = 1;
  static PLAYER_2_ID = 2;
  static PLAYER_COM_ID = 2;
  
  static KING_ROW_STEP = 2;

  boardSize = 8;
  comStepsToCalcAhead = 3;
  
  constructor(Emitter) {
    this.EventManager = Emitter;
    this.connectEvents();
  }
  
  // main methods::
  disconnectEvs = mainMethods.disconnectEvs;
  destroy = mainMethods.destroy;
  connectEvents = mainMethods.connectEvents;
  $init = mainMethods.$init;
  static setState = mainMethods.setState;
  $cellClicked = mainMethods.$cellClicked;
  $checkGameVictory = mainMethods.$checkGameVictory;
  $setGameNextTurn = mainMethods.$setGameNextTurn;
  static toggleSelectCellByPos = mainMethods.toggleSelectCellByPos;
  static movePiece = mainMethods.movePiece;
  static handleEat = mainMethods.handleEat;
  getEatenPos = mainMethods.getEatenPos;
  static setNextTurn = mainMethods.setNextTurn;
  static checkVictory = mainMethods.checkVictory;
  $doHandleMoveRes = mainMethods.$doHandleMoveRes;
  doComTurn = mainMethods.doComTurn;
  computerTurn = mainMethods.computerTurn;
  static getOtherId = mainMethods.getOtherId;

  // cpmputer methods::
  static getComMove = comMethods.getComMove;
  static getSimpleNextMove = comMethods.getSimpleNextMove;
  static getBestMove = comMethods.getBestMove;
  static getBestMove = comMethods.getBestMove;
  static comPlay = comMethods.comPlay;
  static playNthMovesFromMove = comMethods.playNthMovesFromMove;


  // board methods::
  static createGameBoard = boardMethods.createGameBoard;
  static createInitializedCell = boardMethods.createInitializedCell;
  static createEmptyCell = boardMethods.createEmptyCell;
  static createPlayerCell = boardMethods.createPlayerCell;

  // move methods::
  static getAllValidMovesFromPos = moveMethods.getAllValidMovesFromPos;
  static getAllEatMovesFromPos = moveMethods.getAllEatMovesFromPos;
  static _getAllMovesForRegular = moveMethods._getAllMovesForRegular;
  static _checkIfValidRegularMove = moveMethods._checkIfValidRegularMove;
  static _getAllMovesForKing = moveMethods._getAllMovesForKing;
  static _getDirectionMovesForKing = moveMethods._getDirectionMovesForKing;
  static _getAllEatMovesForRegular = moveMethods._getAllEatMovesForRegular;
  static _checkRegularEatDirection = moveMethods._checkRegularEatDirection;
  static _getAllEatMovesForKing = moveMethods._getAllEatMovesForKing;
  static _getDirectionEatMoveForKing = moveMethods._getDirectionEatMoveForKing;
}