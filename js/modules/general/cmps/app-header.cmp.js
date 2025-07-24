'use strict';

export default class AppHeader {
    name = 'app-header';
    template = `
        <header class="app-header">
            <nav class="container height-all flex align-center space-between wrap">
                <RouterLink url="/"><h1 class="logo flex-center">Aviv<span>Js</span></h1></RouterLink>
                <button class="nav-btn" @click="toggleNav"><img src="assets/img/navBurger.png"/></button>
                <div ref="screen" class="screen {{navClass}}" @click="toggleNav"/>
                <ul ref="nav" @click="toggleNav" class="app-nav {{navClass}} clean-list flex align-center space-between wrap">
                    <li>
                        <RouterLink className="flex-center" url="/note">Notes</RouterLink> 
                    </li>
                    <li>
                        <RouterLink className="flex-center" url="/games">Games</RouterLink>
                    </li>
                    <li>
                        <RouterLink className="flex-center" url="/dashboard">Dashboard</RouterLink>
                    </li>
                    <li>
                        <RouterLink className="flex-center" url="/sand-box">SandBox</RouterLink>
                    </li>
                    <li>
                        <RouterLink className="flex-center" url="/about">About</RouterLink>
                    </li>
                    <li A-if="false">
                        <RouterLink className="flex-center" url="/cv">C.V</RouterLink>
                    </li>
                </ul>
            </nav>
        </header>
    `;
    style = {
        '.app-nav': {
            '.active': {
                color: 'black'
            } 

        }
    };
    state = {
        isNavOpen: false
    }
    getters = {
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