import { AppFooter } from "./cmps/AppFooter.cmp.js";
import { AppHeader } from "./cmps/AppHeader.cmp.js";
import { AppMain } from "./cmps/AppMain.cmp.js";
import { createCmp } from "./lib/AmazingFramwork.js";

const APP_SELECTOR = '#app';

const RootCmp = createCmp({
  selector: APP_SELECTOR,
  template: `<section class="app"></section>`,
  children: [
    AppHeader,
    AppMain,
    AppFooter,
  ]
})

console.log('Hello world!');