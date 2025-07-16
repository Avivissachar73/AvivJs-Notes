import { Utils } from "../../../services/common.js";

export function generateGift(pos) {
    var randNum = Utils.getRandomInt(1, 15, true);
    var gift;

    if (randNum === 1) gift = this.createHealthGift(pos);
    if (randNum === 2) gift = this.createBulletLevelGift(pos);

    if (gift) {
        this.state.gifts.push(gift);
        this.state.entities.push(gift);
        this.boardService.placeOnBoard(pos, gift);
        this.emitCellUpdate(pos, gift);
    }
    return gift;
}

export function createBulletLevelGift(pos) {
    return this.constructor.createGiftItem(
        pos,
        'BULLET-LEVEL',
        `images/bullet_level_object.png`,
        (item) => {
            item.bulletData.level += 1;
            console.log('WOWO BULLET+++');
        }
    );
}

export function createHealthGift(pos) {
    return this.constructor.createGiftItem(
        pos,
        'HEALTH',
        `images/health_object.png`,
        (item) => {
            item.health = Math.min(item.health + 30, item.maxHealth * 1.5);
            this.EvEmitter.emit('health_update', item.pos, this.state.boardData.board[item.pos.i][item.pos.j]);
            console.log('WOWO health+++');
        }
    );
}

export function createGiftItem(pos, subType, img, onCollect) { // static
    return {
        parentList: 'gifts',
        id: Utils.getRandomId(),
        type: 'GIFT',
        pos: pos,
        subType,
        img,
        onCollect,
        speed: 1,
        directions: { i: 1, j: 0 },
        points: 30,
        size: { w: 3, h: 3 }
    }
}
