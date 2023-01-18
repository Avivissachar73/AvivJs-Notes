


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



export class BaseGameEntity {
  evs = []; // [{on: 'example-event', do: () => console.log('example-event is running')}];
  offers = [];
  state = null
  constructor(Emitter) {
    this.EvEmitter = Emitter;
    // this.connectEvents();
  }

  connectEvents() {
    this.offers = this.evs.map(c => c = this.EvEmitter.on(c.on, c.do));
  }
  disconnectEvs() {
    this.offers.forEach(c => c?.());
    this.offers = [];
  }
  destroy() {
    this.disconnectEvs();
  }

  cellClicked() {

  }
}

export class BaseGameModel extends BaseGameEntity {
}


import { TableService } from '../services/TableService.js';

export class BaseGameController extends BaseGameEntity {
  
  constructor(Emitter, popupInstance, containerSelector) {
    super(Emitter);
    this.popup = popupInstance;
    this.container = document.querySelector(containerSelector);
    
    this.connectEvents();
  }

  tableService = null;
  initTableService(board) {
    this.tableService = new TableService('#board', board, (pos, cell) => this.constructor.getCellHtmlStr(cell, pos), (pos, cell, elTd) => this.cellClicked(pos, cell, elTd));
    this.tableService.render();
    this.tableService.setReSizeBoard(true);
  }

  cellClicked(pos) {
    this.EvEmitter.emit('cell-clicked', pos);
  }
  static getCellHtmlStr(cell) {
    return `<div>${cell}</div>`;
  }

  destroy() {
    super.destroy();
    this.tableService.destroy();
    this.tableService = null;
  }
  
}