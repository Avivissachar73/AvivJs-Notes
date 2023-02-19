import { BaseBoardGame } from "../BaseBoardGame.class.js";
import { DamkaController } from "./controller.js";
import { DamkaModel } from "./model/index.js";


export class DamkaGame extends BaseBoardGame {
  static name = 'Damka';
  constructor(Emitter, popupInstance, containerSelector) {
    super(DamkaModel, DamkaController, popupInstance, containerSelector, Emitter);
  }
}