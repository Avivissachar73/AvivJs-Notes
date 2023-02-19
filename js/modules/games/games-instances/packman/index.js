
import { BaseBoardGame } from '../BaseBoardGame.class.js';
import { PackmanController } from './controller.js';
import { PackmanModel } from './model/index.js';


export class PackmanGame extends BaseBoardGame {
  static name = 'Packman';
  constructor(Emitter, popupInstance, containerSelector) {
    super(PackmanModel, PackmanController, popupInstance, containerSelector, Emitter);
  }
}




// function _geCellUiStr(type, subtype, isEmpty = false) {
//   if (isEmpty || type === 'border') return ' ';
//   if (type === 'player') return '🤠';
//   if (type === 'enemy') return ['😷','🤒','🤕','🤢','🤮','🤧'][0];
//   if (type === 'food' && subtype === 'food') return ' ';
//   if (subtype === 'supper-food') return ['☕','🥛','🍷','🍸','🍺','🍻','🥃','🥤'][0];
//   if (subtype === 'cherry') return ['🥑','🍒','🍆','🍉','🍌','🍅','🥥','🥔','🥦','🥕','🌽','🥒','🍄','🍇','🍞','🥐','🥨','🍦','🍨','🍩','🍪','🍰','🍔','🍟','🍕','🌮','🥪','🍿','🍲','🥘','🍳','🥡','🍭','🍬','🍫','🥫'][0];
//   return ' ';
// }