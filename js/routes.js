'use strict';

import homePage from './modules/general/pages/home-page.cmp.js';
import aboutPage from './modules/general/pages/about-page.cmp.js';
import notePage from './modules/notes/pages/note-page.cmp.js';

import noteEdit from './modules/notes/cmps/note-edit.cmp.js';

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
        path: '/note',
        component: notePage,
        children: [
            {
                path: '/edit/:id',
                component: noteEdit
            }
        ]
    }
];