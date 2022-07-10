import createBtnsController from '../../../../../lib/btn-controls.cmp.js';
import { TableService } from '../../../../../lib/TableService.js';


export class SnakeController {

  tableService = null;

  constructor(Emitter, popupInstance, containerSelector) {
    this.evManager = Emitter;
    this.popup = popupInstance;
    this.container = document.querySelector(containerSelector);

    this.connectDomEvents();
    
    this.init(false);
  }
  
  async init(isStart) {
    this.connectEvents();
    this.evManager.emit('set_game', isStart);

    await this.popup.Alert('Play Snake!');
    this.evManager.emit('resurme_game');
  }

  connectDomEvents() {
    this.container.innerHTML = this.constructor.HTMLcontent;
    document.body.onkeydown = (ev) => this.handleKey(ev);
    document.querySelector('.restart-btn').onclick = () => this.evManager.emit('set_game', true);
    document.querySelector('.pause-btn').onclick = () => this.pauseGame();
    createBtnsController((ev) => this.handleKey(ev), null, 'main');
  }

  destroy() {
    this.tableService.destroy();
    this.disconnectEvs();
  }

  disconnectEvs() {
    this.offers.forEach(c => c?.());
  }

  connectEvents() {
    this.offers = [
      this.evManager.on('game_setted', ({board, bestScore}) => {
          if (bestScore) {
              document.querySelector('.best-score').hidden = false;
              document.querySelector('.best-score span').innerText = `${bestScore.score} - by ${bestScore.by}`;
          } else document.querySelector('.best-score').hidden = true;
          document.querySelector('.board-container').innerHTML = '';
          this.tableService = new TableService('.board-container', board, this.constructor.getCellHTML);
          this.tableService.render();
          this.tableService.setReSizeBoard(true);
      }),
      this.evManager.on('cell_updated', (pos, item) => {
          this.tableService.updateCell(pos, item);
      }),
      this.evManager.on('game_over', async (score, isNewBest) => {
          await this.popup.Alert(`Game over..<br/><br/>Score: ${score}`);
          if (isNewBest) {
              const playerName = await this.popup.Prompt('You broke the high score!<br/><br/>Save it?', 'Your name');
              if (playerName) this.evManager.emit('save_new_score', playerName);
          }
          var isReplay = await this.popup.Confirm(`Play again?`);
          if (isReplay) {this.evManager.emit('set_game', true);}
      }),
      this.evManager.on('score_update', score => {
          document.querySelector('.score span').innerText = score;
      }),
      this.evManager.on('game_paused', async () => {
          await this.popup.Alert('Game paused');
          this.evManager.emit('resurme_game');
      }),
      this.evManager.on('supermode_on', () => {
          document.querySelector('.board-container').classList.add('supermode');
      }),
      this.evManager.on('supermode_off', () => {
          document.querySelector('.board-container').classList.remove('supermode');
      }),
    ]
  }

  handleKey(ev) {
    const key = ev.key;
    if (['ArrowUp','ArrowDown','ArrowRight','ArrowLeft'].includes(key) && ev.preventDefault) {
        ev.preventDefault();
    }
    if (key === 'ArrowUp') return this.evManager.emit('change_direction', 'UP');
    if (key === 'ArrowDown') return this.evManager.emit('change_direction', 'DOWN');
    if (key === 'ArrowRight') return this.evManager.emit('change_direction', 'RIGHT');
    if (key === 'ArrowLeft') return this.evManager.emit('change_direction', 'LEFT');
    if (key === 'Escape') return this.pauseGame();
  }

  pauseGame() {
    this.evManager.emit('pause_game');
  }


  static getCellHTML(pos, item) {
    var content = '';
    // content = item.part? item.part.charAt(0) : '';
    var direction = (() => {
        if (item.faceDirection === 'UP') return 0;
        if (item.faceDirection === 'RIGHT') return 90;
        if (item.faceDirection === 'DOWN') return 180;
        if (item.faceDirection === 'LEFT') return 270;
        return 0;
    })();
    var className = item.type.toLowerCase();
    if (item.subtype) className += `-${item.subtype.toLowerCase()}`;
    return `<div class="${className} flex-center" style="transform:rotate(${direction}deg);height:100%;width:100%;">
                ${content}
            </div>`;
  }


  static HTMLcontent = `
      <style>
        .board-container {
            width: 400px;
            margin-bottom: 10px;
        } @media (max-width: 500px) {
            .board-container {
                width: 90%;
            }  
        }
        
        
        .info >* {
            margin: 5px;
        }
        
        table {
            border-spacing: 0;
        }
        
        .wall {
            background-color: rgb(240, 199, 150);
        } 
        .supermode .wall {
            animation: supermode-animation 2s infinite;
        }
        .floor {
            background-color: rgb(207, 243, 171);
        }
        .player {
            background-color: rgb(247, 65, 65);
        }
        .food {
            background-color: rgb(145, 151, 236);
        }
        .food-super {
            background-color: rgb(145, 151, 236);
            animation: supermode-animation 2s infinite;
        }
        
        @keyframes supermode-animation {
            50% {
                opacity: 0.1;
            }
            100% {
                opacity: 1;
            }
        }
      </style>
      <div class="info flex align-center space-between wrap width-all container">
          <button class="pause-btn">Pause</button>
          <button class="restart-btn">Restart</button>
      </div>
      <div class="info flex align-center space-between wrap width-all container">
          <h5 class="score">Score: <span>0</span></h5>
          <h5 class="best-score">Best: <span>0</span></h5>
      </div>
      <div class="board-container container"></div>
  `;
}