'use strict';

import _routes from './routes.js';
import _store from './store.js';

import './modules/general/globalCmps.js';

import AppHeader from './modules/general/cmps/app-header.cmp.js';
import AppFooter from './modules/general/cmps/app-footer.cmp.js';

import messages from '../locales/index.js'
import { baseCssService } from '../lib/getBaseCss.function.js';
import { uiPreferenceService } from '../lib/uiPreferensesService.js';
import { appThemes } from '../lib/themes/index.js';
import { dynamicCssPagesService } from '../lib/dynamicCssPages.service.js';

const App = new AvivJs();
App.RootCmp('#App', class {
    name = 'root-cmp';
    store = _store;
    routes = _routes;
    i18nData = { locale: 'en', messages };
    template = `
        <div class="app {{isRtl ? 'rtl' : ''}}">
            <AppHeader/>
            <RouterView/>
            <AppFooter/>
        </div>
    `;
    getters = {
        isRtl: () => ['he', 'heF'].includes(this.i18n.locale)
    }
    onCreated() {
        if (!document.head.querySelector('.base-style-el')) {
            const baseStyleEl = baseCssService.getBaseCssAndHelpersWrapped(true);
            baseStyleEl.classList.add('base-style-el');
            document.head.prepend(baseStyleEl);
        }
        this.setupUiPreferences();
    }
    methods = {
        setupUiPreferences() {
            const uiPreferences = uiPreferenceService.loadUiPreferences();
            this.i18n.setLocale(uiPreferences.locale);
            
            dynamicCssPagesService.setDynamicStylingThemeEl(appThemes[0] || appThemes[0], '.app', 16);
        }
    }
    components = {
        AppHeader,
        AppFooter
    }
});
// App.RootCmp('#App', {
//     name: 'root-cmp',
//     store: _store,
//     routes: _routes,
//     template: `
//         <div>
//             <AppHeader/>
//             <RouterView/>
//             <AppFooter/>
//         </div>
//     `,
//     components: {
//         AppHeader,
//         AppFooter
//     }
// });