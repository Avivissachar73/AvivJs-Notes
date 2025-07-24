import utils from './utils.js';

const _createAlert = (site, thing, idx) => {
    return {
        // _id: utils.makeId(),
        thingCodes: [thing.code],
        time: Date.now() + (100 * idx),
        x: utils.randInt(0, site.width),
        y: utils.randInt(0, site.height),
        type: utils.randItem(['nearMiss', 'overSpeed', 'system']),
        stopDistance: utils.randInt(0, 7),
        actualDistance: utils.randInt(3, 10),
        safeStopDist: utils.randInt(15, 25),
        smallestDistFromObst: utils.randInt(4, 17),
        timeSpeeding: utils.randInt(2, 10),
        maxSpeed: utils.randInt(15, 25),
        velocity: utils.randInt(4, 17),
        code: utils.randItem(['c101', 'c102', 'c103']),
        vehicleName: utils.randItem(['forkList101', 'forkList102', 'forkList103'])
    }
}
export const createAlerts =  (site = { width: 100, height: 100 }, things = [{code: 'SOME_CODE'}], alertCount = 10) => {
    const alerts = [];
    things.forEach((thing, idx) => {
        for (let i = 0; i < alertCount; i++) alerts.push(_createAlert(site, thing, i));
    });
    return alerts;
}

export default {
    createAlerts
}