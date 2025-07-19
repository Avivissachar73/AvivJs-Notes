'use strict';

import homePage from './modules/general/pages/home-page.cmp.js';
import aboutPage from './modules/general/pages/about-page.cmp.js';
import cvPage from './modules/general/pages/cv-page.cmp.js';

import notePage from './modules/notes/pages/note-page.cmp.js';
import noteEdit from './modules/notes/cmps/note-edit.cmp.js';

import dashboardPage from './modules/dashboard/pages/dashboard.cmp.js';
import gamesPage from './modules/games/games.cmp.js';

import sandBox from './modules/general/pages/sandBox.cmp.js';

export default [
    {
        path: '/',
        component: homePage
        // component: notePage,
        // children: [
        //     {
        //         path: '/edit/:id',
        //         component: noteEdit
        //     }
        // ]
    },
    {
        path: '/about',
        component: aboutPage
    },
    {
        path: '/cv',
        component: cvPage
    },
    {
        path: '/note',
        component: notePage,
        children: [
            {
                path: '/edit/:id',
                component: noteEdit
            }
        ]
    },
    {
        path: '/dashboard',
        component: dashboardPage
    },
    {
        path: '/games/:gameName',
        component: gamesPage
    },
    {
        path: '/sand-box',
        component: sandBox
    },
];