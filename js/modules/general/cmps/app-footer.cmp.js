'use strict';

export default class AppFooter {
    name = 'app-footer';
    template = `
        <footer class="app-footer flex-center">
            <h4 class="text-center flex wrap space-around">
                <p class="logo flex-center">Aviv<span>Js</span></p>
                © Aviv Issachar
            </h4>
            <a href="{{cvLink}}" target="_blank"><h3>- C.V -</h3></a>
        </footer>
    `;
    style = {
        gap: '10px'
    }
    state = {
        cvLink: 'https://docs.google.com/document/d/1chtvUmRJo38ZakzSWxqIyDgI6K1xi0eS/edit?usp=sharing&ouid=103323829961679615098&rtpof=true&sd=true'
    }
}