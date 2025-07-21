import { El, watchOnObj } from "./utils.js";

var RootCmp = {
  selector: '',
  template: ''
}

export function createCmp(cmp = {template: '', selector: '', children: [], events: {}}) {
  cmp = { ...cmp, children: [...(cmp.children || [])] };

  if (cmp.selector) {
    RootCmp = { ...cmp }
  }

  const element = El(cmp.template);

  if (cmp.children) {
    cmp.children = cmp.children.map(c => c instanceof Element ? c : c());
    cmp.children.forEach(child => element.appendChild(child));
  }

  for (let evName in cmp.events) element[evName] = cmp.events[evName];

  
  if (cmp.selector) {
    const parentEl = document.querySelector(cmp.selector);
    parentEl.innerHTML = '';
    parentEl.appendChild(element);
  }

  return element;
  // console.log('Creatinmg Compomnent!');
}

export function render() {
  createCmp(RootCmp);
  // console.log('~RENDERING!!~');
}

export function createState(state) {
  watchOnObj(state, render);
  return state;
}