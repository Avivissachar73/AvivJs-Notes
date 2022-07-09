import { BaseBoardGame } from '../BaseBoardGame.class.js';
import { SnakeController } from './controller.js';
import { SnakeModel } from './model/index.js';


export class SnakeGame extends BaseBoardGame {
  static name = 'Snake';
  constructor(Emitter, popupInstance, containerSelector) {
    super(SnakeModel, SnakeController, Emitter, popupInstance, containerSelector);
  }
}
