'use strict';


// import { elementService } from '../../../../lib/element.service.js';
// window.elementServiceModule = { elementService };
// import { Utils } from '../../../../lib/utils.service.js';
// window.utilsServiceModule = { Utils };
// import { elementComponentService } from '../../../../lib/ElementComponent.class.js';
// window.elementComponentModule = elementComponentService;


import { Tooltip } from '../../../../lib/frontComponents/common/Tooltip.cmp.js';
import { ClipTxt } from '../../../../lib/frontComponents/common/ClipTxt.cmp.js';
import { ToggleBtns } from '../../../../lib/frontComponents/common/ToggleBtns.cmp.js';


// const { StyleEl, _ } = window.elementServiceModule.elementService;
// const { Utils } = window.utilsServiceModule;
import { elementComponentService } from '../../../../lib/ElementComponent.class.js';
const { createCmp : ElCmp } = elementComponentService;


var nestedMicro = AvivJs.element({
    name: 'counter',
    template: `
        <div class="column-layout">
            <header>
                <h2>|COUNTER|</h2>
            </header>
            <main class="width-all flex align-cemter space-between">
                <button @click="update(-1)">-</button>
                {{count}}
                <button @click="update(1)">+</button>
            </main>
            <footer class="text-center">
                <h5>_microFrontend_</h5>
                <h6>nested_App</h6>
            </footer>
        </div>
    `,
    state: {
        count: 0
    },
    methods: {
        update(diff) {
            this.state.count += diff;
            // console.log('updated!!', this.count, diff, this.element);
        }
    },
});



import initCanvasAnimation from '../../../../coolThings/coolCanvasVideoAnimation/index.js';
import { TimerWithUi } from '../../../../lib/Timer.js';
import { SunSistem } from '../../../../coolThings/preatyLoaders/SunSistem.js';
import { AnimatedLoader } from '../../../../coolThings/preatyLoaders/AnimationLoader.js';
import { CanvasEditor } from '../../../../coolThings/CanvasPaiterEditor.js';
import { WavyAnimation } from '../../../../coolThings/WavyAnimation/WavyAnimation.class.js';
export default class SandBox {
    name = 'SandBox';
    state = {
        destroyers: [],
        // testTxtModel: ''
    }
    template = `
        <main class="SandBox app-main">
            <div class="container flex-center1 flex column align-center space-around gap30 main-pad-y">
                <h1 class="flex-center">{{$t('_sandBoxLocales.sandBox')}}</h1>
                <div class="flex column align-center gap30">
                    <hr class="width-all"/>
                    <div class="flex column align-center gap30">
                        <h2 class="flex-center">CanvasService</h2>
                        <div class="sun-sistem-container"></div>
                        <div class="animated-loader-container"></div>
                        <div class="canvas-animation-container width-all" style="aspect-ratio:125/100;width:300px;max-width:90vw"></div>
                    </div>
                    <div class="canvas-editor-section">
                        <hr class="width-all"/>
                        <h2 class="flex-center">Canvas Editor</h2>
                        <div class="canvas-editor-container"></div>
                    </div>
                    <div class="wavy-animation-section">
                        <hr class="width-all"/>
                        <h2 class="flex-center">Wavy Animation</h2>
                        <div class="wavy-animation-container" style="width:1000px;aspect-ratio:1/0.5;max-width:90vw"></div>
                    </div>
                    <hr class="width-all"/>
                    <NestedMicro/>
                    <hr class="width-all"/>
                    <div class="timer-container"></div>
                    <hr class="width-all"/>
                    <div class="flex column align-center gap30">
                        <h2 class="flex-center">ElementComponents</h2>
                        <div class="element-components"></div>
                    </div>
                    <hr class="width-all"/>
                </div>
            </div>
        </main>
    `;
    style = {
        '.canvas-editor-section': {
            // display: 'none'
        },
        '.wavy-animation-section': {
            display: 'none'
        }
    }
    methods = {
        init() {
            // document.querySelector('.app').innerText = 'Hello world!';
            // const cmp = ClipTxt({ txt: 'Hello world!', maxLength: 5 });
            // document.querySelector('.app').appendChild(cmp.element)
            const toggleBtnsState = { toggleBtnsVal: 2 }
            const el = ElCmp(`<div class="flex column align-center gap10"></div>`, {}, {}, {}, [
                ClipTxt({ txt: 'Hello world!', maxLength: 5 }),
                Tooltip({msg: 'This is some msg!'}),
                ElCmp({state: toggleBtnsState, template: `<div class="flex align-center gap10"></div>`, children: [
                    () => `<span>${toggleBtnsState.toggleBtnsVal}</span>`,
                    ToggleBtns({ value: toggleBtnsState.toggleBtnsVal, onChange: (val => toggleBtnsState.toggleBtnsVal = val), options: [ 1, 2, 3, 4 ] })
                ]})
            ]);
            document.querySelector('.element-components').appendChild(el.element);

            const animator = initCanvasAnimation('.canvas-animation-container');
            this.destroyers.push(animator.destroy.bind());

            const timer = new TimerWithUi('.timer-container');
            this.destroyers.push(timer.stop.bind(timer));

            const sunSistem = new SunSistem('.sun-sistem-container');
            this.destroyers.push(sunSistem.destroy.bind(sunSistem));
            
            const animLoader = new AnimatedLoader('.animated-loader-container');
            this.destroyers.push(animLoader.destroy.bind(animLoader));
            

            const canvasEditor = new CanvasEditor('.canvas-editor-container', {
                "bgc": "#ff6666",
                // bgImg: 'http://127.0.0.1:5501/js/modules/notes/sampleAssets/Spider-Man_Vol_1_1.webp',
                "w": 1000,
                "h": 1000,
                "textItems": [
                    {
                        "id": "ID-1E88-1998794DFB0-CA0",
                        "fontSize": 110,
                        "x": 950,
                        "y": 50,
                        zIndex: 1,
                        "text": "אדומת השיער\nהצרפתייה מהונגריה\nישבה עם חברות\nלבושה באדום\nלא היה לה מקום\nלא היה לה בן זוג\nעל ספסל מלוכלך\nללא יין מזוג",
                        "isCenterPos": false,
                        data: {
                            textItem: true,
                            systemItem: false,
                            bgc: '#ffffff'
                        },
                        "style": {
                            "fillStyle": "#000000",
                            "fontFamily": "Amatic_SC-local",
                            "textAlign": "end",
                            "textBaseline": "top",
                            "direction": "ltr"
                        }
                    },
                    {
                        "id": "ID-1D3A-19987950E47-AF2",
                        "fontSize": 100,
                        "x": 50,
                        "y": 900,
                        zIndex: 2,
                        "text": "אביב",
                        "isCenterPos": false,
                        "style": {
                            "fillStyle": "#000000",
                            "fontFamily": "Amatic_SC-local",
                            "textAlign": "start",
                            "textBaseline": "top",
                            "direction": "rtl"
                        }
                    }
                ]
            });
            window.canvasEditor = canvasEditor;
            // // this.destroyers.push(canvasEditor.destroy.bind(canvasEditor));

            // // compile it, in file folder:: tsc WavyAnimation.class.ts --target es2016 --module es6
            // const wavyAnimation = new WavyAnimation('.wavy-animation-container');
            // this.destroyers.push(wavyAnimation.destroy.bind(wavyAnimation));
        }
    }
    onMounted() {
        this.init();
    }
    onDestroyed() {
        this.destroyers.forEach(c => c());
    }
    components = {
        nestedMicro
    }
}



// <!-- <div>
//     <FormInput type="text" class="gap10" labelholder="test" A-model="testTxtModel"/>
//     <p>{{testTxtModel}}</p>
// </div> -->