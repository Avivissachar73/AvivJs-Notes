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
            </div>
        </main>
    `;
}