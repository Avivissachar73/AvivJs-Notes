import utils from './utils.js';

export class BeatPlayer {
  constructor(site = {width: 1250, height: 1000}, things = [], intervalSpeed = 100, shuffle = true, onBeatsCb = null) {
    this.site = site;
    this.things = things;
    this.intervalSpeed = intervalSpeed;
    this.onBeatsCb = onBeatsCb;
    this.shuffle = shuffle;

    things.forEach(thing => {
        if (!thing.road && !thing.crossRoads) return;
        thing.road = thing.road || BeatPlayer._buildRoadFromCrossRoad(thing.crossRoads);
    });
    this.road = site.road || 
                (site.crossRoads ?
                    BeatPlayer._buildRoadFromCrossRoad(site.crossRoads) : 
                    BeatPlayer._getDefaultRoad(site.height, site.width));
  }

  BeatMap = {};  // { [beat.code]: { pos: { x, y }, stepDiffs: { x, y, speed, alert } } }
  frame = 0;

  interval = null;
  play() {
    this.BeatMap = {};
    this.interval = setInterval(() => {
        const beatsData = this.createBeats();
        if (!beatsData.length) return this.stop();
        this.onBeatsCb?.(beatsData);
    }, this.intervalSpeed);
  }
  stop() {
    if (!this.interval) return;
    clearInterval(this.interval);
    this.interval = null;
  }

    
  createBeats = (beatsPerThingCount) => {
    this.frame++;
    const { things } = this;
    const allthingBeats = [];
    things.forEach((thing, idx) => {
        allthingBeats.push(...this.createBeatsForThing(thing, beatsPerThingCount));
    });
    return allthingBeats;
  }

  createBeatsForThing = (thing, beatsPerThingCount = 1) => {
      const { site, road : defaultRoad } = this;

      const road = thing.road || defaultRoad;

      const thingBeatsData = [];
      let pos;
      let stepDiffs;
      let lastThingData = this.BeatMap[thing.code];
      let prevPos = null;
      if (lastThingData && lastThingData.finish) return thingBeatsData;
      const isOutOfSite = (() => {
          const lastPos = lastThingData?.pos;
          if (!lastPos) return false;
          return lastPos.x < 0 || lastPos.y < 0 || lastPos.x > site.width || lastPos.y > site.height;
      })();
      if (lastThingData && !isOutOfSite) {
          pos = lastThingData.pos;
          prevPos = { ...pos };
          stepDiffs = lastThingData.stepDiffs;
      } else {
          this.BeatMap[thing.code] = lastThingData = {};
          const randCrosRoad = this.shuffle? utils.randItem(road) : road[0]; 
          lastThingData.pos = pos = { x: randCrosRoad.x, y: randCrosRoad.y };
          lastThingData.stepDiffs = stepDiffs = BeatPlayer._parseStepDiffs(randCrosRoad.targetData || (randCrosRoad.turnDirections && utils.randItem(randCrosRoad.turnDirections)));
      }
      let speed = stepDiffs.speed || 10;
      for (let i = 0; i < beatsPerThingCount; i++) {
          pos.x += (speed * stepDiffs.x);
          pos.y += (speed * stepDiffs.y);
        //   console.log(stepDiffs, speed, pos)
          lastThingData.pos = pos;
  
          const turnPos = road.find(currPos => (
              Math.abs(currPos.x - pos.x) < speed &&
              Math.abs(currPos.y - pos.y) < speed
          ));
          if (turnPos) {
              lastThingData.stepDiffs = stepDiffs = (turnPos.turnDirections?.length && BeatPlayer._parseStepDiffs(utils.randItem(turnPos.turnDirections))) || 
                                                    (turnPos.targetData && BeatPlayer._parseStepDiffs(turnPos.targetData));
          }
          if (!stepDiffs) {
            lastThingData.finish = true;
            return thingBeatsData;
          }
  
          const beatData = {
              frame: this.frame,
              thing,
              code: thing.code,
              pos,
              width: thing.width,
              height: thing.height,
              time: (Date.now() + (i * 100)),
              speed: prevPos ? Math.abs(pos.y - prevPos.y) + Math.abs(pos.x - prevPos.x) : 0,
              stepDiffs,
              rotate: BeatPlayer._getAngleFromStepDiffs(stepDiffs)
          }
          beatData.alertsData = this._getAlertsData(beatData);

          // if (site.reverseDisplayX) beat.rotate = -beat.rotate;
          if (site.reverseDisplayY) beatData.rotate = 180-beatData.rotate;
          thingBeatsData.push(beatData);
      }
  
      return thingBeatsData;
  }

  _getAlertsData(beatData) {
      const { speed, pos, code } = beatData;
      const alerts = [];
      const NearMissDist = 150;
      const maxSpeed = 20;
      if (speed > maxSpeed) alerts.push({
          type: "OverSpeed",
          speed,
          codes: [code],
          maxSpeed
      });
      const nearBeatsCodes = [];
      for (let codeKey in this.BeatMap) {
          if (codeKey === code) continue;
          const data = this.BeatMap[codeKey];
          if (Math.abs(data.pos.x - pos.x) + Math.abs(data.pos.y - pos.y) <= NearMissDist) {
              nearBeatsCodes.push(codeKey);
          }
      }
      if (nearBeatsCodes.length) alerts.push({
        type: 'NearMiss',
        speed,
        codes: [...nearBeatsCodes, code].sort(),
      });
      return alerts;
  }
  
  static _getAngleFromStepDiffs = (stepDiffs = { x: 1, y: 1 }) => {
      const { x, y } = BeatPlayer._parseStepDiffs(stepDiffs);
  
      if (x == 0 && y == 1) return 180;     // for a case there is no slope
      if (x == 0 && y == -1) return 0;
      if (x == 1 && y == 0) return 90;
      if (x == -1 && y == 0) return 270;
  
      const slope = (y - y * 2) / (x - x * 2);
      let angle = Math.atan(slope) * 180 / Math.PI;
      angle += x > 0 ? 90 : -90;
      return angle;
  }
  
  static _parseStepDiffs = (stepDiffs) => { // returns x any y in the same ratio but where the abs value of their sum is 1
    //   if (!stepDiffs) return {x: 0, y: 0}
      const { x, y } = stepDiffs;
      const ratio = 1 / (Math.abs(x) + Math.abs(y));
      return { ...stepDiffs, x: x * ratio || 0, y: y * ratio || 0 };
  }
  
  
  static _buildRoadFromCrossRoad(crossRoads) {
      return crossRoads.map(curr => {
          const posToPosDiffs = pos => {
            const x1 = curr.x;
            const y1 = curr.y;
            const x2 = pos.x;
            const y2 = pos.y;

            let slope = (x1 - x2) / (y1 - y2);
            if (x1 === x2) slope = 0;
            else if (y1 === y2) slope = (x1 > x2) ? -1 : 1;

            let x = slope;
            let y = !x ? (1 * y1 > y2 ? -1 : 1) : 0;

            if (y1 !== y2 && x1 !== x2) {
                if (x1 < x2 && x < 0 || x1 > x2 && x > 0) x *= -1;
                y = (y1 > y2) ? -1 : 1;
            }
            return { x, y, speed: pos.speed };
          }
          return {
            x: curr.x,
            y: curr.y,
            targetData: curr.targetData && posToPosDiffs(curr.targetData),
            turnDirections: curr.targetPositions?.map(posToPosDiffs)
          }
      });
  }
  
  static _getDefaultRoad(siteHeight, siteWidth) {
      const defaultSiteData = {
          "width": 1250,
          "height": 1000,
          "crossRoads": [
              { "x": 25, "y": 175, "targetPositions": [{ "x": 525, "y": 175 }, { "x": 25, "y": 675 }, { "x": 25, "y": 25 }, { "x": 1225, "y": 675 }] },    // "turnDirections": [{ "x": 1, "y": 0 }, { "x": 0, "y": 1 }, { "x": 0, "y": -1 }]
              { "x": 525, "y": 175, "targetPositions": [{ "x": 525, "y": 675 }, { "x": 1225, "y": 175 }, { "x": 25, "y": 175, speed: 23 }] },                            // "turnDirections": [{ "x": 0, "y": 1 }, { "x": 1, "y": 0 }, { "x": -1, "y": 0 }]
              { "x": 525, "y": 675, "targetPositions": [{ "x": 25, "y": 675 }, { "x": 1225, "y": 675 }, { "x": 525, "y": 175 }] },                            // "turnDirections": [{ "x": -1, "y": 0 }, { "x": 1, "y": 0 }, { "x": -1, "y": 0 }, { "x": 0, "y": -1 }]
              { "x": 25, "y": 675, "targetPositions": [{ "x": 25, "y": 175 }, { "x": 25, "y": 975 }, { "x": 525, "y": 675 }] },                            // "turnDirections": [{ "x": 0, "y": -1 }, { "x": 0, "y": 1 }, { "x": 1, "y": 0 }]
  
              { "x": 25, "y": 25, "targetPositions": [{ "x": 25, "y": 175 }] },                                                                             // "turnDirections": [{ "x": 0, "y": 1 }]
              { "x": 25, "y": 975, "targetPositions": [{ "x": 25, "y": 675 }] },                                                                             // "turnDirections": [{ "x": 0, "y": -1 }]
              { "x": 1225, "y": 675, "targetPositions": [{ "x": 525, "y": 675, speed: 25 }, { "x": 25, "y": 175 }] },                                                    // "turnDirections": [{ "x": -1, "y": 0 }]
              { "x": 1225, "y": 175, "targetPositions": [{ "x": 525, "y": 175 }] },                                                                             // "turnDirections": [{ "x": -1, "y": 0 }]
  
              { "x": 645, "y": 175, "targetPositions": [{ "x": 25, " y": 175 }, { "x": 1225, "y": 175 }, { "x": 25, "y": 375 }] },                           // "turnDirections": [{ "x": -1, "y": 0 }, { "x": 1, "y": 0 }, { "x": -3.1, "y": 1 }]
              { "x": 25, "y": 375, "targetPositions": [{ "x": 25, "y": 675 }, { "x": 25, "y": 175 }, { "x": 645, "y": 175 }] }                            // "turnDirections": [{ "x": 0, "y": 1 }, { "x": 0, "y": -1 },  { "x": 3.1, "y": -1 }]
          ]
      }
      console.log(siteWidth, siteHeight);
      const heightRatio = siteHeight / defaultSiteData.height;
      const widthRatio = siteWidth / defaultSiteData.width;
      const crossRoads = defaultSiteData.crossRoads.map(curr => ({
          x: curr.x * widthRatio,
          y: curr.y * heightRatio,
          targetPositions: curr.targetPositions.map(pos => ({
              ...pos,
              x: pos.x * widthRatio,
              y: pos.y * heightRatio,
          }))
      }));
      return BeatPlayer._buildRoadFromCrossRoad(crossRoads);
  }
}