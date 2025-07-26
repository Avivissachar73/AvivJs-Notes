'use strict';

export default class AppHeader {
    name = 'app-header';
    template = `
        <header class="app-header">
            <nav class="container height-all flex align-center space-between wrap">
                <RouterLink url="/"><h1 class="logo flex-center">Aviv<span>Js</span></h1></RouterLink>
                <button class="nav-btn" @click="toggleNav"><img src="assets/img/navBurger.png"/></button>
                <div ref="screen" class="screen {{navClass}}" @click="toggleNav"/>
                <ul ref="nav" @click="toggleNav" class="app-nav {{navClass}} clean-list flex align-center space-between wrap gap20">
                    <li>
                        <RouterLink className="flex-center" url="/note">{{$t('_noteLocales.notes', 'notes')}}</RouterLink> 
                    </li>
                    <li>
                        <RouterLink className="flex-center" url="/games">{{$t('_gameLocales.games')}}</RouterLink>
                    </li>
                    <li>
                        <RouterLink className="flex-center" url="/dashboard">{{$t('_dashboardLocales.dashboard')}}</RouterLink>
                    </li>
                    <li>
                        <RouterLink className="flex-center" url="/sand-box">{{$t('_sandBoxLocales.sandBox')}}</RouterLink>
                    </li>
                    <li>
                        <RouterLink className="flex-center" url="/about">{{$t('_aboutLocales.about')}}</RouterLink>
                    </li>
                    <li>
                        <RouterLink className="flex-center" url="{{ { name: 'settingsPage' } }}">{{$t('_settingsLocales.settings')}}</RouterLink>
                    </li>
                    <li A-if="false">
                        <RouterLink className="flex-center" url="/cv">{{$t('_cvLocales.cv')}}</RouterLink>
                    </li>
                </ul>
            </nav>
        </header>
    `;
    style = {
        '.app-nav': {
            // color: 'white',
            // color: 'var(--clr-3)',
            '.active': {
                color: 'black'
                // color: 'var(--clr-2)'
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