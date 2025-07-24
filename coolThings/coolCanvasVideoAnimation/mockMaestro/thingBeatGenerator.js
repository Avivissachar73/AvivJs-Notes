/**
 * Use the function 'createThingBeats' to generate beats in a 'real' path, example in the bottom of this file
 */


import utils from './utils.js';

const _thingBeatMap = {};

const _getAngleFromStepDiffs = (stepDiffs = { x: 1, y: 1 }) => {
    const { x, y } = _parseStepDiffs(stepDiffs);

    if (x == 0 && y == 1) return 180;     // for a case there is no slope
    if (x == 0 && y == -1) return 0;
    if (x == 1 && y == 0) return 90;
    if (x == -1 && y == 0) return 270;

    const slope = (y - y*2)/(x - x*2);
    let angle = Math.atan(slope)*180/Math.PI;
    angle += x > 0 ? 90 : -90;
    return angle;
}

const _parseStepDiffs = (stepDiffs) => { // returns x any y in the same ratio but where the abs value of theyr sum is 1
    const { x, y } = stepDiffs;
    const ratio = 1/(Math.abs(x)+Math.abs(y));
    return { x: x*ratio || 0, y: y*ratio || 0 };
}

const _createThingBit = (thing, pos, time, stepDiffs) => {
    return {
        time,
        code: thing.code, // thingId
        type: thing.type,
        geo: {
            x: pos.x,
            y: pos.y,
            z: 0,

            width: thing.width,
            height: thing.height,
            depth: 0,

            roll: 0,    // a circular (clockwise or anticlockwise) movement of the body as it moves forward
            pitch: 0,   // nose up or tail up.
            yaw: _getAngleFromStepDiffs(stepDiffs), // nose moves from side to side - 2d direction of movement on the x/y graph

            // velocity: Math.abs(stepDiffs.x + stepDiffs.y)*10
            velocity: utils.randInt(0, 15)
        },
    }
}

const _createBitsForThing = (site, road, thing, bitsPerThingCount) => {
    const thingBits = [];
    let pos;
    let stepDiffs;
    let lastThingData = _thingBeatMap[thing.code];
    const isOutOfSite = (() => {
        const lastPos = lastThingData?.pos;
        if (!lastPos) return false;
        return lastPos.x < 0 || lastPos.y < 0 || lastPos.x > site.width || lastPos.y > site.height;
    })();
    if (lastThingData && !isOutOfSite) {
        pos = lastThingData.pos;
        stepDiffs = lastThingData.stepDiffs;
    } else {
        _thingBeatMap[thing.code] = lastThingData = {};
        const randCrosRoad = utils.randItem(road);
        lastThingData.pos = pos = { x: randCrosRoad.x, y: randCrosRoad.y };
        lastThingData.stepDiffs = stepDiffs = _parseStepDiffs(utils.randItem(randCrosRoad.turnDirections));
    }
    for (let i = 0; i < bitsPerThingCount; i++) {
        pos.x += 10 * stepDiffs.x;
        pos.y += 10 * stepDiffs.y;
        lastThingData.pos = pos;

        const turnPos = road.find(currPos => (
            Math.abs(currPos.x - pos.x) < 10 &&
            Math.abs(currPos.y - pos.y) < 10
        ));
        if (turnPos) {
            lastThingData.stepDiffs = stepDiffs = _parseStepDiffs(utils.randItem(turnPos.turnDirections));
        }

        const time = Date.now() + (i * 100);
        thingBits.push(_createThingBit(thing, pos, time, stepDiffs));
    }
    return thingBits;
}


export const createThingBeats = (site, things, bitsPerThingCount = 1) => {
    const allThingBits = [];
    const road = site.crossRoads? _buildRoadFromCrossRoad(site.crossRoads) : _getDefaultRoad(site.height, site.width);
    // const road = _buildRoadFromCrossRoad(site.crossRoads);
    things.forEach((thing, idx) => {
        allThingBits.push(..._createBitsForThing(site, road, thing, bitsPerThingCount));
    });
    return allThingBits;
}


function _buildRoadFromCrossRoad(crossRoads) {
    return crossRoads.map(curr => ({
        x: curr.x,
        y: curr.y,
        turnDirections: curr.targetPositions.map(pos => {
            const x1 = curr.x;
            const y1 = curr.y;
            const x2 = pos.x;
            const y2 = pos.y;

            let slope = (x1 - x2)/(y1 - y2);
            if (x1 === x2) slope = 0;
            else if (y1 === y2) slope = (x1 > x2)? -1 : 1;

            let x = slope;
            let y = !x? (1 * y1 > y2? -1 : 1) : 0;

            if (y1 !== y2 && x1 !== x2) {
                if (x1 < x2 && x < 0 || x1 > x2 && x > 0) x *= -1;
                y = (y1 > y2)? -1 : 1;
            }

            return { x, y }
        })
    }));
}


function _getDefaultRoad(siteHeight, siteWidth) {
    const defaultSiteData = {
        "width": 1250,
        "height": 1000,
        "crossRoads": [
            { "x": 25,   "y": 175, "targetPositions": [{ "x": 525, "y": 175 }, { "x": 25,   "y": 675 }, { "x": 25,  "y": 25 }, { "x": 1225, "y": 675 }] },    // "turnDirections": [{ "x": 1, "y": 0 }, { "x": 0, "y": 1 }, { "x": 0, "y": -1 }]
            { "x": 525,  "y": 175, "targetPositions": [{ "x": 525, "y": 675 }, { "x": 1225, "y": 175 }, { "x": 25,  "y": 175 }] },                            // "turnDirections": [{ "x": 0, "y": 1 }, { "x": 1, "y": 0 }, { "x": -1, "y": 0 }]
            { "x": 525,  "y": 675, "targetPositions": [{ "x": 25,  "y": 675 }, { "x": 1225, "y": 675 }, { "x": 525, "y": 175 }] },                            // "turnDirections": [{ "x": -1, "y": 0 }, { "x": 1, "y": 0 }, { "x": -1, "y": 0 }, { "x": 0, "y": -1 }]
            { "x": 25,   "y": 675, "targetPositions": [{ "x": 25,  "y": 175 }, { "x": 25,   "y": 975 }, { "x": 525, "y": 675 }] },                            // "turnDirections": [{ "x": 0, "y": -1 }, { "x": 0, "y": 1 }, { "x": 1, "y": 0 }]
        
            { "x": 25,   "y": 25,  "targetPositions": [{ "x": 25,  "y": 175 }] },                                                                             // "turnDirections": [{ "x": 0, "y": 1 }]
            { "x": 25,   "y": 975, "targetPositions": [{ "x": 25,  "y": 675 }] },                                                                             // "turnDirections": [{ "x": 0, "y": -1 }]
            { "x": 1225, "y": 675, "targetPositions": [{ "x": 525, "y": 675 }, { "x": 25,   "y": 175 }] },                                                    // "turnDirections": [{ "x": -1, "y": 0 }]
            { "x": 1225, "y": 175, "targetPositions": [{ "x": 525, "y": 175 }] },                                                                             // "turnDirections": [{ "x": -1, "y": 0 }]
            
            { "x": 645,  "y": 175, "targetPositions": [{ "x": 25, " y": 175 }, { "x": 1225, "y": 175 },  { "x": 25,  "y": 375 }] },                           // "turnDirections": [{ "x": -1, "y": 0 }, { "x": 1, "y": 0 }, { "x": -3.1, "y": 1 }]
            { "x": 25,   "y": 375, "targetPositions": [{ "x": 25,  "y": 675 }, { "x": 25,   "y": 175 },  { "x": 645, "y": 175 }] }                            // "turnDirections": [{ "x": 0, "y": 1 }, { "x": 0, "y": -1 },  { "x": 3.1, "y": -1 }]
        ]
    }
    const heightRatio = siteHeight / defaultSiteData.height;
    const widthRatio =  siteWidth  / defaultSiteData.width;
    const crossRoads = defaultSiteData.crossRoads.map(curr => ({
        x: curr.x * widthRatio,
        y: curr.y * heightRatio,
        targetPositions: curr.targetPositions.map(pos => ({
            x: pos.x * widthRatio,
            y: pos.y * heightRatio
        }))
    }));
    return _buildRoadFromCrossRoad(crossRoads);
}


export default {
    createThingBeats
}