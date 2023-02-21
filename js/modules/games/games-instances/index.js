import { PackmanGame } from './instances/packman/index.js';
import { SnakeGame } from './instances/snake/index.js';
import { DamkaGame } from './instances/damka/index.js';
import { SpaceInvadersGame } from './instances/space-invaders/index.js';
import { MineSweeperGame } from './instances/mine-sweeper/index.js';
import { SheshBeshGame } from './instances/shesh-besh/index.js';


const allGames = [DamkaGame, PackmanGame, SnakeGame, SpaceInvadersGame, MineSweeperGame, SheshBeshGame];

export const Games = {
  allGames
}