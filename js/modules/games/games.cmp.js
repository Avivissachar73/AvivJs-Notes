import { EventEmiter } from '../../../lib/EventEmiter.js';
import A_Alert from '../../../lib/Alert.js';
const EventManager = new EventEmiter();

import { PackmanGame } from './games-instances/packman/index.js';
import { SnakeGame } from './games-instances/snake/index.js';
import { DamkaGame } from './games-instances/damka/index.js';
import { SpaceInvadersGame } from './games-instances/space-invaders/index.js';
import { MineSweeperGame } from './games-instances/mine-sweeper/index.js';


const allGames = [DamkaGame, PackmanGame, SnakeGame, SpaceInvadersGame, MineSweeperGame];

////////// TODO:
// make geme controller more generic, the component doesnt need to know what game is played, packman and damka shold be handled the same.
// move style to style prop or to another file;
// change functions to cmp methods
// add all the games, routable (damka, snake, space invaders);

var game = null;

export default {
    name: 'games-page',
    template: `
        <section class="games-page-container">
          <div class="games-ul container flex wrap space-around">
            <!-- <RouterLink url="/games">Games</RouterLink> -->
            <RouterLink A-for="gameName in allGamesNames" key="{{gameName}}" url="/games/{{gameName}}">
              {{gameName}}
            </RouterLink>
          </div>
          <section class="content-container">
            <main class="app-main container flex column align-center space-around">
              <!-- <h2>Game: {{currGameName}}</h2> -->
              
              <div A-if="currGame" class="game-container"></div>

              <div A-if="!currGame" class="error-container flex column align-center space-between">
                <h2>404</h2>
                <p>Unknown game "{{routeGameName}}"</p>
              </div>
            </main>
          </section>
        <section>
    `,
    style: {
      h2: {
        margin: '30px 0'
      },
      '.content-container': {
        position: 'relative',
      },
      '.game-container': {
        width: '100%',
        display: 'flex',
        'align-items': 'center',
        'flex-direction': 'column',
        margin: '30px 0',
        '.board-container': {
          'max-width': '400px'
        }
      },
      '.games-ul': {
        gap: '10px',
        '.active': {
          color: 'red'
        }
      },
      '.error-container': {

      }
    },
    getters: {
      routeGameName() {
        return this.context.router.params.gameName;
      },
      allGamesNames() {
        return allGames.map(c => c.name);
      },
      currGame() {
        return allGames.find(c => c.name === this.routeGameName);
      },
      currGameName() {
        return this.currGame?.name || '';
      },
    },
    onCreated() {
      if (!this.routeGameName) this.context.router.push('/games/Damka');
    },
    async onMounted() {
      this.setupGame();
    },
    onDestroyed() {
      this.stopGame();
    },
    watch: {
      'router.params.gameName'(val) {
        if (!val) return;
        setTimeout(() => {   /// fix params reactive bug;
          this.setupGame();
        });
      }
    },
    methods: {
      setupGame() {
        this.stopGame();
        const popup = new A_Alert('.content-container', true);
        if (!this.currGame) return;
        game = new this.currGame(EventManager, popup, '.game-container');
      },
      stopGame() {
        game?.destroy();
        game = null;
        // const gameCotainer = document.querySelector('.game-container');
        // if (gameCotainer) gameCotainer.innerHTML = '';
      }
    }
}