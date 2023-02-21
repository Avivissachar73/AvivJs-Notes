import { BaseBoardGame } from "../BaseBoardGame.class.js";
import { SpaceInvadersController } from "./controller.js";
import { SpaceInvadersModel } from "./model/index.js";


export class SpaceInvadersGame extends BaseBoardGame {
  static name = 'Space-invaders';
  constructor(containerSelector, popupInstance, events) {
    super(SpaceInvadersModel, SpaceInvadersController, containerSelector, popupInstance, events);
  }
}