import createBtnsController from '../../services/btn-controls.cmp.js';
import { BaseGameController } from '../BaseBoardGame.class.js';


export class SnakeController extends BaseGameController {

  constructor(...args) {
    super(...args);
    this.connectDomEvents();
    this.init(false);
  }

  evs = [
    {
        on: 'game_setted',
        do: ({board, bestScore}) => {
            if (bestScore) {
                document.querySelector('.best-score').hidden = false;
                document.querySelector('.best-score span').innerText = `${bestScore.score} - by ${bestScore.by}`;
            } else document.querySelector('.best-score').hidden = true;
            this.initTableService(board);
        }
    },
    {
        on: 'cell_updated',
        do: (pos, item) => {
            this.tableService.updateCell(pos, item);
        }
    },
    {
        on: 'game_over',
        do: async (score, isNewBest) => {
            await this.popup.Alert(`Game over..<br/><br/>Score: ${score}`);
            if (isNewBest) {
                const playerName = await this.popup.Prompt('You broke the high score!<br/><br/>Save it?', 'Your name');
                if (playerName) this.EvEmitter.emit('save_new_score', playerName);
            }
            var isReplay = await this.popup.Confirm(`Play again?`);
            if (isReplay) {this.EvEmitter.emit('set_game', true);}
        }
    },
    {
        on: 'score_update',
        do: score => {
            document.querySelector('.score span').innerText = score;
        }
    },
    {
        on: 'game_paused',
        do: async () => {
            await this.popup.Alert('Game paused');
            this.EvEmitter.emit('resurme_game');
        }
    },
    {
        on: 'supermode_on',
        do: () => {
            document.querySelector('.board-container').classList.add('supermode');
        }
    },
    {
        on: 'supermode_off',
        do: () => {
            document.querySelector('.board-container').classList.remove('supermode');
        }
    }
  ]
  
  async init(isStart) {
    this.connectEvents();
    this.EvEmitter.emit('set_game', isStart);
    await this.popup.Alert('Play Snake!');
    this.EvEmitter.emit('resurme_game');
  }

  connectDomEvents() {
    this.container.innerHTML = this.constructor.HTMLcontent;
    document.body.onkeydown = (ev) => this.handleKey(ev);
    this.container.querySelector('.restart-btn').onclick = () => this.EvEmitter.emit('set_game', true);
    this.container.querySelector('.pause-btn').onclick = () => this.pauseGame();
    createBtnsController((ev) => this.handleKey(ev), null, 'main');
  }

  

  handleKey(ev) {
    const key = ev.key;
    if (['ArrowUp','ArrowDown','ArrowRight','ArrowLeft'].includes(key) && ev.preventDefault) {
        ev.preventDefault();
    }
    if (key === 'ArrowUp') return this.EvEmitter.emit('change_direction', 'UP');
    if (key === 'ArrowDown') return this.EvEmitter.emit('change_direction', 'DOWN');
    if (key === 'ArrowRight') return this.EvEmitter.emit('change_direction', 'RIGHT');
    if (key === 'ArrowLeft') return this.EvEmitter.emit('change_direction', 'LEFT');
    if (key === 'Escape') return this.pauseGame();
  }

  pauseGame() {
    this.EvEmitter.emit('pause_game');
  }


  static getCellHtmlStr(item, pos) {
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
      <div id="board" class="board-container container"></div>
  `;
}