export class Timer {
  state = null;
  constructor() {
    this._init();
  }
  _init(state) {
    this.state = state || {
      playGroups: [], /* [_emptyTimeItem] but full */
      currPlayItem: this._emptyTimeItem(),
      prmData: { promise: null, resolvers: { resolve: null, reject: null } },
      checkPoints: [], /* { at: TIME_STAMP, time: MS } */
      isOn: false
    }
  }
  _emptyTimeItem() {
    return { start: null /* TIME STAMP */, end: null /* TIME STAMP */, total: null /* MS */ };
  }

  get totalTimeMS() {
    const { state } = this;
    const start = state.playGroups[0]?.start || state.currPlayItem.start || 0;
    if (!start) return 0;
    const ongoingTimeItem = {...state.currPlayItem}
    const totalPlayTime = state.playGroups.reduce((total, c) => total + c.total, 0);
    const ongoingTime = ongoingTimeItem.start? (ongoingTimeItem.end || Date.now()) - ongoingTimeItem.start : 0;
    const totalTimeMS = totalPlayTime + ongoingTime;
    return totalTimeMS;
  }
  get formatedTime() {
    return this.constructor.formatTime(this.totalTimeMS);
  }
  get prettyTime() {
    return this.constructor.makePrettyTime(this.totalTimeMS);
  }
  get timeRes() {
    const { formatedTime, prettyTime, totalTimeMS, state } = this;
    return { formatedTime, prettyTime, totalTimeMS, playGroups: state.playGroups };
  }

  play() {
    const { state } = this;
    if (state.isOn) return state.prmData.promise;
    state.isOn = true;
    state.currPlayItem.start = Date.now();
    if (!state.playGroups.length) {
      state.prmData.promise = new Promise((resolve, reject) => {
        state.prmData.resolvers = { resolve, reject };
      });
    }
    return state.prmData.promise;
  }
  pause() {
    const { state } = this;
    if (!state.isOn) return null;
    state.isOn = false;
    state.currPlayItem.end = Date.now();
    state.currPlayItem.total = state.currPlayItem.end - state.currPlayItem.start;
    state.playGroups.push(state.currPlayItem);
    state.currPlayItem = this._emptyTimeItem();
    return state.playGroups[state.playGroups.length-1];
  }
  stop() {
    const { state } = this;
    this.pause();
    state.prmData?.resolvers?.resolve?.(this.timeRes);
    return this.timeRes;
  }
  reset() {
    this.stop();
    this._init();
  }
  check() {
    if (!this.state.isOn) return null;
    const time = this.totalTimeMS;
    const checkItem = { at: Date.now(), time, prettyTime: this.constructor.makePrettyTime(time) };
    this.state.checkPoints.push(checkItem);
    return checkItem;
  }

  static padNum(num, length = 2) {
    var numStr = num.toString();
    if (numStr.length >= length) return numStr;
    return '0'.repeat(length-numStr.length) + numStr;
  }
  static formatTime(timeMS) {
    const hos = parseInt((timeMS / 10) % 100 ); /* sec / 100 */ // houndred of a sec;
    const sec = parseInt((timeMS / 1000) % 60);
    const min = parseInt(timeMS / 1000 / 60);
    return { hos, sec, min }
  }
  static makePrettyTime(timeMS) {
    const data = this.formatTime(timeMS);
    const padNum = this.padNum;
    return `${padNum(data.min)}:${padNum(data.sec)}:${padNum(data.hos)}`;
  }
}


import { elementService } from './element.service.js';
const { El } = elementService;

export class TimerWithUi {
  element = null;
  interval = null;
  constructor(parentSelector = 'body', remSize = 16) {
    this.service = new Timer();
    this.parentSelector = parentSelector;
    this.parentEl = document.querySelector(parentSelector);
    this.remSize = remSize;
    this._init();
  }
  _init() {
    this._initDOM();
    this._renderTime();
  }
  _initDOM() {
    const em = (val) => `${val / 16}em`;
    this.element = El(`<div class="pretty-timer">
      <div class="time">
        HR:MIN:SEC
      </div>
      </div>`, {}, [
      El(`<div class="actions"></div>`, {}, [
        El(`<button><span>▶</span></button>`, { onclick: () => this.play() }),
        El(`<button><span style="display:inline-block;transform:rotate(90deg)">=<span></button>`, { onclick: () => this.pause() }),
        El(`<button><span>◼</span></button>`, { onclick: () => this.reset() }),
        El(`<button><span>●</span></button>`, { onclick: () => this.check() }),
      ]),
      El(`<div class="check-points"></div>`),
      elementService.StyleEl('.pretty-timer', {
        fontSize: (this.remSize || 25) + 'px',
        boxSizing: 'border-box',
        width: 'fit-content',
        padding: em(5),
        border: `${em(1)} solid black`,
        borderRadius: em(7.5),
        'box-shadow': `0 0 ${em(5)} ${em(0)} rgba(0,0,0,0.2)`,
        p: {
          margin: 0,
          marginBottom: em(3)
        },
        '.time': {
          textAlign: 'center',
        },
        '.actions': {
          display: 'flex',
          gap: em(3),
          button: {
            fontSize: em(13),
            textAlign: 'center',
            height: em(25),
            width: em(25),
            padding: 0,
            border: `${1/16}em solid gray`,
            backgroundColor: '#e5e5e5',
            borderRadius: em(3),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            span: {
              textAlign: 'center'
            },
            '&:hover': {
              cursor: 'pointer',
              'box-shadow': `0 0 ${em(5)} ${em(0)} rgba(0,0,0,0.2)`
            },
            '&:active': {
              cursor: 'pointer',
              transform: 'scale(1.05)'
            }
          }
        },
        '.check-points': {
          fontSize: em(10),
          p: {
            marginTop: em(3)
          },
          ul: {
            margin: 0,
            padding: 0,
            paddingInlineStart: em(25),
            'list-style-type': 'decimal'
          }
        }
      })
    ]);
    this.parentEl.innerHTML = '';
    this.parentEl.appendChild(this.element);
  }
  _renderTime() {
    this.element.querySelector('.time').innerHTML = this.service.prettyTime;
  }
  _renderCheckPoints() {
    if (!this.service.state.checkPoints.length) return;
    this.element.querySelector('.check-points').innerHTML = `
      <p>Check-points:</p>
      <ul>
        ${this.service.state.checkPoints.map(c => `<li>
          ${c.prettyTime}
        </li>`).join('')}
      </ul>
    `;
  }

  play() {
    const prmData = this.service.play();
    this.playInterval();
    return prmData;
  }
  pause() {
    this.service.pause();
    this.stopInterval();
    this._renderTime();
  }
  stop() {
    this.service.stop();
    this.stopInterval();
  }
  reset() {
    this.stopInterval();
    this.service.reset();
    this._init();
  }
  check() {
    this.service.check();
    this._renderCheckPoints();
  }

  static intervalTime = 65;
  playInterval() {
    if (this.interval) return;
    this.interval = setInterval(() => {
      this._renderTime();
    }, this.constructor.intervalTime);
  }
  stopInterval() {
    clearInterval(this.interval);
    this.interval = null;
  }
}



// (async () => {
//   const timer = new TimerWithUi('.timer-container', 25);
//   window.timer = timer;
//   // setTimeout(() => {
//   //   timer.stop();
//   // }, 3000);
//   // const time = await timer.play();
//   // console.log(time);
// })();