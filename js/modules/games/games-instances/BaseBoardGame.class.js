

export class BaseBoardGame {
  static name = 'BaseBoardGame';
  modelInstance = null;
  controllerInstance = null;

  constructor(modelInstance, controllerInstance, popupInstance, containerSelector, Emitter) {
    this.modelInstance = modelInstance;
    this.controllerInstance = controllerInstance;
    this.model = new this.modelInstance(Emitter);
    this.controller = new this.controllerInstance(Emitter, popupInstance, containerSelector);
  }

  destroy = () => {
    this.model.destroy?.();
    this.controller.destroy?.(); // this.controller.destroy exists, not clear yet wtf;
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
    if (this.offers.length) this.disconnectEvs();
    this.offers = this.evs.map(c => c = this.EvEmitter.on(c.on, c.do.bind(this)));
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
  constructor(Emitter) {
    super(Emitter);
  }
}


import { TableService } from '../services/TableService.js';

export class BaseGameController extends BaseGameEntity {
  
  constructor(Emitter, popupInstance, containerSelector, onGameOver) {
    super(Emitter);
    this.popup = popupInstance;
    this.container = document.querySelector(containerSelector);
    this.onGameOver = onGameOver
    
    this.connectEvents();
  }

  tableService = null;
  initTableService(board) {
    if (this.tableService) this.tableService.destroy();
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

  defaultEvents() {
    return [
      this.EvEmitter.on('game_over', ({score, winnerId, isVictory}) => {
        if (this.onGameOver) this.onGameOver({score, winnerId, isVictory});
      })
    ]
  }
  
}