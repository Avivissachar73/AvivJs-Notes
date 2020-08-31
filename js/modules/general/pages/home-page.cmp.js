'use strict';

var nestedMicro = new AvivJs().element({
    name: 'counter',
    template: `
        <div class="column-layout">
            <h1>COUNTER</h1>
            <p>
                <button @click="update(1)">+</button>
                {{count}}
                <button @click="update(-1)">-</button>
            </p>
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
    }
});

export default class HomePage {
    name = 'home-page';
    template = `
        <main class="home-page app-main container flex-center1 flex column align-center space-around">
            <h2><h1 class="logo flex-center">Aviv<span>Js</span></h1></h2>
            <nestedMicro/>
        </main>
    `;
    components = {
        nestedMicro
    }
}