


export class BaseBoardGame {
  static name = 'BaseBoardGame';
  modelInstance = null;
  controllerInstance = null;

  constructor(modelInstance, controllerInstance, Emitter, popupInstance, containerSelector) {
    this.modelInstance = modelInstance;
    this.controllerInstance = controllerInstance;
    this.model = new this.modelInstance(Emitter);
    this.controller = new this.controllerInstance(Emitter, popupInstance, containerSelector);
  }

  destroy() {
    this.model.destroy?.();
    this.controller.destroy?.();
  }
}
