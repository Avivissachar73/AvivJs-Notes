'use strict';

export default class AppHeader {
    name = 'app-header';
    template = `
        <header class="app-header">
            <nav class="container height-all flex align-center space-between wrap">
                <RouterLink url="/"><h1 class="logo flex-center">Aviv<span>Js</span></h1></RouterLink>
                <button class="nav-btn" @click="toggleNav"><img src="img/navBurger.png"/></button>
                <div ref="screen" class="screen {{navClass}}" @click="toggleNav"/>
                <ul ref="nav" @click="toggleNav" class="app-nav {{navClass}} clean-list flex align-center space-between wrap">
                    <li>
                        <RouterLink className="flex-center" url="/">Notes</RouterLink> 
                    </li>
                    <li>
                        <RouterLink className="flex-center" url="/about">About</RouterLink>
                    </li>
                </ul>
            </nav>
        </header>
    `;
    state = {
        isNavOpen: false
    }
    computed = {
        navClass() {
            return this.isNavOpen? '' : 'hide';
        }
    }
    methods = {
        toggleNav() {
            // this.state.isNavOpen = !this.state.isNavOpen;
            for (let curr of Object.values(this.context.refs)) curr.classList.toggle('hide');
        }
    }
}