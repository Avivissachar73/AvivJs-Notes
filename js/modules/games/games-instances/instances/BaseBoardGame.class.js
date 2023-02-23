import { TableService } from '../services/TableService.js';
import { A_Alert, EventEmiter, Utils } from '../services/common.js';

export class BaseGameEntity {
  evs = []; // [{on: 'example-event', do: () => console.log('example-event is running')}];
  extraEvs = []; // same as evs, but are dynamicly declared by the controllered user
  offers = [];
  state = null
  constructor(Emitter) {
    this.EvEmitter = Emitter;
    this.connectEvents();
  }

  connectEvents() {
    if (this.offers.length) this.disconnectEvs();
    this.offers = [...this.evs, ...this.extraEvs].map(c => c = this.EvEmitter.on(c.on, c.do.bind(this)));
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

export class BaseBoardGame extends BaseGameEntity {
  static name = 'BaseBoardGame';
  modelInstance = null;
  controllerInstance = null;

  constructor(modelInstance, controllerInstance, containerSelector, popupInstance, events = [ /* { on: 'game_over', do(data) { console.log('WOWOWO GAMEOVER', data) } } */ ]) {
    const EventManager = new EventEmiter();
    super(EventManager);
    this.modelInstance = modelInstance;
    this.controllerInstance = controllerInstance;
    this.model = new this.modelInstance(EventManager);
    this.controller = new this.controllerInstance(containerSelector, EventManager, popupInstance);
    this.evs = events;
    this.connectEvents();
  }

  destroy = () => {
    super.destroy();
    this.model.destroy?.();
    this.controller.destroy?.(); // this.controller.destroy exists, not clear yet wtf;
  }
}


export class BaseGameModel extends BaseGameEntity {
  constructor(Emitter) {
    super(Emitter);
  }
}



export class BaseGameController extends BaseGameEntity {
  id = Utils.getRandomId('');
  constructor(containerSelector, Emitter, popupInstance) {
    super(Emitter);
    this.containerSelector = containerSelector;
    this.parentContainer = document.querySelector(containerSelector);
    this.parentContainer.innerHTML = `<div style="width:100%;height:100%;" id="${this.id}">
      <div style="width:100%;height:100%;" class="game-container"></div>
    </div>`;
    this.container = this.parentContainer.querySelector('.game-container');
    this.popup = popupInstance || new A_Alert(`#${this.id}`, true);
    this.connectEvents();
  }

  tableService = null;
  initTableService(board) {
    if (this.tableService) this.tableService.destroy();
    this.tableService = new TableService(`#${this.id} #board`, board, (pos, cell) => this.constructor.getCellHtmlStr(cell, pos), (pos, cell, elTd) => this.cellClicked(pos, cell, elTd));
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
    this.popup.reset?.();
    this.popup.destroy?.();
  }

  static wrapInDefaultHtml(htmlContent = '') {
    return `
      <style>
        .game-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }
        .game-container .board-container {
          // flex: 1;
        }
      </style>
      <div class="game-container">
        ${htmlContent}
      </div>
    `
  }
}