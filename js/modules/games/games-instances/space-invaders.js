


export class SpaceInvadersModel {

}

export class SpaceInvadersController {
  constructor(Emitter, popupInstance, containerSelector) {
    document.querySelector(containerSelector).innerHTML = 'COMING SOON'
  }
}



export class SpaceInvadersGame {
  static name = 'Space-invaders';
  constructor(Emitter, popupInstance, containerSelector) {
    this.model = new SpaceInvadersModel(Emitter);
    this.controller = new SpaceInvadersController(Emitter, popupInstance, containerSelector);
  }
  destroy() {
    this.model.destroy?.();
    this.controller.destroy?.();
  }
}
