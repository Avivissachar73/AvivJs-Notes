import { BaseBoardGame } from "../BaseBoardGame.class.js";
import { SheshBeshController } from "./controller.js";
import { SheshBeshModel } from "./model/index.js";


export class SheshBeshGame extends BaseBoardGame {
  static name = 'Shesh-besh';
  constructor(containerSelector, popupInstance, events) {
    super(SheshBeshModel, SheshBeshController, containerSelector, popupInstance, events);
  }
}