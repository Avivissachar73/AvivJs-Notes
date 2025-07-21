const { Utils } = require('../utils.service');

class ElementComponent {
  // ___isElementCmpInstance___ = true;
  element = null;
  constructor(cmp) {
    this.cmp = cmp;
    this.init();
  }

  init = () => {
    // if (textElemet) return new ElementComponent(this.cmp, document.createTextNode(_template()), () => {}, true);
    this.cmp = { ...this.cmp, children: [...(this.cmp.children || [])] };
    this.element = El(this._template);
    if (this.cmp.state) Utils.watchOnObj(this.cmp.state, this.render);
    for (let evName in this.cmp.events) this.element[evName] = this.cmp.events[evName];
    this.render();
    return this;
  }

  render = () => {
    if (this.cmp.children?.length) {
      // if (this.element.innerHTML) this.element.innerHTML = textElemet ? this._template : El(this._template).innerHTML;
      if (this.element.innerHTML) this.element.innerHTML = El(this._template).innerHTML;
      this.cmp.children.filter(Boolean).forEach(c => {
        // if (c?.textElemet) {
        //   childToAppend = document.createTextNode()
        // }
        let childToAppend;
        if (c instanceof ElementComponent) {
          c.render?.();
          childToAppend = c.element;
        } else {
          childToAppend = c instanceof Element ? c : c();
        }
        this.element.appendChild(childToAppend);
      });
    }
  }

  get _template() {return typeof this.cmp.template === 'function' ? this.cmp.template() : this.cmp.template};

  create() {
    
  }
  destroy() {

  }
}

function createElementCmp(cmp = { state: {}, template: ('' || (() => '')), children: [], events: {}, textElemet: false }) { // createCmp
  return new ElementComponent(cmp);
}



module.exports = {
  ElementComponent,
  createElementCmp,
}