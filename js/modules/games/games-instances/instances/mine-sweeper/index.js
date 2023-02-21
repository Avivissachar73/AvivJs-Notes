import { BaseBoardGame } from "../BaseBoardGame.class.js";
import { MineSweeperController } from "./controller.js";
import { MineSweeperModel } from "./model/index.js";


export class MineSweeperGame extends BaseBoardGame {
  static name = 'Mine-sweeper';
  constructor(containerSelector, popupInstance, events) {
    super(MineSweeperModel, MineSweeperController, containerSelector, popupInstance, events);
  }
}