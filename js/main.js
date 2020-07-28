'use strict';

import routes from './routes.js';
// window.Routes = routes;
import _store from './store.js';

import './modules/general/globalCmps.js';

import AppHeader from './modules/general/cmps/app-header.cmp.js';
import AppFooter from './modules/general/cmps/app-footer.cmp.js';

const App = new AvivJs();
App.RootComponent('#App', class {
    name = 'root-cmp';
    store = _store;
    template = `
        <div>
            <AppHeader/>
            <RouterView/>
            <AppFooter/>
        </div>
    `;
    components = {
        RouterView: App.RouterCmp(routes),
        AppHeader,
        AppFooter
    }
});