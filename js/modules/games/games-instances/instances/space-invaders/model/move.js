
export function moveItems(items) {
  items.forEach(item => {
    this.updateItemPos(item);
  });
}

export function updateItemPos(item, diffs) {
  const newPos = this.getNextPos(item, diffs);
  let hittedItemBetween;
  if (!this.boardService.isOutOfBoard(item.pos) && !this.boardService.isOutOfBoard(newPos)) hittedItemBetween = this.boardService.getHittedItemsBetweenPoss(item, item.pos, newPos, [...this.state.entities, ...(this.state.boardData.items || [])], ['SPACE']);
  if (hittedItemBetween) return this.handleHit(item, hittedItemBetween, newPos)
  else return this.doMoveItem(item, newPos);
}

export function doMoveItem(item, newPos) {
  const { boardData: {board} } = this.state;
  const {prevPos, didPutOnBoard} = this.boardService.moveItem(item, newPos);
  if (didPutOnBoard) [newPos, prevPos].forEach(pos => {
    if (this.boardService.isPosOut(pos)) return;
    this.emitCellUpdate(pos, board[pos.i][pos.j]);
  });
  return newPos;
}


// TO BOARD SERVICE;; ???????
export function getNextPos(item, diffs) {
  const prevPos = {...item.pos};
  if (!diffs) diffs = item.directions;
  const speed = item.speed || 1;
  let newPos;
  if (item.onMove) newPos = item.onMove.bind(this)(item.pos, this.state);
  else newPos = { i: prevPos.i + (diffs?.i || 0)*speed, j: prevPos.j + (diffs?.j || 0)*speed };
  return newPos;
}

export function handleHit(item, hitted, newPos) {
  if (this.boardService.isPosOut(newPos)) {
    if ((item.type === 'BULLET') && !this.boardService.isPosOut(item.pos)) {
      return this.terminateItem(item);
    }
    if ((item.type === 'ENEMY') && !this.boardService.isPosOut(item.pos)) {
      this.activePlayers.forEach(c => {
        this.updateHealth(c, -item.damage);
      });
      return this.terminateItem(item);
    }
  }
  let hittedItem = hitted;
  if (!hittedItem) return this.doMoveItem(item, newPos);
  if (hittedItem.type === 'WALL') {
    if (item.type === 'BULLET') return this.terminateItem(item);
    if (item.type === 'PLAYER') return;
    if (item.type === 'GIFT') {
      if (newPos.i < 1) return; 
      else return this.terminateItem(item);
    }
    if (item.type === 'ENEMY') {
      if (!(newPos.j > 0) && (newPos.j < this.constructor.BOARD_WIDTH-1) && !(newPos.i < 1)) return;
      if (this.boardService.isPosOut(newPos)) {
        item.pos = newPos;
        return;
      }
    }
  }
  if (hittedItem.type === 'BULLET') {
    if (item.type === 'PLAYER') return this.handleBulletHit(item, hittedItem);
    if (item.type === 'ENEMY') return this.handleBulletHit(item, hittedItem);
  }
  if (hittedItem.type === 'PLAYER') {
    if (item.type === 'BULLET') return this.handleBulletHit(hittedItem, item);
    if (item.type === 'ENEMY') return this.handleBulletHit(hittedItem, item);
    if (item.type === 'GIFT') return this.handleGiftHit(item, hittedItem);
    if (item.type === 'PATH') return this.handlePathMove(item, hittedItem);
    if (item.type === 'PLAYER') return; // TODO:: make sure they dont colide;
  }
  if (hittedItem.type === 'GIFT') {
    if (item.type === 'PLAYER') return this.handleGiftHit(hittedItem, item);
  }
  if (hittedItem.type === 'ENEMY') {
    if (item.type === 'ENEMY') return; // TODO:: make sure they dont colide;
    if (item.type === 'BULLET') return this.handleBulletHit(hittedItem, item);
    if (item.type === 'PLAYER') return this.handleBulletHit(item, hittedItem);
  }
  if (hittedItem.type === 'PATH') {
    if (item.type === 'PLAYER') return this.handlePathMove(hittedItem, item);
  }
  return this.doMoveItem(item, newPos); // moving throw each other, imagain a z axis
}

export function handlePathMove(pathItem, item) {
  this.doMoveItem(item, {...item.pos, ...pathItem.to});
}




export function handleGiftHit(gift, gifted) {
  this.updateScore(gifted, gift.points);
  if (gift.onCollect) gift.onCollect.bind(this)(gifted);
  return this.terminateItem(gift);
}

export function handleBulletHit(hitted, bullet) {
  if (bullet.shooterId === hitted.id) return;
  this.updateHealth(hitted, -bullet.damage);
  this.terminateItem(bullet);
  if (hitted.type === 'PLAYER') {
    hitted.bulletData.level = Math.ceil(hitted.bulletData.level / 2);
  }
  if (hitted.health <= 0) {
    const shooter = this.state.entities.find(c => c.id === bullet.shooterId);
    if (shooter) {
      shooter.killCount++;
      if (shooter.type === 'PLAYER') {
        this.updateScore(shooter, hitted.points);
        this.generateGift(hitted.pos);
      } else {
        shooter.score += hitted.points;
      }
    }
    if (hitted.type === 'PLAYER') {
      this.EvEmitter.emit('player_down', hitted.pos, hitted);
      this.checkGameOver();
    }
  }
}

export function terminateItem(item, soft = false) {
  item.dead = true;
  if (!soft) {
    this.state[item.parentList].splice(this.state[item.parentList].findIndex(c => c.id === item.id), 1);
    this.state.entities.splice(this.state.entities.findIndex(c => c.id === item.id), 1);
  }
  if (this.boardService.isPosOut(item.pos)) return;
  this.state.boardData.board[item.pos.i][item.pos.j] = this.constructor.makeEmptySpace();
  this.emitCellUpdate(item.pos, this.state.boardData.board[item.pos.i][item.pos.j]);
}