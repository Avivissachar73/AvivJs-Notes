import { CanvasService, MathService } from '../../lib/canvasService/canvas.service.js';
import { Utils } from '../../lib/utils.service.js';
const { getRandomColor, getRandomId, getRandomInt } = Utils;
export class SunSistem {
  destroyCanvas = null;
  animationInterval = null;
  constructor(selector = '.sun-sistem-container') {
    this.selector = selector;
    this.init();
  }
  init() {
    const showcircles = false;
    const showAttachedLines = false;
    const rootSpeed = .6;
    const canvasSize = 3550;
    const prevSteps = 0;
    const creatStarCircleItem = (name, r, speed = 1, width = 10, color, attachedTo) => {
      const circle = { r, x: canvasSize/2, y: canvasSize/2 };
      const deg = 270 + speed*prevSteps;
      return { name, circle, speed: speed*rootSpeed, width, deg, attachedTo, id: getRandomId(), ...MathService.posOnCircleByDeg(circle), color: color || getRandomColor() }
    }
    const stars = [
      creatStarCircleItem('earth', 650, 1, 100, 'blue'),
      creatStarCircleItem('moon', 150, 3, 50, 'white', 'earth'),
      creatStarCircleItem('marse', 350, 3, 150, 'red'),
      creatStarCircleItem('jupiter', 950, 2, 150, 'green'),
      creatStarCircleItem('jupiter', 1200, 0.5, 200, 'grey'),
      creatStarCircleItem('venus', 1645, 0.2, 260, 'brown'),
    ];
    const sun = { name: 'sun', circle: { r:0, x: canvasSize/2, y: canvasSize/2 }, x: canvasSize/2, y: canvasSize/2, circleDegries: 360, w: 300, h: 300, isCenterPos: true, style: { fillStyle: 'yellow' } };
    const board = {
        width: canvasSize,
        height: canvasSize,
        shapes: stars,
        staticShapes: [sun]
    }
    const canvasService = new CanvasService(board, { selector:  this.selector, enableAnimation: true }, (star, drawOpts, context, service) => {
        const attachedStar = star.attachedTo? stars.find(c => c.name === star.attachedTo) : sun;
        const currPos = { x: star.x, y: star.y };
        const res = [
            {
              ...currPos,
              circleDegries: 360, w: star.width, h: star.width, isCenterPos: true, style: { fillStyle: star.color }
            },
        ];
        if (showcircles) res.push({ 
          x: attachedStar.x,
          y: attachedStar.y,
          zIndex: -1,
          w: star.circle.r*2, h: star.circle.r*2, isCenterPos: true, circleDegries: 360, style: { strokeStyle: 'black' }
        });
        if (showAttachedLines) res.push({
          ...currPos,
          zIndex: -1,
          geoShape: [
            { x: 0, y: 0 },
            { x: attachedStar.x - currPos.x, y: attachedStar.y - currPos.y }
          ],
          style: {
            strokeStyle: 'black',
            lineCap: 'round'
          }
        })
        return res;
    });
    this.destroyCanvas = () => canvasService.removeWindowEventListeners();
    this.animationInterval = setInterval(() => {
      stars.forEach(c => {
        const attachedStar = c.attachedTo? stars.find(curr => curr.name === c.attachedTo) : sun;
        const attacheedPos = attachedStar.circle ? MathService.posOnCircleByDeg(attachedStar.circle, attachedStar.deg) : { x: attachedStar.x, y: attachedStar.y };
        c.deg += c.speed;
        const newPos = MathService.posOnCircleByDeg({ ...attacheedPos, r: c.circle.r}, c.deg);
        c.x = newPos.x;
        c.y = newPos.y;
      });
      canvasService.updateCells(stars);
    }, 50);
  }
  destroy() {
    this.destroyCanvas?.();
    clearInterval(this.animationInterval);

  }
}