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
export default class SandBox {
    name = 'SandBox';
    state = {
        destroyers: []
    }
    template = `
        <main class="SandBox app-main container flex-center1 flex column align-center space-around gap30">
            <h1 class="logo flex-center">SandBox</h1>
            <div class="flex column align-center gap30">
                <hr class="width-all"/>
                <div class="flex column align-center gap30">
                    <h2 class="logo flex-center">CanvasService</h2>
                    <div class="sun-sistem-container"></div>
                    <div class="animated-loader-container"></div>
                    <div class="canvas-animation-container width-all" style="aspect-ratio:125/100;width:300px;max-width:90vw"></div>
                </div>
                <hr class="width-all"/>
                <nestedMicro/>
                <hr class="width-all"/>
                <div class="timer-container"></div>
                <hr class="width-all"/>
                <div class="element-components"></div>
                <hr class="width-all"/>
            </div>
        </main>
    `;
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
            console.log(el);
            document.querySelector('.element-components').appendChild(el.element);

            const animator = initCanvasAnimation('.canvas-animation-container');
            this.destroyers.push(animator.destroy.bind());

            const timer = new TimerWithUi('.timer-container');
            this.destroyers.push(timer.stop.bind(timer));

            const sunSistem = new SunSistem('.sun-sistem-container');
            this.destroyers.push(sunSistem.destroy.bind(sunSistem));
            
            const animLoader = new AnimatedLoader('.animated-loader-container');
            this.destroyers.push(animLoader.destroy.bind(animLoader));
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