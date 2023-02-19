import { BaseBoardGame } from "../BaseBoardGame.class.js";
import { MineSweeperController } from "./controller.js";
import { MineSweeperModel } from "./model/index.js";


export class MineSweeperGame extends BaseBoardGame {
  static name = 'Mine-sweeper';
  constructor(Emitter, popupInstance, containerSelector) {
    super(MineSweeperModel, MineSweeperController, popupInstance, containerSelector, Emitter);
  }
}