import THINGS from './things.js';
import sites from './site.js';
import { BeatPlayer } from './BeatPlayer.js';
import { socket } from './socket.js';

const INTERVAL_SPEED = 100;
let beatPlayer = null;
const startMaestroInterval = async (
    site = sites.mainSite,
    crossRoads = sites.crossRoads,
    things = THINGS,
    // things = THINGS.filter(c => c.type !== 'dynamicObstacle').slice(0,5),
    shuffle
  ) => {
    stopMaestroInterval();
    console.log('MAESTO INTERVAL IS RUNNING');
    beatPlayer = new BeatPlayer(
        {crossRoads, ...site},
        things,
        INTERVAL_SPEED,
        shuffle, 
        (beatsData) => {
            beatsData.forEach(beat => {
              socket.emit('bits', { bits: [beat] });
            });
        }
    );
    beatPlayer.play();
};


function stopMaestroInterval() {
    beatPlayer?.stop();
    console.log('FINISHED MAESTRO INTERVAL');
}

export {
  startMaestroInterval,
  stopMaestroInterval,
}

// startMaestroInterval();