// // compile it, in file folder:: tsc WavyAnimation.class.ts --target es2016 --module es6
export const WavyAnimation = (() => {
    type MatrixPos = { i: number, j: number };
    type AnimationPos = { x: number, y: number, z: number, lastUpdateInStep: number, depth: number, farness: number };
    type AnimationItem = { matPos: MatrixPos, animPos: AnimationPos, opts: { renderDot: Boolean } };
    type AnimationMat = AnimationItem[][];

    function getBasicAnimItem(matPos : MatrixPos) : AnimationItem {
        return {
            matPos,
            animPos: {
                x: matPos.j,
                y: matPos.j,
                z: 1,
                lastUpdateInStep: 0,
                depth: 0,
                farness: 0
            },
            opts: {
                renderDot: false
            }

        }
    }
    
    const WIDTH = 25 || 50;
    const HEIGHT = 18 || 37;
    const FPS = 80;
    return class WavyAnimation {
        CONFIG = {
            WIDTH: WIDTH,
            HEIGHT: HEIGHT,
            FPS,
            X_STEPS: WIDTH / 2, //  || 0.7
            Y_STEPS: HEIGHT / 2, //  || 0.8
            SPEED: 1000 / FPS,
            centerPos: {
                j: WIDTH / 2,
                i: HEIGHT / 2
            },
            framesPerStep: 12,
            renderDots: true,
            renderHiddenDots: false,
            renderConectiveLines: true,
            centerLinesToDotsBolder: true,
            renderBgLines: true,
            birthSteps: 10,
            CLRS: [
                [0, 255, 255, 0.8], // dot frame
                [0, 150, 255, 1], // dot center
                [130, 32, 255, 0.7], // bg lines // [255, 0, 0, 0.7] -> red
                [0, 150, 255, 1], // connective lines

                    // // `rgba(0, 0, 255, ${animItem.animPos.z * 0.8})`,
                    // // `rgba(0, 0, 255, ${animItem.animPos.z * 1})`,
                    // `rgba(${this.CONFIG.CLRS[0].join(', ')}, ${animItem.animPos.z * 0.8 * opacity})`,
                    // `rgba(${this.CONFIG.CLRS[1].join(', ')}, ${animItem.animPos.z * 1 * opacity})`,
                    // `rgba(${this.CONFIG.CLRS[2].join(', ')}, ${animItem.animPos.z * 0.7 * opacity})`,
            ],
            intervalMode: false,
            canvasContextMode: '2d' // || '2d' / 'webgl
        }
        parent : HTMLElement | string = '';
        parentEl : HTMLElement | null = null;
        canvasEl : HTMLCanvasElement | null = null;
        ctx : CanvasRenderingContext2D | WebGLRenderingContext | ImageBitmapRenderingContext | null = null;
        // canvasSize = { w: 0, h: 0 };
        state : { mat: AnimationMat, allItems: AnimationItem[], animationStep: number, intervalId: number | null } = {
            mat: [],
            allItems: [],
            animationStep: 0,
            intervalId: null
        }
        constructor(parent: HTMLElement | string = '') {
            this.parent = parent;
            this.parentEl = parent instanceof Element ? parent : document.querySelector(parent);
            this.init();
            this.setDotOnAnimationItem({ i: 15, j: 20 }, true);
            this.setDotOnAnimationItem({ i: 10, j: 22 }, true);
            this.setDotOnAnimationItem({ i: 15, j: 32 }, true);
            this.setDotOnAnimationItem({ i: 25, j: 20 }, true);
            this.setDotOnAnimationItem({ i: 22, j: 25 }, true);
        }
  
        init = () => {
            if (!this.parentEl) return;
            // this.parentEl.innerHTML = 'ANIMATION GOES HERE!';
            this.canvasEl = document.createElement('canvas');
            // this.canvasSize = { w: this.parentEl?.offsetWidth || 0, h: this.parentEl?.offsetHeight || 0 };
            this.canvasEl.width = this.canvasSize.w || 0;
            this.canvasEl.height = this.canvasSize.h || 0;
            if (['2d', 'webgl'].includes(this.CONFIG.canvasContextMode)) {
                this.ctx = this.canvasEl.getContext(this.CONFIG.canvasContextMode);
            }
            this.contextActions?.scale(this.canvasToDataSizeRatio.dpr, this.canvasToDataSizeRatio.dpr);
            this.parentEl.appendChild(this.canvasEl);
            this.state.mat = this.initAnimationData();
            this.state.allItems = this.state.mat.reduce((acc, c) => [...acc, ...c], []);
            this.play();
        }
    
        destroy = () => {
            this.pause();
            if (this.canvasEl) this.parentEl?.removeChild(this.canvasEl);
        }
  
  
        initAnimationData = () => {
            const mat : AnimationMat = [];
            for (let i = 0; i < this.CONFIG.HEIGHT; i++) {
                mat[i] = [];
                for (let j = 0; j < this.CONFIG.WIDTH; j++) {
                    const item : AnimationItem = {
                        ...getBasicAnimItem({ i, j }),
                        // matPos: { i, j },
                        // animPos: this.getItemRenderPosByInJ({ i, j }, true),
                        opts: { renderDot: this.CONFIG.renderDots || false }
                    }
                    item.animPos = this.getItemRenderPosByInJ(item, true)
                    mat[i].push(item);
                }
            }
            return mat;
        }


        get canvasSize() {
            // return { w: this.canvasEl?.width || 0, h: this.canvasEl?.height || 0 };
            return { w: this.parentEl?.offsetWidth || 0, h: this.parentEl?.offsetHeight || 0 };
        }

        get canvasToDataSizeRatio() {
            const dpr = window.devicePixelRatio || 1;
            // const dpr = 1;
            return {
                dpr,
                w: (this.canvasSize.w / dpr) / this.CONFIG.WIDTH,
                h: (this.canvasSize.h / dpr) / this.CONFIG.HEIGHT
            };
        }

        play = () => {
            // console.log(this.canvasToDataSizeRatio);
            const doIt = () => {
                if (!document.contains(this.parentEl)) return this.destroy();
                this.contextActions?.clearRect(0, 0, this.canvasEl?.width || 0, this.canvasEl?.height || 0);
                this.paint();
                // window.requestAnimationFrame(() => {
                // });
            }
            if (this.CONFIG.intervalMode) {
                this.state.intervalId = window.setInterval(() => {
                    this.state.animationStep++;
                    doIt();
                }, this.CONFIG.SPEED);
            } else {
                const doItForAnimation = (timeFromStart: number) => {
                    this.state.animationStep = timeFromStart / this.CONFIG.SPEED;
                    doIt();
                    this.state.intervalId = window.requestAnimationFrame(doItForAnimation);
                }
                this.state.intervalId = window.requestAnimationFrame(doItForAnimation);
            }
        }
        pause = () => {
            if (this.state.intervalId) {
                if (this.CONFIG.intervalMode) {
                    window.clearInterval(this.state.intervalId);
                } else {
                    window.cancelAnimationFrame(this.state.intervalId);
                }
                this.state.intervalId = null;
            }
        }

        getItemByInJ({ i, j } : MatrixPos) {
            return this.state.mat?.[i]?.[j];
        }


        setDotOnAnimationItem({ i, j } : MatrixPos, val = false) {
            const existItem = this.getItemByInJ({ i, j });
            if (!existItem) return;
            existItem.opts.renderDot = val;
        }


        getItemRenderPosByInJ(animItem : AnimationItem, forceCalc : boolean = false) : AnimationPos {
            const { i, j } = animItem.matPos;
            if (!forceCalc && this.state.mat) {
                // const existItem = this.getItemByInJ({ i, j });
                const existItem = animItem;
                if (existItem?.animPos.lastUpdateInStep === this.state.animationStep) return existItem.animPos;
            }
            let step = this.state.animationStep;
            const totalAnimSteps = {
                x: this.CONFIG.X_STEPS || this.CONFIG.WIDTH / 1,
                y: this.CONFIG.Y_STEPS || this.CONFIG.HEIGHT / 1,
            };
            step /= (this.CONFIG.framesPerStep);
            // step *= this.canvasToDataSizeRatio.dpr;
            const calcIt = (idx : number, totalSteps : number, totalSize : number, centerIdx: number) => {
                const modulustep = step % totalSteps;
                const fakeIdx = (idx + modulustep) % totalSteps;
                let idxZ = fakeIdx % totalSteps;
                if (!idxZ) idxZ = totalSteps;
                // idxZ += 1;
                const halfSteps = totalSteps / 2;
                // const halfSize = totalSize / 2; // centerIdx;
                let posDiff = ((idxZ) - halfSteps) / halfSteps;
                // console.log((idxZ / totalSteps), posDiff)
                if (idxZ <= halfSteps) idxZ = totalSteps - idxZ;
                const depth = (totalSteps - idxZ) / halfSteps;
                idxZ /= totalSteps;
                posDiff *= depth;
                const farnessFromEnd = idx / totalSize;
                // const farnesFronmCenter = Math.abs(1 - ((Math.abs(centerIdx - ((idx + 1)))) / centerIdx));
                
                let temp = (idx + 1);
                if (temp > centerIdx) temp -= ((temp - centerIdx) * 2);
                const farnesFronmCenter = temp / centerIdx;
                return { idxZ, farness: farnessFromEnd, farnesFronmCenter, depth, posDiff: posDiff*2 };
            }

            let xRes = calcIt(j, totalAnimSteps.x, this.CONFIG.WIDTH, this.CONFIG.centerPos.j);
            let yRes = calcIt(i, totalAnimSteps.y, this.CONFIG.HEIGHT, this.CONFIG.centerPos.i);

            // const messedXRes = calcIt(i, totalAnimSteps.x, this.CONFIG.WIDTH, this.CONFIG.centerPos.j);
            // const messedYRes = calcIt(j, totalAnimSteps.y, this.CONFIG.HEIGHT, this.CONFIG.centerPos.i);
            // [xRes, yRes] = [messedXRes, messedYRes];

            const xZ = xRes.idxZ;
            const yZ = yRes.idxZ;
            
            const depth = (xRes.depth + yRes.depth) / 2;
            
            const xDiff = i % 2 === 0 ? 0.75 : 0.25;
            let jPos = j + xRes.posDiff + xDiff;
            let iPos = i + yRes.posDiff;

            
            let fadeInOpacity = 1;
            if (step < (this.CONFIG.birthSteps * (1 || this.CONFIG.framesPerStep))) {
                const percentages = step / (this.CONFIG.birthSteps * (1 || this.CONFIG.framesPerStep));
                fadeInOpacity = percentages;
                // const center = {
                //     i: (this.CONFIG.HEIGHT / 2),
                //     j: (this.CONFIG.WIDTH / 2)
                // }
                // const center = this.CONFIG.centerPos
                // iPos = iPos + ((center.i - iPos) * (1 - percentages));
                // jPos = jPos + ((center.j - jPos) * (1 - percentages));
            }

            return {
                x: jPos,
                y: iPos,
                // x: j + messedXRes.posDiff,
                // y: i + messedYRes.posDiff,
                z: ((xZ + yZ) / 1.5) * fadeInOpacity,
                // depth: Math.min(xRes.depth, yRes.depth),
                depth: depth,
                // farness: (xRes.farness + yRes.farness) / 2,
                // farness: Math.min(xRes.farness, yRes.farness), // THIS GOOD
                // farness: xRes.farness, // THIS GOOD
                // farness: messedXRes.farness, // THIS GOOD
                // farness: (xRes.farnesFronmCenter + yRes.farnesFronmCenter) / 2 * fadeInOpacity, // THIS GOOD
                farness: Math.min(xRes.farnesFronmCenter, yRes.farnesFronmCenter) * fadeInOpacity, // THIS GOOD
                // farness: xRes.farnesFronmCenter,
                // farness: Math.min(xRes.farnesFronmCenter, yRes.farnesFronmCenter),
                // farness: 1 * fadeInOpacity, // THIS GOOD
                // xRes,
                // yRes,
                lastUpdateInStep: this.state.animationStep
            };
        }

        getRenderData(animItem : AnimationItem) {
            animItem.animPos = this.getItemRenderPosByInJ(animItem);
            const posToRender = {

                    // Original wavy === mess + xRes.farness;

                    // needs reg / mess
                    // x: (animItem.animPos.x * animItem.animPos.farness * animItem.animPos.depth) * this.canvasToDataSizeRatio.w,
                    // y: (animItem.animPos.y * animItem.animPos.farness * animItem.animPos.depth) * this.canvasToDataSizeRatio.h,
                    
                    // needs reg / mess
                    // x: (animItem.animPos.x * animItem.animPos.depth) * this.canvasToDataSizeRatio.w,
                    // y: (animItem.animPos.y * animItem.animPos.depth) * this.canvasToDataSizeRatio.h,
                
                    //  needs reg / mess
                    // x: (animItem.animPos.x * animItem.animPos.farness) * this.canvasToDataSizeRatio.w,
                    // y: (animItem.animPos.y * animItem.animPos.farness) * this.canvasToDataSizeRatio.h,
                    
                    // needs reg
                    // x: (animItem.animPos.x * animItem.animPos.xRes.farness) * this.canvasToDataSizeRatio.w,
                    // y: (animItem.animPos.y * animItem.animPos.yRes.farness) * this.canvasToDataSizeRatio.h,
                
                    //  needs reg
                    // x: (animItem.animPos.x * animItem.animPos.yRes.farness) * this.canvasToDataSizeRatio.w,
                    // y: (animItem.animPos.y * animItem.animPos.xRes.farness) * this.canvasToDataSizeRatio.h,
                    
                    // CORRECT:
                    x: (animItem.animPos.x) * this.canvasToDataSizeRatio.w,
                    y: (animItem.animPos.y) * this.canvasToDataSizeRatio.h,
                    w: this.canvasToDataSizeRatio.w * (animItem.animPos.depth * (animItem.animPos.farness)),
                    h: this.canvasToDataSizeRatio.h * (animItem.animPos.depth * (animItem.animPos.farness))
            }
            //   posToRender.x -= (this.canvasToDataSizeRatio.w/2);
            //   posToRender.y -= (this.canvasToDataSizeRatio.h/2);
            const smallerSize = Math.min(posToRender.w, posToRender.h);
            return {...posToRender, smallerSize}
        }



        paint = () => {
            const getClrs = (animItem: AnimationItem, opacity = 1) => {
                return this.CONFIG.CLRS.map(rgba => `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${(rgba[3] || 1) * animItem.animPos.z * opacity})`);
            }
            if (this.CONFIG.renderBgLines) this.state.allItems.forEach(animItem => {
                const boldMode = !this.CONFIG.renderDots && this.CONFIG.centerLinesToDotsBolder && animItem.opts.renderDot;
                const renderData = this.getRenderData(animItem);
                // if (!this.ctx) return;
                // if (animItem.animPos.farness < 0.5) return;
                const clrs = getClrs(animItem, boldMode ? 0.08 : 0.01);
                // connect to center
                const posToConnect = { x: this.CONFIG.centerPos.j * this.canvasToDataSizeRatio.w, y: this.CONFIG.centerPos.i * this.canvasToDataSizeRatio.h };
                // const posToConnect = { x: this.CONFIG.centerPos.j * this.canvasToDataSizeRatio.w, y: this.CONFIG.centerPos.i / 2 * this.canvasToDataSizeRatio.h };
                // const posToConnect = { x: 20 * this.canvasToDataSizeRatio.w, y: 39 * this.canvasToDataSizeRatio.h };
                const centerPosToRender = posToConnect;
                this.contextActions.setStrokeStyle(clrs[2]);
                this.contextActions.setLineWidth(renderData.smallerSize * (boldMode ? 0.2 : 1.5));
                this.contextActions.beginPath();
                this.contextActions.moveTo(renderData.x, renderData.y);
                this.contextActions.lineTo(centerPosToRender.x, centerPosToRender.y);
                this.contextActions.stroke();
                this.contextActions.closePath();
            });

            // rendering conective lines
            // if (this.CONFIG.renderConectiveLines) {
            //     if (this.ctx) this.ctx.beginPath();
            //     this.state.allItems.forEach(animItem => {
            //         // if (!this.CONFIG.renderConectiveLines && !animItem.opts.renderDot) return;
            //         //   console.log(animItem.animPos.z);
            //         const renderData = this.getRenderData(animItem);
            //         if (!this.ctx) return;
            //         const clrs = getClrs(animItem);
            //         // paint method here
            //     });
            //     if (this.ctx) {
            //         this.ctx.stroke();
            //         // this.ctx.fill();
            //         this.ctx.closePath();
            //     }
            // }
            
            this.state.allItems.forEach(animItem => {
                // if (!this.CONFIG.renderConectiveLines && !animItem.opts.renderDot) return;
                //   console.log(animItem.animPos.z);
                const renderData = this.getRenderData(animItem);
                // if (!this.ctx) return;
                const clrs = getClrs(animItem);


                // render lines
                const nextItemI = this.state.mat[animItem.matPos.i + 1]?.[animItem.matPos.j];
                const nextItemJ = this.state.mat[animItem.matPos.i]?.[animItem.matPos.j + 1];
                const prevItemInJ = this.state.mat[animItem.matPos.i - 1]?.[animItem.matPos.j - 1];
                const nextItemIMminJ = this.state.mat[animItem.matPos.i + 2]?.[animItem.matPos.j];
                const prevItemIMnextJ = this.state.mat[animItem.matPos.i - 1]?.[animItem.matPos.j + 1];
                
                const paintLineToItem = (nextItem : AnimationItem) => {
                    // if (!this.ctx) return;
                    if (!renderData.smallerSize) return;
                    const nextItemRenderData = this.getRenderData(nextItem);
                    this.contextActions.setStrokeStyle(clrs[3]);
                    // this.ctx.fillStyle = clrs[0];
                    this.contextActions.setLineWidth(renderData.smallerSize * 0.02);
                    // this.ctx.beginPath();
                    this.contextActions.moveTo(renderData.x, renderData.y);
                    this.contextActions.lineTo(nextItemRenderData.x, nextItemRenderData.y);
                    // this.ctx.stroke();
                    // this.ctx.closePath();
                }
                if (this.CONFIG.renderConectiveLines) {
                    this.contextActions.beginPath();
                    if (nextItemI) paintLineToItem(nextItemI);
                    if (nextItemJ) paintLineToItem(nextItemJ);
                    // if (nextItemIMminJ) paintLineToItem(nextItemIMminJ);
                    if (animItem.matPos.i % 2 === 0) {
                        if (prevItemIMnextJ) paintLineToItem(prevItemIMnextJ);
                    } else {
                        if (prevItemInJ) paintLineToItem(prevItemInJ);
                    }
                    this.contextActions.stroke();
                    // this.contextActions.fill();
                    this.contextActions.closePath();
                }
                


                if (!animItem.opts.renderDot && !this.CONFIG.renderHiddenDots) return;
                const baseSize = animItem.opts.renderDot ? 1 : 0.2;
                // rendering circle frame
                this.contextActions.setStrokeStyle(clrs[1]); // 2
                // this.ctx.fillStyle = clrs[0]; // 'blue'
                this.contextActions.beginPath();
                this.contextActions.arc(renderData.x, renderData.y, (renderData.smallerSize/2) * baseSize * 0.6, 0, Math.PI * 2, false);
                this.contextActions.setLineWidth(renderData.smallerSize * 0.2);
                this.contextActions.stroke();
                // this.contextActions.fill();
                this.contextActions.closePath();

                // Rendering circle
                // this.contextActions.setStrokeStyle(clrs[2]);
                this.contextActions.setFillStyle(clrs[0]); // 'blue'
                this.contextActions.beginPath();
                this.contextActions.arc(renderData.x, renderData.y, (renderData.smallerSize/2) * baseSize * 0.5, 0, Math.PI * 2, false);
                this.contextActions.fill();
                this.contextActions.closePath();
            });
        }

        
        get contextActions() {
            // if (this.ctx instanceof WebGLRenderingContext) {
            //     const gl = this.ctx as WebGLRenderingContext;
            //     if (!gl) return {};

            //     let glCurrentPos: [number, number] = [0, 0]; // מיקום נוכחי
            //     let vertices: number[] = []; // אגרגט של קואורדינטות לציור

            //     const createShaderProgram = (vertexSrc: string, fragmentSrc: string): WebGLProgram => {
            //         const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
            //         gl.shaderSource(vertShader, vertexSrc);
            //         gl.compileShader(vertShader);

            //         const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
            //         gl.shaderSource(fragShader, fragmentSrc);
            //         gl.compileShader(fragShader);

            //         const program = gl.createProgram()!;
            //         gl.attachShader(program, vertShader);
            //         gl.attachShader(program, fragShader);
            //         gl.linkProgram(program);
            //         return program;
            //     };

            //     const simpleProgram = createShaderProgram(
            //         `attribute vec2 a_position;
            //         uniform vec2 u_resolution;
            //         void main() {
            //             vec2 zeroToOne = a_position / u_resolution;
            //             vec2 zeroToTwo = zeroToOne * 2.0;
            //             vec2 clipSpace = zeroToTwo - 1.0;
            //             gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            //             gl_PointSize = 4.0;
            //         }`,
            //         `precision mediump float;
            //         uniform vec4 u_color;
            //         void main() { gl_FragColor = u_color; }`
            //     );

            //     gl.useProgram(simpleProgram);

            //     const positionBuffer = gl.createBuffer();
            //     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            //     const flush = () => {
            //         if (!vertices.length) return;
            //         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
            //         gl.drawArrays(gl.LINES, 0, vertices.length / 2);
            //         vertices = [];
            //     };

            //     return {
            //         scale: (w: number, h: number) => {
            //             gl.viewport(0, 0, this.canvasEl!.width * w, this.canvasEl!.height * h);
            //         },
            //         clearRect: (_x: number, _y: number, _w: number, _h: number) => {
            //             gl.clear(gl.COLOR_BUFFER_BIT);
            //         },
            //         setStrokeStyle: (val: string) => {
            //             const c = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]*)?\)/);
            //             if (c) {
            //                 gl.uniform4f(
            //                     gl.getUniformLocation(simpleProgram, "u_color"),
            //                     parseInt(c[1]) / 255,
            //                     parseInt(c[2]) / 255,
            //                     parseInt(c[3]) / 255,
            //                     c[4] ? parseFloat(c[4]) : 1
            //                 );
            //             }
            //         },
            //         setLineWidth: (_val: number) => {},
            //         setFillStyle: (_val: string) => {},
            //         beginPath: () => { vertices = []; },
            //         moveTo: (x: number, y: number) => { glCurrentPos = [x, y]; },
            //         lineTo: (x: number, y: number) => {
            //             vertices.push(glCurrentPos[0], glCurrentPos[1], x, y);
            //             glCurrentPos = [x, y];
            //         },
            //         stroke: () => { flush(); },
            //         fill: () => { flush(); },
            //         arc: (x: number, y: number, radius: number, start: number, end: number, _clockwise: boolean) => {
            //             const segments = 16;
            //             let lastPos = glCurrentPos;
            //             for (let i = 1; i <= segments; i++) {
            //                 const angle = start + (i / segments) * (end - start);
            //                 const nx = x + Math.cos(angle) * radius;
            //                 const ny = y + Math.sin(angle) * radius;
            //                 vertices.push(lastPos[0], lastPos[1], nx, ny);
            //                 lastPos = [nx, ny];
            //             }
            //             glCurrentPos = lastPos;
            //         },
            //         closePath: () => { flush(); }
            //     };
            // }


            // if (this.CONFIG.canvasContextMode === '2d') {
            if (this.ctx instanceof CanvasRenderingContext2D) {
                const ctx = this.ctx;
                return {
                    scale: (w, h) => {
                        ctx?.scale(w, h);
                    },
                    clearRect: (x, y, w, h) => {
                        ctx?.clearRect(x, y, w, h);
                    },
                    setStrokeStyle: (val) => {
                        ctx.strokeStyle = val;
                    },
                    setLineWidth: (val) => {
                        ctx.lineWidth = val;
                    },
                    setFillStyle: (val) => {
                        ctx.fillStyle = val;
                    },
                    beginPath: () => {
                        ctx?.beginPath();
                    },
                    moveTo: (x, y) => {
                        ctx?.moveTo(x, y);
                    },
                    lineTo: (x, y) => {
                        ctx?.lineTo(x, y);
                    },
                    stroke: () => {
                        ctx?.stroke();
                    },
                    fill: () => {
                        ctx?.fill();
                    },
                    arc: (x, y, radius, unknown, degries, unknown2) => {
                        ctx?.arc(x, y, radius, unknown, degries, unknown2);
                    },
                    closePath: () => {
                        ctx?.closePath();
                    }
                }
            }
            return {
                scale: (w, h) => {
                },
                clearRect: (x, y, w, h) => {
                },
                setStrokeStyle: (val) => {
                },
                setLineWidth: (val) => {
                },
                setFillStyle: (val) => {
                },
                beginPath: () => {
                },
                moveTo: (x, y) => {
                },
                lineTo: (x, y) => {
                },
                stroke: () => {
                },
                fill: () => {
                },
                arc: (x, y, radius, unknown, degries, unknown2) => {
                },
                closePath: () => {
                }
            }
        }
    }
})();