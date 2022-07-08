import { EventEmiter } from '../../../lib/EventEmiter.js';
import A_Alert from '../../../lib/Alert.js';
const EventManager = new EventEmiter();
let _Confirm, _Alert, _Prompt;

import createBtnsController from './services/btn-controls.cmp.js';

import { Packman as PackmanGame} from './services/packman.js';
import boardGameUtils from './services/board-game-utils.js';


////////// TODO:
// make geme controller more generic, the component doesnt need to know what game is played, packman and damka shold be handled the same.
// move style to style prop or to another file;
// change functions to cmp methods
// add all the games, routable (damka, snake, space invaders);

var game = null

export default {
    name: 'games-page',
    template: `
        <section class="games-gage-container">
          <main class="app-main container flex column align-center space-around">
              <style>
                .board-container {
                    width: 100%;
                    max-width: 400px;
                    background-color: #fff;
                }
  
                .board-container table {
                    border-radius: 5px;
                    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
                    margin: 0 auto;
                    width: 100%;
                    height: 100%;
                    border-collapse: collapse;
                }
  
                .board-cell {
                    background-color: antiquewhite;
                }
  
                .board-cell span {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                }
  
  
                .board-cell .border {
                    background-color: rgb(243, 235, 162);
                }
  
                .board-cell .food {
                    background-color:#a2f3ba;
                }
              </style>
  
              <h2>Game: {{currGameName}}</h2>
  
              <section class="game-info width-all flex align-center space-around wrap">
                  <button class="reset-btn">Restart</button>
                  <h3>Score: <span class="score-span">0</span></h3>
                  <button class="pause-btn">Pause</button>
              </section>
      
              <div id="board" class="board-container"></div>
              
          </main>
        </section>
    `,
    style: {
      position: 'relative',
      h2: {
        margin: '30px 0'
      },
      '.board-container': {
        margin: '30px 0'
      }
    },
    getters: {
      currGame() {
        return PackmanGame;
      },
      currGameName() {
        return 'Packman';
      }
    },
    async onMounted() {
      const {Confirm, Alert, Prompt} = new A_Alert('.games-gage-container', true);
      _Confirm = Confirm;
      _Alert = Alert;
      _Prompt - Prompt;

      game = new PackmanGame(EventManager);
      connectEvents();
      setDomMethods();
      createBtnsController(handleKeyPress, null, 'main');
      init(false);
      // setReSizeBoard();
      if (await _Confirm(PackmanGame.WELCOME_MSG)) {
          init(true);
          gIsGameOver = false;
      }
    },
    onDestroyed() {
      game.destroy();
      disconnectEvs();
    }
}




const BOARD_SELECTOR = '#board';

var gIsSupperMode = false;
var gIsGameOver = true;
let PAUSE_MSG = '';

let offers = [];


function setDomMethods() {
    document.querySelector('.reset-btn').onclick = () => {
        init(true);
        gIsGameOver = false;
    }
    document.querySelector('.pause-btn').onclick = pauseGame;
    document.body.onkeydown = handleKeyPress;
    // document.querySelector(BOARD_SELECTOR).onkeydown = handleKeyPress;
}

async function pauseGame() {
    if (gIsGameOver) return;
    EventManager.emit('pause-game');
    await _Alert(PAUSE_MSG);
    EventManager.emit('resurm-game');
}

function handleKeyPress(event) {
    const key = event.key;
    if (event.preventDefault && (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown')) {
        event.preventDefault();
    }
    if (key === 'ArrowLeft') EventManager.emit('move-player', {i:0,j:-1});
    if (key === 'ArrowRight') EventManager.emit('move-player', {i:0,j:1});
    if (key === 'ArrowUp') EventManager.emit('move-player', {i:-1,j:0});
    if (key === 'ArrowDown') EventManager.emit('move-player', {i:1,j:0});
    if (key === 'Escape') pauseGame();
}

function init(isStart) {
    EventManager.emit('set-game', isStart);
}


function disconnectEvs() {
  offers.forEach(c => c?.());
}

function connectEvents() {
    offers = [
      EventManager.on('game-setted', (board, bestScore) => {
          renderBoard(board);
          PAUSE_MSG = bestScore ? `Game paused <br/><br/> Best score: ${bestScore.score} by - ${bestScore.name}` : 'Game paused';
          // reSizeBoard();
      }),
      EventManager.on('object-moved', (fromPos, toPos, board) => {
          renderCellByPos(fromPos, board);
          renderCellByPos(toPos, board);
      }),
      EventManager.on('player-eaten', (pos, board) => {
          renderCellByPos(pos, board);
      }),
      EventManager.on('game-over', async (isVictory, score, isNewHighScore) => {
          console.log('game-over, isVictory:', isVictory, 'score:', score, 'isNewBest:', isNewHighScore);
          if (isVictory) {
              if (isNewHighScore) {
                  let playerName = await _Prompt(`You broke the high score! You got ${score} points! <br/> save score?`, 'Your name');
                  if (playerName) EventManager.emit('save-score', playerName)
              }
              else _Alert(`You win! Score: ${score}`);
          }
          // else _Alert(`Game over...  Score: ${score}`);
          else _Alert(`Game over... <br/> You been infected by a sick costumer.. <br/> Score: ${score}`);
          gIsGameOver = true;
      }),
      EventManager.on('score-update', score => {
          document.querySelector('.score-span').innerText = score;
      }),
      EventManager.on('obj-added', (pos, board) => {
          renderCellByPos(pos, board);
      }),
      EventManager.on('supper-mode', duration => {
          gIsSupperMode = true;
          setTimeout(() => gIsSupperMode = false, duration);
      })
    ];
}

function renderBoard(board) {
    boardGameUtils.renderBoard(board, getCellHtmlStr, BOARD_SELECTOR);
    boardGameUtils.setReSizeBoard(BOARD_SELECTOR, 'table');
}

function renderCellByPos(pos, board) {
    boardGameUtils.renderCellByPos(pos, board, getCellHtmlStr);
}


function getCellHtmlStr(cell) {
    const contentStr = cell.uiStr;
    const styleStr = (() => {
        var styleStr = '';
        if (cell.type === 'enemy') styleStr += ` background-color:${gIsSupperMode? '#b88ae8' : cell.color};`;
        return styleStr;
    })();
    const classListStr = (() => {
        return `${cell.subtype || cell.type || ''}`;
    })();
    return `<span style="${styleStr}" class="${classListStr}">${contentStr}</span>`;
}