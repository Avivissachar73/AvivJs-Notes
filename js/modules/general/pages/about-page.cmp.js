'use strict';

export default class AboutPage {
    name = 'about-page';
    template = `
        <main class="app-main container flex column align-center space-around">
            <h2>ABOUT</h2>
            <div class="space-children-y">
                <p class="text-center">
                    This app is written in AvivJs - a frameWork all developped and written by me, Aviv Issachar.
                </p>
                <p class="text-center">
                    Mostly inspired by VueJs.
                </p>
                <p class="text-center">
                    Including advanced fitchers such as routes, uniqe template language, reactive data and more..
                </p>
            </div>
            <p class="text-center">
                All games where written by me and the charts in the dashboard page are also written in Charts library of my own.
            </p>
        </main>
    `;
}