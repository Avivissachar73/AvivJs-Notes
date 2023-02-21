import { BaseBoardGame } from '../BaseBoardGame.class.js';
import { SnakeController } from './controller.js';
import { SnakeModel } from './model/index.js';


export class SnakeGame extends BaseBoardGame {
  static name = 'Snake';
  constructor(containerSelector, popupInstance, events) {
    super(SnakeModel, SnakeController, containerSelector, popupInstance, events);
  }
}
