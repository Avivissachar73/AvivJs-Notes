


export class DamkaModel {

}

export class DamkaController {
  constructor(Emitter, popupInstance, containerSelector) {
    document.querySelector(containerSelector).innerHTML = 'COMING SOON'
  }
}



export class DamkeGame {
  static name = 'Damka';
  constructor(Emitter, popupInstance, containerSelector) {
    this.model = new DamkaModel(Emitter);
    this.controller = new DamkaController(Emitter, popupInstance, containerSelector);
  }
  destroy() {
    this.model.destroy?.();
    this.controller.destroy?.();
  }
}
