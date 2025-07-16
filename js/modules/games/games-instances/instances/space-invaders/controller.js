import { A_Alert as alertService } from "../../services/common.js";
import { BaseGameController } from "../BaseBoardGame.class.js";
import createBtnsController from '../../services/btn-controls.cmp.js';
import { elementService } from "../../services/common.js";
import { getBaseCssAndHelpers } from "../../services/common.js";
import { Utils } from "../../services/common.js";

export class SpaceInvadersController extends BaseGameController {

  constructor(...args) {
    super(...args);
    this.init(false);
  }

  clientId = 'client' || Utils.getRandomId();
  didStart = false;
  healthTimeoutMap = {};

  loadedGameId = '';


  evs = [
    {
        on: 'game_setted',
        do: ({board, bestScores, savedGames, wave, score, time}) => {
            this.initTableService(board);
            this.renderSavedScores(bestScores);
            this.renderSavedGames(savedGames);
            this.renderWave(wave);
            this.renderTime(time);
            this.renderScore(score);
            this.didStart = false;
            this.EvEmitter.emit('create_player', this.player1Id);
        }
    },
    {
        on: 'cell_updated',
        do: (pos, item) => {
            this.tableService.updateCell(pos, item);
        }
    },
    {
        on: 'board_updated',
        do: (board) => {
          this.tableService.updateBoard(board);
        }
    },
    {
        on: 'game_paused',
        do: async () => {
            this.togglePauseModal(true);
        }
    },
    {
        on: 'game_resurmed',
        do: async () => {
          this.setGameStarted();
          this.togglePauseModal(false);
        }
    },
    {
        on: 'timer_update',
        do: async (timeData) => {
          this.renderTime(timeData);
        }
    },
    {
        on: 'score_update',
        do: async (score) => {
          this.renderScore(score);
        }
    },
    {
        on: 'wave_update',
        do: async (wave) => {
          this.renderWave(wave);
        }
    },
    {
        on: 'health_update',
        do: async (pos, item) => {
          let actualItem = item.content?.[0] ? item.content[0] : item;
          if (this.healthTimeoutMap[actualItem.id]) clearTimeout(this.healthTimeoutMap[actualItem.id]);
          this.healthTimeoutMap[actualItem.id] = setTimeout(() => {
            delete this.healthTimeoutMap[actualItem.id];
            // removeHealthBar;
            const healthEl = this.container.querySelector(`health-${actualItem.id}`);
            if (healthEl) {
              const itsParent = healthEl.parentNode;
              itsParent.removeChild(healthEl);
            }
          }, 3000);
          this.tableService.updateCell(pos, item);
        }
    },
    {
        on: 'game_over',
        do: async ({score, isNewBest}) => {
            await this.popup.Alert(`Game over..<br/><br/>${isNewBest? 'You broke the high score!<br/><br/>' : '' }Score: ${score}`);
            const nickName = await this.popup.Prompt('Save score?', 'Your name');
            if (nickName) this.EvEmitter.emit('save_score', {nickName, playerId: this.player1Id});
            var isReplay = await this.popup.Confirm(`Play again?`);
            if (isReplay) this.init(true);
        }
    },
    {
        on: 'game_saved',
        do: async ({savedGames}) => {
          this.renderSavedGames(savedGames);
        }
    },
    {
        on: 'score_saved',
        do: async ({bestScores}) => {
          this.renderSavedScores(bestScores);
        }
    }
  ]


  renderTime(timeData) {
    this.container.querySelector('.time span').innerText = `${Utils.padNum(timeData.formatedTime.min)}:${Utils.padNum(timeData.formatedTime.sec)}`;
  }
  renderWave(wave) {
    this.container.querySelector('.wave span').innerText = `${wave || 0}`;
  }
  renderScore(score) {
    this.container.querySelector('.score span').innerText = `${score}`;
  }
  setGameStarted() {
    if (!this.didStart) {
      this.didStart = true;
      this.container.querySelector('.resurme-btn').innerText = 'Resurm';
      this.container.querySelector('.restart-btn').style.display = '';
      this.container.querySelector('.save-btn').style.display = '';
    }
  }
  renderSavedGames(savedGames) {
    this.container.querySelector('.saved-games-container').innerHTML = this.constructor.makeSavedGamesHtml(savedGames);
    this.container.querySelectorAll('.save-game-item').forEach(c => {
      c.onclick = () => this.onLoadGame(c.id);
    });
  }
  renderSavedScores(scores) {
    this.container.querySelector('.scores-container').innerHTML = this.constructor.makeScoresHtml(scores);
  }

  get player1Id() {
    return this.clientId + '-1';
  }
  
  async init(isStart, loadGameId = '') {
    this.loadedGameId = loadGameId;
    this.didStart = false;
    this.healthTimeoutMap = {};
    this.connectEvents();
    this.connectDomEvents();
    this.EvEmitter.emit('set_game', isStart, loadGameId);
    this.pauseGame();
  }

  connectDomEvents() {
    this.container.innerHTML = this.constructor.wrapInDefaultHtml(this.constructor.HTMLcontent);
    document.body.onkeydown = (ev) => this.handleKey(ev);
    this.container.querySelector('.pause-btn').onclick = () => this.pauseGame();
    this.container.querySelector('.resurme-btn').onclick = () => this.resurmeGame();
    this.container.querySelector('.restart-btn').onclick = () => this.restartGame();
    this.container.querySelector('.save-btn').onclick = () => this.saveGame();
    if (this.btnControllerEl) this.btnControllerEl.parentElement.removeChild(this.btnControllerEl);
    this.btnControllerEl = createBtnsController((ev) => this.handleKey(ev), 50, '.game-container', true);
  }


  keysActionMap = {
    Escape: () => {
      this.EvEmitter.emit('toggle_play');
    },
    ArrowUp: () => this.movePlayer(this.player1Id, {i: -1, j: 0}),
    ArrowDown: () => this.movePlayer(this.player1Id, {i: 1, j: 0}),
    ArrowRight: () => this.movePlayer(this.player1Id, {i: 0, j: 1}),
    ArrowLeft: () => this.movePlayer(this.player1Id, {i: 0, j: -1}),
    Space: () => this.fire(this.player1Id),
    F: () => this.fire(this.player1Id),
  }

  handleKey(ev) {
    const key = ev.code;
    // if (['ArrowUp','ArrowDown','ArrowRight','ArrowLeft', 'SPACE'].includes(key) && ev.preventDefault) {
    //     ev.preventDefault();
    // }
    if (!this.keysActionMap[key]) return;
    ev.preventDefault?.();
    this.keysActionMap[key]();
  }


  pauseGame() {
    this.EvEmitter.emit('pause_game');
  }
  resurmeGame() {
    this.EvEmitter.emit('resurme_game');
  }
  async saveGame() {
    if (this.loadedGameId) {
      this.EvEmitter.emit('save_game');
    } else {
      const saveName = await this.popup.Prompt('Save game', 'Game name');
      if (!saveName) return;
      this.EvEmitter.emit('save_game', saveName);
    }
  }
  restartGame() {
    this.init();
  }

  togglePauseModal(isView) {
    this.container.querySelector('.pause-modal').style.display = isView? '' : 'none';
  }

  
  movePlayer(playerId, diffs = {i: 0, j: 0}) {
    this.EvEmitter.emit('move_player', { playerId, diffs })
  }
  fire(playerId) {
    this.EvEmitter.emit('fire', { playerId })
  }

  onLoadGame(gameId) {
    this.init(false, gameId);
    this.setGameStarted();
  }


  getCellHtmlStr(item, pos) {
    if (item.content?.length) item = item.content[0];
    var imgContent = '';
    let style = 'width:100%;height:100%;';
    if (item.size) style = `width:${item.size.w}em;height:${item.size.h}em`;
    if (item.img) {
      imgContent = `<img src="${item.img}" style="${style}"/>`;
    }
    if (this.healthTimeoutMap[item.id]) {
      imgContent += this.constructor.getHealthbarHtmlStr(item);
    }
    var className = item.type.toLowerCase();
    if (item.subtype) className += `-${item.subtype.toLowerCase()}`;
    return `
      <div class="cell-container">
        <div class="cell ${className} flex-center ${imgContent || item.size? 'dynamic-content' : ''}" style="${style}">
            ${imgContent}
        </div>
      </div>
    `;
  }

  static getHealthbarHtmlStr(item) {
    function getHelthPercents(item) {
      if (item.health <= 0) return 0;
      return (item.health / item.maxHealth || 100) * 100;
    }
    var currHelthPercents = getHelthPercents(item);
    const helathHtml = `<div class="health-bar health-${item.id}"><div class="inner-health-bar" style="width:${currHelthPercents}%"></div></div>`;
    return helathHtml;
  }

  static makeScoresHtml(scores) {
    if (!scores.length) return '<h4>No saved scores..</h4>'
    scores = [...scores].sort(Utils.sortEverything('score', false)).slice(0, 10);
    const _msg = (c) => {
      const totalLenght = 20;
      const nick = Utils.cropText(c.nickName, 8, '');
      const score = c.score;
      const exLength = (nick + score).length;
      return `${nick}${'.'.repeat(Math.max(totalLenght - exLength, 1))}${score}`
    }
    return scores.map(c => `<li>
      ${_msg(c)}
    </li>`).join('');
  }

  static makeSavedGamesHtml(savedGames) {
    if (!savedGames.length) return '<h4>No saved games..</h4>'
    return savedGames.map(c => `<li class="save-game-item" id="${c.id}">
      <button class="hover-pop">
        ${c.saveName}
      </button>
    </li>`).join('');
  }

  static HTMLcontent = `
    <div class="space-invaders-game-container">
      <style>
        @mediaa (max-width: 500px) {
            .board-container {
                width: 90%;
            }  
        }
        ${getBaseCssAndHelpers('.space-invaders-game-container')}
        ${elementService.dataToCss('.game-container .space-invaders-game-container', {
          position: 'relative',
          fontSize: '12px',
          fontFamily: "'Courier New', monospace",
          // width: '100%',
          margin: '0 auto',
          width: '300px',
          '.board-container': {
            width: '100%',
            // maxWidth: '100%',
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            'max-height': '80%',
            // 'background-image': `linear-gradient(rgba(23, 22, 22, 0.5), rgba(196, 36, 36, 0.5), rgba(236, 236, 20, 0.5))`,
            'background-image': `linear-gradient(yellow 0%, orange 25%, red 50%, blue 85%, black 100%)`,
            table: {
              overflow: 'hidden'
              // 'border-spacing': 0
            },
            '.cell-container': {
              position: 'relative',
              height: '100%',
              width: '100%',
              outline: '1px solid white',
              backgroundColor: 'rgba(240, 248, 255, 0.7)',
              '.cell': {
                '&.dynamic-content': {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                },
                '&.space': {
                  // backgroundColor: 'aliceblue',
                },
                '&.wall': {
                  backgroundColor: 'brown',
                },
                '&.player': {
                  // backgroundColor: 'red',
                },
                '&.path': {
                  backgroundColor: 'gold',
                },
                '&.none': {
                  backgroundColor: 'black',
                },
                img: {
                  width: '100%',
                  height: '100%'
                }
              }
            }
          },
          '.pause-modal': {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'red',
            'min-width': elementService._.em(250),
            color: 'black',
            padding: elementService._.em(20),
            'text-align': 'center',
            zIndex: 20,
            'box-shadow': `0 0 ${elementService._.em(10)} ${elementService._.em(1)} rgba(0,0,0,0.5)`
          }
        })}
        .health-bar {
            background-color: red;
            border: 1px solid red;
            border-radius: 3px;
            width: 30px;
            height: 4px;
            position: absolute;
            bottom: 100%;
            right: 50%;
            transform: translate(50%, -${elementService._.em(10)});
            text-align: left;
            z-index: 3;
        }
        .inner-health-bar {
            background-color: blue;
            border-radius: 3px;
            height: 100%;
        }
      </style>
      <div class="info flex align-center space-between wrap width-all">
          <button class="pause-btn">Pause</button>
      </div>
      <div class="info flex align-center space-between wrap width-all">
          <h5 class="score">Score: <span>0</span></h5>
          <h5 class="wave">Wave: <span>0</span></h5>
          <h5 class="time"><span>00:00</span></h5>
      </div>
      <div class="pause-modal flex column gap20">
        <h1 class="bold">Space Invaders</h1>
        <div class="flex column align-center gap5">
          <h3 class="bold">SCORES</h3>
          <ul class="scores-container"></ul>
        </div>
        <div class="flex column align-center gap5">
          <h3 class="bold">LOAD GAME</h3>
          <ul class="saved-games-container flex column gap5"></ul>
        </div>
        <div class="flex gap60 align-center justify-center">
          <button class="hover-pop resurme-btn">Play</button>
          <button class="hover-pop restart-btn" style="display:none">Restart</button>
          <button class="hover-pop save-btn" style="display:none">Save</button>
        </div>
      </div>
      <div id="board" class="board-container"></div>
    <div>
  `;
}