import things from './things.js';
import SITES from './site.js';
import { createThingBeats } from './thingBeatGenerator.js';
import { createAlerts } from './alertGenerator.js';



import { socket } from '../lib/EventEmiter.js';


const INTERVAL_SPEED = 100;
let interval;
const maestroInterval = async () => {
    console.log('MAESTO INTERVAL IS RUNNING');
    interval = setInterval(() => {
        const thingBeats = createThingBeats(SITES.mainSite, things);
        thingBeats.forEach(beat => {
            // console.log('SENDING BIT:', beat);
            socket.emit('bits', { bits: [beat] });
        });
        // clearInterval(interval);
    }, INTERVAL_SPEED);
};
maestroInterval();

