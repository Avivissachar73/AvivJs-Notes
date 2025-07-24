// import { CanvasService } from './canvasService/index.js';
import { CanvasService } from '../../lib/canvasService/canvas.service.js';
// import { CanvasService } from '../last_warking_ver.js';
import sites from './mockMaestro/site.js';
import { socket } from './mockMaestro/socket.js';
// import './mockMaestro/index.js';
import { startMaestroInterval, stopMaestroInterval } from './mockMaestro/index.js';


export default function init(selector = '.canvas-container') {
    function findItemByPos(pos) {
        // const items = [...canvasService.board.shapes, ...canvasService.board.staticShapes];
        const items = [...canvasService.board.shapes];
        // .filter(a => a._id === 'orange_shit')
        // .filter(a => a._id === 'orange_shit')
        return items.find(item => {
            // if (item.geoShape) 
            return CanvasService.isPosOnItem(pos, spaceShipData(item), item._id === 'green1');
            // return CanvasService.isPosOnItem(pos, item, item._id === 'green1');
            // return (
            //     pos.x >= item.x-item.w && pos.y >= pos.y-item.h &&
            //     pos.x <= item.x+item.w && pos.y <= pos.y+item.h 
            // )
        });
    }
    let selectedItemCode = null;
    const site = sites.mainSite;
    const board = {
        width: site.width,
        height: site.height,
        // width: site.height,
        // height: site.width,
        shapes: [
            // {
            //     x: 100,
            //     y: 100,
            //     w: 100,
            //     h: 100,
            //     // isCenterPos: true,
            //     style: {
            //         color: 'pink'
            //     }
            // }
        ],
        staticShapes: [
            ...site.polygons,
            ...site.passages,
            { zIndex: 1, x: 60, y: 230, h: 100, w: 100, text: '🦊', style: {fillStyle: 'black', textAlign: 'center', textBaseline: 'middle'}},
            {
                geoShape: [
                    { x: 340, y: 460 },
                    { x: 340, y: 340 },
                    { x: 460, y: 340 },
                    { x: 460, y: 460 },
                ],
                style: { fillStyle: 'red' }
            },
            { 
                _id: 'orange_shit',
                x: 500,
                y: 500,
                rotate: 300,
                geoShape: [
                    { x: -30, y: -60 },
                    { x: 30, y: -60 },
                    { x: 60, y: -30 },
                    { x: 60, y: 30 },
                    { x: 30, y: 60 },
                    { x: -30, y: 60 },
                    { x: -60, y: 30 },
                    { x: -60, y: -30 },
                ],
                // rotate: 90,
                style: { fillStyle: 'orange' }
            },
            // flipItem(someRect, {width: site.width, height: site.height}, 4, true),
            {
                name: 'wow',
                geoShape: [
                    { x: 0, y: 0 },
                    { x: 1250, y: 1000 },
                ],
                style: { strokeStyle: 'white' }
            },
            {
                geoShape: [
                    { x: 1250, y: 0 },
                    { x: 0, y: 1000 },
                ],
                style: { strokeStyle: 'white' }
            },
            // {
            //     x: 200,
            //     y: 200,
            //     w: 300,
            //     h: 300,
            //     style: { fillStyle: 'pink' },
            //     grid: {
            //         x: {
            //             space: 50,
            //             rotate: 45,
            //         },
            //         y: {
            //             space: 50,
            //             rotate: -45,
            //         },
            //         style: {
            //             strokeStyle: 'black',
            //             // linePattern: [10, 10]
            //         }
            //     }
            // }
        ]
    };
    // const elCanvas = document.createElement('canvas');
    // elCanvas.width = 1250;
    // elCanvas.height = 1000;
    // document.body.appendChild(elCanvas);
    // context: elCanvas.getContext('2d')
    const canvasService = new CanvasService(
        board,
        {
            selector: selector,
            bgc: 'grey',
            enableZoom: true,
            enableScrollUi: true,
            enableZoomUi: true,
            enableAnimation: true,
            enableFlipUi: true,
            enableMirrorUi: true,
            flipLevel: 1,
            grid: {
                space: 50,
                style: {
                    strokeStyle: 'black',
                    linePattern: [10, 10]
                }
                // x: {
                    // space: 50,
                    // rotate: 45,
                    // style: {
                    //     strokeStyle: 'black',
                    //     linePattern: [10, 10]
                    // }
                // },
                // y: {
                //     space: 50,
                //     rotate: -45,
                //     style: {
                //         strokeStyle: 'black',
                //         linePattern: [10, 10]
                //     }
                // }
            }
        },
        (cell, drawOpts, context, service) => {
            // if (cell.id) return cell;
            const res = spaceShipData(cell);
            if (cell.code === selectedItemCode) {

            }
            return res;
        },
        {
            click(ev, pos) {
                // console.log(pos);
                const evPos = { x: ev.offsetX, y: ev.offsetY };
                console.log(evPos);
                const item = findItemByPos(pos);
                if (item) console.log(item);
            },
            render() {
                // console.log('rendered!');
            },
            mousemove(ev, pos) {
                const item = findItemByPos(pos);
                if (item) {
                    selectedItemCode = item.code;
                    canvasService.elCanvas.style.cursor = 'pointer';
                } else {
                    selectedItemCode = null;
                    canvasService.elCanvas.style.cursor = 'default';
                }
            }
        }
    );
    // canvasService.isMirrorMod = true;
    socket.on('bits', ({bits}) => {
        canvasService.updateCells(bits.map(bit => {
            return {
                x: bit.pos.x,
                y: bit.pos.y,
                w: 30,
                h: 30,
                rotate: bit.rotate,
                code: bit.code,
                isCenterPos: true
            };
        }), (idx) => (cell) => cell.code === bits[idx].code);
    });
    startMaestroInterval()
    return {canvasService, destroy: () => {
        canvasService.removeWindowEventListeners();
        stopMaestroInterval();
    }}
    // window.CS = canvasService;
}
// window.onload = init;


function spaceShipData(cell) {
    return {
        ...cell,
        children: [
            {
                w: cell.w, h: cell.h,
                img: 'images/space_ship.png', isCenterPos: true
            },
            {
                geoShape: [ // light lamb
                    { x: -5, y: -20 },
                    { x: 5, y: -20 },
                    { x: 20, y: -10 },
                    { x: 20, y: 10 },
                    { x: 40, y: -100 },
                    { x: -40, y: -100 },
                    { x: -20, y: 10 },
                    { x: -20, y: -10 },
                ],
                isCenterPos: true,
                style: {
                    gradientBgc: {
                        colors: [
                            { offset: 0, val: 'rgba(255,255,255,1)' },
                            { offset: 1, val: 'rgba(255,255,255,0)' },
                        ],
                        angle: -90,
                        autoCalcGeoShapeSize: true
                    }
                }
            },
            // {
            //     strictX: 200,
            //     strictY: 200,
            //     strictW: 150,
            //     strictH: 100,
            //     strictR: 45,
            //     style: {
            //         strokeStyle: 'black',
            //         linePattern: [10, 10]
            //     }
            // }
        ]
    }
}