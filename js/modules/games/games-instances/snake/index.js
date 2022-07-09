import { SnakeController } from './controller.js';
import { SnakeModel } from './model/index.js';


export class SnakeGame {
  static name = 'Snake';
  constructor(Emitter, popupInstance, containerSelector) {
    this.model = new SnakeModel(Emitter);
    this.controller = new SnakeController(Emitter, popupInstance, containerSelector);
  }
  destroy() {
    this.model.destroy?.();
    this.controller.destroy?.();
  }
}
