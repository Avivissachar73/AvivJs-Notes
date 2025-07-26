import { Utils } from './utils.service.js';
import { elementService } from './element.service.js';

class ElementComponent {
  // ___isElementCmpInstance___ = true;
  element = null;
  renderedChildren = [];
  // options = { showIf: () => Boolean, isTxt: Boolean, key: String  }
  constructor({ template = () => '', state = {}, attributes = {}, options = {}, children = [] }) {
    this.cmp = { template, state, attributes, options, children };
    this.init();
  }

  get show() {
    if (!this.cmp.options.showIf) return true;
    return this.cmp.options.showIf();
  }

  init = () => {
    // if (textElemet) return new ElementComponent(this.cmp, document.createTextNode(_template()), () => {}, true);
    if (this.cmp.options.isTxt) {
      this.element = document.createTextNode(this._template());
    } else {
      this.cmp = { ...this.cmp, children: [...(this.cmp.children || [])] };
      this.element = elementService.El(this._template(), this.cmp.attributes || this.cmp.events);
      if (this.cmp.state) Utils.watchOnObj(this.cmp.state, this.render);
      // for (let evName in this.cmp.events) this.element[evName] = this.cmp.events[evName];
      this.render();
    }
    return this;
  }

  render = () => {
    if (this.cmp.show) {
      if (!this.cmp.show()) return null;
    }
    // this.element.innerHTML = elementService.El(this._template()).innerHTML;
    if (this.cmp.options.isTxt) {
      this.element = document.createTextNode(this._template());
      return;
    }
    else {
      const newEl = elementService.El(this._template());
      this.element.innerHTML = newEl.innerHTML;
      for (let attr of newEl.attributes) this.element.setAttribute(attr.name, attr.value);
    }

    if (this.cmp.children) {
      let childrenToProcess = [];
      if (typeof this.cmp.children === 'function') childrenToProcess = this.cmp.children();
      else childrenToProcess = this.cmp.children;
      // if (this.element.innerHTML) this.element.innerHTML = textElemet ? this._template() : elementService.El(this._template()).innerHTML;
      childrenToProcess = childrenToProcess.filter(Boolean).map(c => {
        if (c?.options?.key) {
          c = this.renderedChildren.find(c => c.options.key) || c;
        }

        if (typeof c === 'function') {
          const childStr = c()
          this.element.innerHTML += childStr;
          return childStr;
        }
        else if (typeof c === 'string') {
          this.element.innerHTML += c;
          return c;
        }

        let childToAppend;
        if (c instanceof ElementComponent) {
          c.render?.();
          if (!c.show) return null;
          // if (c.cmp?.options.isTxt) {
          //   childToAppend = document.createTextNode(c._template());
          // }
          else childToAppend = c.element;
        } else {
          childToAppend = c instanceof Element ? c : c();
        }
        this.element.appendChild(childToAppend);
        return childToAppend;
      }).filter(Boolean);
      this.renderedChildren = childrenToProcess;
    }
  }

  _template() {
    return typeof this.cmp.template === 'function' ? this.cmp.template() : this.cmp.template;
  };

  create() {
    
  }
  destroy() {

  }
}

function createElementCmp(cmp = { state: {}, template: ('' || (() => '')), children: [], events: {}, textElemet: false, show: () => true }) { // createCmp
  return new ElementComponent(cmp);
}

function createCmp(template = '', state = {}, attributes = {}, options = { isTxt: false, showIf: false }, children = []) { // createCmp
  if ((arguments.length === 1) && (typeof arguments[0] === 'object')) {
    return new ElementComponent(arguments[0]);
  }
  return new ElementComponent({ template, state, attributes, options, children });
  
  // return = elementService.El(template, attributes, children);
}


// module.exports = {
const _elementComponentService = {
  ElementComponent,
  createElementCmp,
  createCmp
}

export default _elementComponentService;
export const elementComponentService = _elementComponentService;