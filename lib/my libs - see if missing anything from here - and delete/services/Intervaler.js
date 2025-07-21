import { Utils } from "./utils.service.js";

export class Intervaler {
  // timeIntervals = [];
  // pausedAt = 0;
  // isActive = false;

  state = {};
  speed = 1;
  static initState() {
    return {
      timeIntervals: [], // [{ time: <timeStamp>, cb: () => DO_WHATEVER, id, timeId, lastActivateAt  }];
      pausedAt: 0,
      isActive: false
    }
  }

  constructor(speed = 1, initialState) {
    this.speed = speed;
    this.state = initialState || this.constructor.initState();
  }
  
  _runTask(taskItem) {
    // const timeDiff = this._getTimePassedFromIteration(taskItem);
    const timeDiff = ((taskItem.pausedAt || this.state.pausedAt) && taskItem.lastActivateAt) ? (taskItem.pausedAt || this.state.pausedAt) - taskItem.lastActivateAt : 0;
    const isInterval = taskItem.type === 'interval';
    // if (!isInterval && (timeDiff > taskItem.time)) return;
    const runIt = () => {
      taskItem.timeId = window[isInterval? 'setInterval' : 'setTimeout'](() => {
        taskItem.lastActivateAt = Date.now();
        taskItem.cb();
        if (!isInterval) taskItem.isActive = false;
      }, taskItem.time / this.speed);
      return taskItem.timeId;
    }
    taskItem.lastActivateAt = Date.now();
    if (timeDiff > 0) {
      taskItem.lastActivateAt -= timeDiff;
      const timeLeft = (taskItem.time / this.speed) - timeDiff;
      this._runTimeout(() => {
        taskItem.cb();
        if (isInterval) runIt();
        else taskItem.isActive = false;
      }, timeLeft);
    } else {
      return runIt();
    }
  }
  _runTasks() {
    this.state.timeIntervals.filter(c => c.isActive).forEach(this._runTask.bind(this));
  }

  _stopTask(taskItem) {
    const isInterval = taskItem.type === 'interval';
    window[isInterval? 'clearInterval' : 'clearTimeout'](taskItem.timeId);
    taskItem.timeId = null;
  }
  _stopTasks() {
    this.state.timeIntervals.forEach(this._stopTask)
  }

  static _makeTasklItem(type /* 'timeout', 'interval' */ , time, cb) {
    return { type, time, cb, id: Utils.getRandomId(), lastActivateAt: null, isActive: true }
  }

  // _getTimePassedFromIteration(taskItem) {
  //   const timeDiff = (taskItem.pausedAt || this.state.pausedAt || 0) - (taskItem.lastActivateAt || 0);
  //   return timeDiff;
  // }

  
  _timeouteIds = [];
  _runTimeout(cb, time) {
    const timeoutId = setTimeout(cb, time / this.speed);
    this._timeouteIds.push(timeoutId);
    return timeoutId;
  }
  _stopTimeouts() {
    this._timeouteIds.forEach(clearTimeout);
    this._timeouteIds = [];
  }


  _appendTask(type, time, cb) {
    const taskItem = this.constructor._makeTasklItem(type, time, cb);
    this.state.timeIntervals.push(taskItem);
    if (this.state.isActive) this._runTask(taskItem);
    return taskItem.id;
  }
  _removeTask(id) {
    const idx = this.state.timeIntervals.findIndex(c => c.id === id);
    if (idx === -1) return;
    this._stopTask(this.state.timeIntervals[idx]);
    this.state.timeIntervals.splice(idx, 1);
  }
  _toggleTaskActive(id, isActive) {
    const task = this.state.timeIntervals.find(c => c.id === id);
    if (!task) return;
    task.isActive = isActive;
    if (!isActive) {
      task.pausedAt = Date.now();
      this._stopTask(task);
    }
    else {
      // task.timeFromLastIt = this._getTimePassedFromIteration(task);
      // task.pausedAt = null;
      this._runTask(task);
    }
  }


  appendInterval(cb, time) {
    return this._appendTask('interval', time, cb);
  }
  removeInterval(id) {
    return this._removeTask(id);
  }
  pauseInterval(id) {
    return this._toggleTaskActive(id, false);
  }
  playInterval(id) {
    return this._toggleTaskActive(id, true);
  }

  appendTimeout(cb, time) {
    return this._appendTask('timeout', time, cb);
  }
  removeTimeout(id) {
    return this._removeTask(id);
  }
  pauseTimeout(id) {
    return this._toggleTaskActive(id, false);
  }
  playTimeout(id) {
    return this._toggleTaskActive(id, true);
  }


  run() {
    this.state.isActive = true;
    this._runTasks();
  }
  stop() {
    this.state.isActive = false;
    this.state.pausedAt = Date.now();
    this._stopTasks();
    this._stopTimeouts();
  }
  reset() {
    this.stop();
    this.state = this.constructor.initState();
  }

  

  setSpeed(speed) {
    const isActive = this.state.isActive;
    if (isActive) this.stop();
    this.speed = speed;
    if (isActive) this.run();
  }
}

// test::
// const intervaler = new Intervaler();
// window.intervaler = intervaler;

// let x = 0;

// intervaler.appendTimeout(() => console.log('WOW', ++x), 3000);
// intervaler.appendInterval(() => console.log('WOWIntervall', ++x), 3000);

// intervaler.run();