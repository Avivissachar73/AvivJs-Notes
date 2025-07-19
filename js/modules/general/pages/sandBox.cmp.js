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

export default class SandBox {
    name = 'SandBox';
    template = `
        <main class="SandBox app-main container flex-center1 flex column align-center space-around">
            <h1 class="logo flex-center">SandBox</h1>
            <nestedMicro/>
            <div class="element-components"></div>
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
        }
    }
    onMounted() {
        this.init();
    }
    components = {
        nestedMicro
    }
}