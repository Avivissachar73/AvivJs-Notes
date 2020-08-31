'use strict';

import _routes from './routes.js';
import _store from './store.js';

import './modules/general/globalCmps.js';

import AppHeader from './modules/general/cmps/app-header.cmp.js';
import AppFooter from './modules/general/cmps/app-footer.cmp.js';

const App = new AvivJs();
App.RootCmp('#App', class {
    name = 'root-cmp';
    store = _store;
    routes = _routes
    template = `
        <div>
            <AppHeader/>
            <RouterView/>
            <AppFooter/>
        </div>
    `;
    components = {
        AppHeader,
        AppFooter
    }
});