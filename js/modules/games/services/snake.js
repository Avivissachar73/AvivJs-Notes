


export class SnakeModel {

}

export class SnakeController {
  constructor(Emitter, popupInstance, containerSelector) {
    document.querySelector(containerSelector).innerHTML = 'COMING SOON'
  }
}



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
