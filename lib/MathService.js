const _MathService = {
    degToRadian: deg => deg*(Math.PI/180),
    // degToRadian: deg => deg/180*Math.PI, // Math.PI is half circle;
    radianToDeg: radian => Math.atan(radian) * 180 / Math.PI,
    slope: ({x: x1, y: y1}, {x: x2, y: y2}, byY = true) => {
        if ((byY && (x1 === x2)) || (!byY && (y1 === y2))) return null;
        return byY? 
            (y1 - y2) / (x1 - x2) : 
            (x1 - x2) / (y1 - y2) ;
    },
    incline: (pos1, pos2, forEachX = true) => {
        const x1 = pos1.x;
        const y1 = pos1.y;
        const x2 = pos2.x;
        const y2 = pos2.y;

        let slope = slope(pos1, pos2);
        if (y1 === y2) slope = 0;
        else if (x1 === x2) slope = (y1 > y2) ? -1 : 1;

        let y = slope;
        let x = !y ? (1 * x1 > x2 ? -1 : 1) : 0;

        if (x1 !== x2 && y1 !== y2) {
            if (y1 < y2 && y < 0 || y1 > y2 && y > 0) y *= -1;
            x = (x1 > x2) ? -1 : 1;
        }

        if (!forEachX) {
            x *= -1;
            y *= -1;
            if (y > 1) {
                x /= y;
                y = 1;
            }
        }

        return { x, y };
    },
    getPolygonSize(polygon = []) {
        const sizeReducer = (key, isMin) => {
            return (acc, pos) => {
                const val = pos[key];
                if (acc === null) return val;
                if ((isMin && val < acc) ||
                    (!isMin && val > acc)) return val;
                return acc;
            }
        }
        // const maxY = geoShape.reduce((acc, c) => acc !== null? acc < c.y && c.y || acc : c.y, null);
        const maxY = polygon.reduce(sizeReducer('y', false), null);
        const maxX = polygon.reduce(sizeReducer('x', false), null);
        const minY = polygon.reduce(sizeReducer('y', true ), null);
        const minX = polygon.reduce(sizeReducer('x', true ), null);
        return {
            maxX,
            maxY,
            minX,
            minY,
            w: Math.abs(minX) + Math.abs(maxX),
            h: Math.abs(minY) + Math.abs(maxY)
        };
    },
    posOnYAxis (pos1, pos2) {
        if (pos1.x === pos2.x) {
            if (pos1.x !== 0) return null;
            return 0;
        }
        const m = this.slope(pos1, pos2);
        const x = pos1.y - m * pos1.x;
        return x;
        // return { y: 0, x };
    },
    getIntersectPos(line1, line2) { // line === [{x: 0, y: 0}, {x: 0, y: 0}]
        line1.sort(sortLine);
        line2.sort(sortLine);
        // if (JSON.stringify(line1[0]) === JSON.stringify(line2[0])) return line1[0]; 
        // if (JSON.stringify(line1[1]) === JSON.stringify(line2[1])) return line1[1]; 
        
        const posOnYAx1 = this.posOnYAxis(...line1);
        const posOnYAx2 = this.posOnYAxis(...line2);
        
        // if ([posOnYAx1, posOnYAx2].includes(null)) return null;
        // if (posOnYAx1 === posOnYAx2) return { x: 0, y: posOnYAx1 };
        if (posOnYAx1 === posOnYAx2) {
            if ([posOnYAx1, posOnYAx2].includes(null)) return null;
            return { x: 0, y: posOnYAx1 };
            // return null;
        }
        
        const slope1 = this.slope(...line1);
        const slope2 = this.slope(...line2);
        if (slope1 === slope2) return null;

        // if ([slope1, slope2].includes(null)) return null;
        if (slope1 === null) return { y: line2[0].y, x: slope2*line2[0].y + posOnYAx2 };
        if (slope2 === null) return { y: line1[0].y, x: slope1*line1[0].y + posOnYAx1 };

        const x = (slope1 * line1[0].x + posOnYAx1 - posOnYAx2) / slope2;
        const y = slope1 * x + posOnYAx1;

        return { x, y };
    },
    isIntersect(line1, line2) {   // from web, try to rewrite
        const l1x1 = line1[0].x;  // a
        const l1y1 = line1[0].y;  // b
        const l1x2 = line1[1].x;  // c
        const l1y2 = line1[1].y;  // d
        const l2x1 = line2[0].x;  // p
        const l2y1 = line2[0].y;  // q
        const l2x2 = line2[1].x;  // r
        const l2y2 = line2[1].y;  // s
        const det = (l1x2 - l1x1) * (l2y2 - l2y1) - (l2x2 - l2x1) * (l1y2 - l1y1);
        if (det === 0) return false;
        const lambda = ((l2y2 - l2y1) * (l2x2 - l1x1) + (l2x1 - l2x2) * (l2y2 - l1y1)) / det;
        const gamma = ((l1y1 - l1y2) * (l2x2 - l1x1) + (l1x2 - l1x1) * (l2y2 - l1y1)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    },
    pythagoras(w, h) {
        return Math.sqrt(w**2 + h**2);
    },
    distBetweenPoss(a, b) {
        const w = Math.abs(a.x - b.x);
        const h = Math.abs(a.y - b.y);
        return this.pythagoras(w, h);
    },
    isPosOnLine(pos, line) {
        const dist = this.distBetweenPoss.bind(this);
        const [a, b] = line;
        return dist(pos, a) + dist(pos, b) === dist(a, b);
    },
    isPosOnPoligon(pos = {x: 0, y: 0}, polygon = [], rotate = 0, acordingToPos, autoCloseShape = true, edgeOnly = false) {
        const sortLine = (a,b) => a.x-b.x;
        if (rotate) polygon = polygon.map(c => this.rotatePosition(c, rotate));
        if (acordingToPos) polygon = polygon.map(c => ({ x: c.x+acordingToPos.x, y: c.y+acordingToPos.y }));
        const { maxX, maxY, minX, minY } = this.getPolygonSize(polygon);
        if (pos.x < minX || pos.x > maxX || pos.y < minY || pos.y > maxY) return false;
        const testLine = [pos, { x: maxX+1, y: pos.y }].sort(sortLine);
        let intersectPossCount = 0;
        for (let i = 0; i < polygon.length; i++) {
            if (!autoCloseShape && !polygon[i+1]) break;
            const currPolLine = [polygon[i], polygon[i+1] || polygon[0]].sort(sortLine);
            if (edgeOnly) {
                if (this.isPosOnLine(pos, currPolLine)) return true;
                continue;
            }
            if (JSON.stringify(currPolLine[0]) === JSON.stringify(currPolLine[1])) continue;
            const intersectPos = this.isIntersect(testLine, currPolLine);
            if (intersectPos) intersectPossCount++;
        }
        if (edgeOnly) return false;
        return (intersectPossCount % 2 === 0)? false : true; 
    },
    rotatePosition(pos = { x: 0, y: 0 }, deg = 0, acordingToPos = { x: 0, y: 0 }) {
        const x = pos.x - acordingToPos.x;
        const y = pos.y - acordingToPos.y;
        const rad = this.degToRadian(deg);
        return {
            y: (x*Math.sin(rad) + y*Math.cos(rad)) + acordingToPos.y,
            x: (x*Math.cos(rad) - y*Math.sin(rad)) + acordingToPos.x
        }
    },
    posByPosDegAndDist(pos, deg, dist) {
        // deg += 90;
        return {
            x: pos.x + (dist * Math.cos(this.degToRadian(deg))),
            y: pos.y + (dist * Math.sin(this.degToRadian(deg)))
        }
    },
    isPosInEllipse(pos = { x: 0, y: 0 }, ellipse = { w: 0, y: 0, x: 0, h: 0, rotate: 0, circleDegries: [] }, acordingToPos) {
        pos = this.rotatePosition(pos, -ellipse.rotate || 0, ellipse);
        // TODO;
        /**
         */
        const testRects = [];
        const circleDegs = ellipse.circleDegries;
        const rectsCount = Math.ceil(Math.abs(circleDegs[1] - circleDegs[0]) / 90);
        for (let i = 0; i < rectsCount; i++) {
            const startDeg = circleDegs[0] + 90*i;
            let endDeg = startDeg + 90;
            if (endDeg > circleDegs[1]) {
                endDeg = circleDegs[1];
            }
            const biggerSize = Math.max(ellipse.w, ellipse.h)/2;
            const ellipsePos = { x: ellipse.x, y: ellipse.y };
            const secPos = this.posByPosDegAndDist(ellipsePos, startDeg, biggerSize);
            const testRect = [
                ellipsePos,
                secPos,
                this.posByPosDegAndDist(secPos, endDeg, biggerSize),
                this.posByPosDegAndDist(ellipsePos, endDeg, biggerSize),
            ];
            testRects.push(testRect);
            if (endDeg >= circleDegs[1]) break;
        }
        const isIntesectRect =  testRects.some(c => this.isPosOnPoligon(pos, c, undefined));
        const rX = ellipse.w/2;
        const rY = ellipse.h/2;
        const isIntersectEllipse = (((pos.x-ellipse.x)**2)/(rX**2)) + (((pos.y-ellipse.y)**2)/(rY**2)) <= 1;
        return isIntesectRect && isIntersectEllipse;
    },
    rectToPolygon(rect, acordingToPos = { x: 0, y: 0 }, debug) {
        const { w, h, x, y, isCenterPos } = rect;
        let xStart = x - acordingToPos.x;
        let xEnd = x+w - acordingToPos.x;
        let yStart = y - acordingToPos.y;
        let yEnd = y+h - acordingToPos.y;
        if (isCenterPos) {
            xStart -= (w/2);
            xEnd -= (w/2);
            yStart -= (h/2);
            yEnd -= (h/2);
        }
        return [
            { x: xStart, y: yStart },
            { x: xEnd, y: yStart },
            { x: xEnd, y: yEnd },
            { x: xStart, y: yEnd },
        ];
    },
    // isPosInRect(pos, rect) {
    //     const { w, h, x, y, isCenterPos } = rect;
    //     let xStart = x
    //     let xEnd = x+w;
    //     let yStart = y
    //     let yEnd = y+h;
    //     if (isCenterPos) {
    //         xStart -= w/2;
    //         xEnd -= w/2;
    //         yStart -= h/2;
    //         yEnd -= h/2;
    //     }
    //     return pos.x >= xStart && pox.x <= xEnd &&
    //            pos.y >= yStart && pos.y <= yEnd;
    // },
    fitParentSize(containerSize, elementSize) {
        const biggerElementSizeProp = elementSize.w > elementSize.h ? 'w' : 'h';
        const smallerElementSizeProp = biggerElementSizeProp === 'w' ? 'h' : 'w';
        const elementRatio = elementSize[smallerElementSizeProp] / elementSize[biggerElementSizeProp];

        const isContainerWide = elementSize.w > elementSize.h;
        const isElementRatioSmallerThanContainer = elementSize.w / elementSize.h < containerSize.w / containerSize.h;
        
        let convertedSize;
        if (containerSize.w > containerSize.h) {
            if (isElementRatioSmallerThanContainer) convertedSize = {
                h: containerSize.h,
                w: (isContainerWide) ? containerSize.h / elementRatio : containerSize.h * elementRatio
            }
            else convertedSize = {
                w: containerSize.w,
                h: (isContainerWide) ? containerSize.w * elementRatio : containerSize.w / elementRatio
            }
        } else {
            if (isElementRatioSmallerThanContainer) convertedSize = {
                h: containerSize.h,
                w: (isContainerWide) ? containerSize.h / elementRatio : containerSize.h * elementRatio
            }
            else convertedSize = {
                w: containerSize.w,
                h: (isContainerWide) ? containerSize.w * elementRatio : containerSize.w / elementRatio
            }
        }
        return convertedSize;
    },
    getFullPosByPosAndDeg(pos = { x: 0, y: 0 }, posToFill = { x: 0,y: 0 }, deg = 360) {
        const rad = this.degToRadian(deg);
        // const rad = deg;
        const axis = posToFill.x === null ? 'x' : 'y';
        if (axis === 'x') {
            // (pos.y-posToFill.y) / (pos.x-posToFill.x) = rad;
            // (pos.y-posToFill.y) = rad * (pos.x-posToFill.x);
            // (pos.y-posToFill.y) / rad = (pos.x-posToFill.x);
            // ((pos.y-posToFill.y) / rad) - pos.x = (-posToFill.x);
            // -(((pos.y-posToFill.y) / rad) - pos.x) = posToFill.x;
            // return -(((pos.y-posToFill.y) / rad) - pos.x);
            posToFill.x = -(((pos.y-posToFill.y) / rad) - pos.x);
        } else if (axis === 'y') {
            // (pos.y-posToFill.y) / (pos.x-posToFill.x) = rad;
            // (pos.y-posToFill.y) = rad * (pos.x-posToFill.x);
            // (-posToFill.y) = (rad * (pos.x-posToFill.x)) - pos.y;
            // (posToFill.y) = -((rad * (pos.x-posToFill.x)) - pos.y);
            posToFill.y = -((rad * (pos.x-posToFill.x)) - pos.y);
            
        }
        return posToFill;
    }
}

export const MathService = _MathService;