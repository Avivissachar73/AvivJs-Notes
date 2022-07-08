


export class MineSweeperModel {

}

export class MineSweeperController {
  constructor(Emitter, popupInstance, containerSelector) {
    document.querySelector(containerSelector).innerHTML = 'COMING SOON'
  }
}



export class MineSweeperGame {
  static name = 'Mine-sweeper';
  constructor(Emitter, popupInstance, containerSelector) {
    this.model = new MineSweeperModel(Emitter);
    this.controller = new MineSweeperController(Emitter, popupInstance, containerSelector);
  }
  destroy() {
    this.model.destroy?.();
    this.controller.destroy?.();
  }
}
