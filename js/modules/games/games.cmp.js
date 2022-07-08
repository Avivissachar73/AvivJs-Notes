import { EventEmiter } from '../../../lib/EventEmiter.js';
import A_Alert from '../../../lib/Alert.js';
const EventManager = new EventEmiter();
import { PackmanGame } from './services/packman.js';


////////// TODO:
// make geme controller more generic, the component doesnt need to know what game is played, packman and damka shold be handled the same.
// move style to style prop or to another file;
// change functions to cmp methods
// add all the games, routable (damka, snake, space invaders);

var game = null;

export default {
    name: 'games-page',
    template: `
        <section class="games-gage-container">
          <main class="app-main container flex column align-center space-around">
              <h2>Game: {{currGameName}}</h2>
  
              <div class="game-container"></div>
              
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
      },
      '.game-container': {
        width: '100%',
        display: 'flex',
        'align-items': 'center',
        'flex-direction': 'column'
      }
    },
    getters: {
      currGame() {
        return PackmanGame;
      },
      currGameName() {
        return this.currGame.name;
      }
    },
    async onMounted() {
      this.setupGame();
    },
    onDestroyed() {
      this.stopGame();
    },
    methods: {
      setupGame() {
        this.stopGame();
        const popup = new A_Alert('.games-gage-container', true);
        game = new this.currGame(EventManager, popup, '.game-container');
      },
      stopGame() {
        game?.destroy();
      }
    }
}