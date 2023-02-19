import { BaseBoardGame } from "../BaseBoardGame.class.js";
import { SheshBeshController } from "./controller.js";
import { SheshBeshModel } from "./model/index.js";


export class SheshBeshGame extends BaseBoardGame {
  static name = 'Shesh-Besh';
  constructor(Emitter, popupInstance, containerSelector) {
    super(SheshBeshModel, SheshBeshController, popupInstance, containerSelector, Emitter);
  }
}