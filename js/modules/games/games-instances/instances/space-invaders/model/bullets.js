

import { Utils } from "../../../services/common.js";

export function fire(shooter, directions) {
  const isMaxBullets = this.getAllBulletsOfShooter(shooter.id).length >= (shooter.bulletData.level**2);
  if (isMaxBullets) return;
  const newBullets = this.createBullets(shooter, 'images/bullet.png', directions);
  this.state.bullets.push(...newBullets);
  this.state.entities.push(...newBullets);
  newBullets.forEach(c => {
    
    this.boardService.placeOnBoard(c.pos, c);
    this.emitCellUpdate(c.pos, c);
  });
}


export function getAllBulletsOfShooter(shooterId) {
  return this.state.bullets.filter(c => c.shooterId === shooterId);
}

export function createBullet(shooter, img, pos, directions) { // static
  return {
    parentList: 'bullets',
    id: Utils.getRandomId(),
    type: 'BULLET',
    subType: shooter.type === 'PLAYER' ? 'FRIENDLY' : 'ENEMY',
    shooterId: shooter.id,
    pos,
    damage: Math.max(shooter.bulletData.level**2, 5),
    directions,
    img,
    size: { w: 1, h: 2 },
    speed: 2
  }
}

export function createBullets(shooter, img, directions) { // static
  const lvl = shooter.bulletData.level;
  const pos = { ...shooter.pos };
  const size = {...(shooter.size || { w: 1, h: 1 })}
  size.h /= 2;
  size.w /= 3;
  let poss = [];
  if (lvl === 1) {
    poss.push({ i: pos.i + directions.i*(size.h*2), j: pos.j + directions.j });
  }
  else if (lvl === 2) {
    poss.push(
      { i: pos.i + directions.i*(size.h*2), j: pos.j + directions.j - (1*size.w) },
      { i: pos.i + directions.i*(size.h*2), j: pos.j + directions.j + (1*size.w) },
    );
  }
  else if (lvl === 3) {
    poss.push(
      { i: pos.i + directions.i*(2*size.h), j: pos.j + directions.j },
      { i: pos.i + directions.i,            j: pos.j + directions.j - (2*size.w) },
      { i: pos.i + directions.i,            j: pos.j + directions.j + (2*size.w) },
    );
  }
  else if (lvl === 4) {
    poss.push(
      { i: pos.i + directions.i*(3*size.h), j: pos.j + directions.j - (1*size.w) },
      { i: pos.i + directions.i*(3*size.h), j: pos.j + directions.j + (1*size.w) },
      { i: pos.i + directions.i,            j: pos.j + directions.j - (3*size.w) },
      { i: pos.i + directions.i,            j: pos.j + directions.j + (3*size.w) },
    );
  }
  else { // >= 5
    poss.push(
      { i: pos.i + directions.i*(3*size.h), j: pos.j + directions.j },
      { i: pos.i + directions.i*(2*size.h), j: pos.j + directions.j - (1*size.w) },
      { i: pos.i + directions.i*(2*size.h), j: pos.j + directions.j + (1*size.w) },
      { i: pos.i + directions.i,            j: pos.j + directions.j - (2*size.w) },
      { i: pos.i + directions.i,            j: pos.j + directions.j + (2*size.w) },
    );
  }
  poss = poss
    .map(c => ({ i: Math.floor(c.i), j: Math.floor(c.j) }))
    .filter(c => !this.boardService.isOutOfBoard(c) && !this.boardService.validateOnBorder(c));
  return poss.map(pos => this.createBullet(shooter, img, pos, directions))
}