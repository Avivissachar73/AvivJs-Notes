import A_Alert from '../../../lib/Alert.js';

import { Games } from './games-instances/index.js';


const allGames = Games.allGames;

Games

var gGame = null;

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
      // '.app-main': {
      //   'max-height': '80%',

      // },
      '.game-container': {
        width: '100%',
        display: 'flex',
        'align-items': 'center',
        'flex-direction': 'column',
        //  margin: '30px 0',
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
        gGame = new this.currGame('.game-container', popup);
      },
      stopGame() {
        gGame?.destroy();
        gGame = null;
        // const gameCotainer = document.querySelector('.game-container');
        // if (gameCotainer) gameCotainer.innerHTML = '';
      }
    }
}