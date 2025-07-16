import { Utils } from "../../../services/common.js";


export function generateNewEnemies() {
  const wave = this.state.wave;
  const isSuperWave = wave % 10 === 0;
  const pos = { i : -1, j: 0 };
  const enemiesCount = isSuperWave? wave / 10 : wave;
  for (let i = 0; i < enemiesCount; i++) {
    if (i) pos.i -= Utils.getRandomInt(3, 8, true);
    pos.j = Utils.getRandomInt(1, this.constructor.BOARD_WIDTH-1);
    this.createEnemy(this.state, {...pos}, isSuperWave);
  }
}

export function createEnemy(state, pos, isSuper) {
  const { boardData: {board}, enemies, entities } = state;
  const enemy = {
    parentList: 'enemies',
    type: 'ENEMY',
    subType: isSuper? 'SUPER' : 'REG',
    id: Utils.getRandomId(),
    pos,
    speed: 1,
    img: 'images/enemy_ship.png',
    size: { w: 4, h: 2.3 },
    directions: { i: 1, j: 0 },
    damage: isSuper ? 100 : 10,
    health: isSuper ? 100 : 10,
    maxHealth: isSuper ? 100 : 10,
    points: isSuper ? 50 : 1,
    score: 0,
    killCount: 0,
    bulletData: isSuper ? {
      type: '',
      level: 2
    } : null,
    onMove: isSuper ? onMoveSuperEnemy : null
  };
  if (isSuper) {
    enemy.size.w *= 3;
    enemy.size.h *= 3;
  }
  enemies.push(enemy);
  entities.push(enemy);
  this.boardService.placeOnBoard(pos, enemy);
  return enemy;
}

export function onMoveSuperEnemy(pos, state) {
  if (pos.i < 5) return { ...pos, i: pos.i + 1 };
  const closestPlayer = [...this.activePlayers].sort((a, b) => {
    const absoluteADiff = Math.abs(pos.i - a.pos.i) + Math.abs(pos.j - a.pos.j);
    const absoluteBDiff = Math.abs(pos.i - נ.pos.i) + Math.abs(pos.j - b.pos.j);
    return absoluteADiff - absoluteBDiff
  })[0];
  return {
    ...pos,
    j: pos.j + ((closestPlayer.pos.j > pos.j) ? 1 : (closestPlayer.pos.j < pos.j) ? -1 : 0)
  }
}