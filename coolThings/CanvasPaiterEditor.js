import { CanvasService } from "../lib/canvasService/canvas.service.js";
import { elementService } from "../lib/element.service.js";
import { Utils } from "../lib/utils.service.js";


export class CanvasEditor {
  state = {
    bgc: '#ffffff',
    bgImg: '',
    w: 1000,
    h: 1500,
    textItems: [],

    opts: {
      fillStyle: '#000000',
      fontFamily: 'Arial',
      textAlign: 'end',
      // textBaseline: 'top',
      direction: 'ltr',
      bgc: '#ffffff',

      // fontSize ,

      // text;
      // x;
      // y;
      // bgcItem.style.fillStyle;
    },
    paintOpts: {
      clr: '#ff0000',
    }
  };
  constructor(parentSelector = 'body', initState = null) {
    if (initState) this.state = initState;
    this.initState = initState;
    this.parentSelector = parentSelector;
    this.parentEl = parentSelector instanceof Element ? parentSelector : document.querySelector(parentSelector);
    this.initCanvasEditor();
  }

  actionsState = {
    selectedItem: null,
    dragedItem: null,
    lastDragPos: null,
    paintModeOn: false,
    painting: false,
    currPaintingShape: null
  }

  get config() {
    const w = this.state.w;
    const h = this.state.h;
    return {
      w,
      h,
      defaultFontSize: w / 10,
      pad: {
        x: w/20,
        y: h/20
      }
    }
  }
  canvasService = null;
  
  initCanvasEditor() {
    const canvasEditorContainer = this.parentEl;
    // canvasEditorContainer.style.color = 'black';
    function inputCmp(className, elType, type, placeholder, opts) {
        return `<label class="flex column gap2">
            <span>${placeholder}</span>
            <${elType} class="${className}" type="${type}" placeholder="${placeholder}">
                ${opts?.map(opt => `<option value="${opt.value}" label="${opt.label}"></option>`).join('') || ''}
            </${elType}>
        </label>`;
    }
    canvasEditorContainer.innerHTML = `
        <div class="canvas-painter-editor flex column align-center gap10">
            ${ elementService.dataToCssElStr('.canvas-painter-editor', {
                '.canvas-editor': {
                    width: '500px',
                    'max-width': '90vw',
                    'aspect-ratio': '1/1',
                    // overflow: 'hidden',
                    canvas: {
                      border: '1px solid black',
                    }
                },
                'input, textarea, select, button': {
                    color: 'black',
                    'background-color': 'white'
                },
                'button': {
                    border: '1px solid black',
                    
                }
                
            }) }
            <div class="flex align-center gap5 wrap align-center justify-center">
                ${inputCmp('canvas-bg-bgc-field', 'input', 'color', 'bg')}
                ${inputCmp('canvas-clr-field', 'input', 'color', 'clr')}
                ${inputCmp('canvas-bgc-field', 'input', 'color', 'clr')}
                ${inputCmp('canvas-font-field', 'select', '', 'font', [
                    {value: 'Arimo-local', label: 'Arimo'},
                    {value: 'Heebo-local', label: 'Heebo'},
                    {value: 'Amatic_SC-local', label: 'Amatic_SC'},
                    {value: 'Arial', label: 'Arial'},
                    {value: 'Noto_Serif_Hebrew-local', label: 'Noto Serif He'},
                    {value: 'Noto Serif', label: 'Noto Serif'},
                    {value: 'Courier New', label: 'Courier New'}, // needs to get from local for heb
                ])}
                ${inputCmp('canvas-alignment-field', 'select', '', 'alignment', [
                    {value: 'center', label: 'center'},
                    {value: 'start', label: 'start'},
                    {value: 'end', label: 'end'},
                ])}
                ${inputCmp('canvas-direction-field', 'select', '', 'direction', [
                    {value: 'rtl', label: 'rtl'},
                    {value: 'ltr', label: 'ltr'},
                ])}
                ${inputCmp('canvas-font-size-field', 'input', 'number', 'font-size')}
                ${inputCmp('canvas-posx-field', 'input', 'number', 'pos-x')}
                ${inputCmp('canvas-posy-field', 'input', 'number', 'pos-y')}
                ${inputCmp('canvas-painter-clr-field', 'input', 'color', 'painter clr')}
                <!--
                    <input type="color" class="canvas-clr-field"/>
                    <input type="color" class="canvas-bg-bgc-field"/>
                    <select class="canvas-font-field" placeholder="font">
                        <option value="Arimo-local" label="Arimo"></option>
                        <option value="Heebo-local" label="Heebo"></option>
                        <option value="Amatic_SC-local" label="Amatic_SC"></option>
                        <option value="Arial" label="Arial"></option>
                        <option value="Noto Serif" label="Noto Serif"></option>
                    </select>
                    <select class="canvas-alignment-field" placeholder="alignment">
                        <option value="center" label="center"></option>
                        <option value="start" label="start"></option>
                        <option value="end" label="end"></option>
                    </select>
                    <select class="canvas-direction-field" placeholder="direction">
                        <option value="rtl" label="rtl"></option>
                        <option value="ltr" label="ltr"></option>
                    </select>
                    <input type="number" class="canvas-font-size-field"/>
                    <input type="number" class="canvas-posx-field"/>
                    <input type="number" class="canvas-posy-field"/>
                -->
                <button class="add-txt">Add txt</button>
                <button class="toggle-paint-mode-btn">Paint</button>
                <button class="print-btn">Download</button>
            </div>
            <!-- <textarea class="canvas-txt-field" name="" id=""></textarea> -->
            ${inputCmp('canvas-txt-field', 'textarea', '', 'Text')}
            <div class="canvas-editor"></div>
        </div>
    `;
    // const editorContainer = document.querySelector('.canvas-editor');
    // const w = this.config.w;
    // const txtConfig = {
    //   txt: '',
    //   font: 'Amatic_SC-local',
    //   fontSize: w/10,
    //   padX: w/10,
    //   padY: w/10,
    //   txtAlign: 'end',
    //   txtClr: '#000000',
    //   bgc: '#ffffff'
    // }
    // const padData = this.config.pad;
    const initItem = () => ({
      id: Utils.getRandomId(),
      // w: w/10,
      zIndex: this.state.textItems.length + 1,
      fontSize: this.config.defaultFontSize,
      x: this.config.w-this.config.pad.x,
      y: this.config.pad.y,
      text: '',
      isCenterPos: false,
      data: {
        textItem: true,
        systemItem: false,
        bgc: '#ffffff'
      },
      style: {
        fillStyle: this.state.opts.fillStyle,
        fontFamily: this.state.opts.fontFamily,
        textAlign: this.state.opts.textAlign,
        direction: this.state.opts.direction,
        textBaseline: 'top',

      }
    });
    const createTextBgItem = (txtItem) => ({
      ...txtItem,
      zIndex: txtItem.zIndex - 0.5 || 0,
      id: 'bg-' + txtItem.id,
      isCenterPos: false,
      hide: true,
      style: {fillStyle: txtItem.data?.bgc || '', strokeStyle: txtItem.style.fillStyle || '', lineWidth: 5},
      data: { systemItem: true },
      text: undefined,
      fontSize: undefined,
      ...CanvasService.getrenderAreaItemForTxtItem(txtItem)
    });
    let canvasTextItem = this.state?.textItems?.length ? this.state.textItems.filter(c => !c.systemItem)[0] : initItem();
    const bgcItem = { zIndex: -1, data: { systemItem: true }, id: 'bgcItem', w: this.config.w, h: this.config.h, x: 0, y: 0, img: this.state.bgImg || '', style: {fillStyle: this.state?.bgc || '#ffffff'}};
    this.state.bgc = bgcItem.style.fillStyle;
    let outlineItem = {data: { systemItem: true }, zIndex: 1000, id: 'outlineItem', hide: false, isCenterPos: false, style: {strokeStyle: '#000000', lineWidth: 0}};
    const textItems = this.state?.textItems?.length ? this.state.textItems : [canvasTextItem];
    this.state.textItems = [...textItems];
    this.actionsState.selectedItem = canvasTextItem;
    this.canvasItems = [
      bgcItem,
      { // grid item
        hide: true,
        x: 0, y: 0, w: this.config.w, h: this.config.h,
        grid: {
          space: this.config.w / 10,
          style: {
              strokeStyle: 'rgba(0, 0, 0, 0.2)',
              linePattern: [this.config.w/100, this.config.w/100],
              lineWidth: 2
          }
        }
      },
      outlineItem,
      ...this.state.textItems.reduce((acc, c) => {
        // [...acc, c]
        acc.push(c);
        if (c.data?.textItem) acc.push(createTextBgItem(c));
        return acc;
      }, [])
    ];
    // const getrenderAreaItemForTxtItem = (textItem) => {
    //   const _linesCount = textItem.text.split('\n').length;
    //   const areaItem = { x: textItem.x, y: textItem.y, h: textItem.fontSize*_linesCount, w: Math.max(...textItem.text.split('\n').map(_ => CanvasService.Utils.getTextPxSize(_, textItem.fontSize, textItem.style.fontFamily))) };
    //   if (textItem.style.textAlign === 'center') areaItem.x -= areaItem.w / 2;
    //   if (textItem.style.textAlign === 'end') areaItem.x -= areaItem.w;
    //   return areaItem;
    // }
    this.canvasService = new CanvasService({
      width: this.config.w,
      height: this.config.h,
      shapes: this.canvasItems,
      staticShapes: [],
    }, { selector: '.canvas-editor', enableZoom: false, enableZoomUi: false, enableScrollUi: false, bgc: '#ffffff',
      grid: { // not work here becouse of custom bg item, temp fix in shapes list
        space: 10,
        style: {
            strokeStyle: 'black',
            linePattern: [10, 10],
            lineWidth: 10,
            zIndex: 1
        }
      } 
    }, undefined, {
      ...(() => {
        // let this.actionsState.lastDragPos = null;
        // let this.actionsState.dragedItem = null;
        const updatePosByDiff = (pos) => {
          if (!this.actionsState.lastDragPos || !this.actionsState.dragedItem) return;
          // const newPos = Utils.getPosOnTargetElementFromMouseEvent(ev);
          const newPos = pos;
          const diff = {
            x: newPos.x - this.actionsState.lastDragPos.x,
            y: newPos.y - this.actionsState.lastDragPos.y
          }
          this.actionsState.dragedItem.x += diff.x;
          this.actionsState.dragedItem.y += diff.y;
          this.actionsState.lastDragPos = newPos;
          setFieldValues();
          updateIt();
        }
        const getMatchedItems = (items) => {
          return items.filter(c => c.data?.textItem).sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
        }
        const onMousedown = (ev, pos, items) => {
          ev?.preventDefault?.();
          if (this.actionsState.paintModeOn) {
            this.actionsState.painting = true;
            return;
          }
          // const item = items.filter(c => !c.data?.systemItem)[0];
          const item = getMatchedItems(items)[0];
          if (!item) {
            outlineItem.hide = true;
            return;
          }

          if (!this.actionsState.selectedItem?.id !== item.id) {
            this.actionsState.selectedItem = item;
            outlineItem.hide = false;
            setFieldValues();
          }

          // this.actionsState.selectedItem = item;
          updateIt();
          // this.actionsState.lastDragPos = Utils.getPosOnTargetElementFromMouseEvent(ev);
          this.actionsState.dragedItem = this.actionsState.selectedItem;
          this.actionsState.lastDragPos = pos;
        }
        const onMouseup = (ev, pos) => {
          ev?.preventDefault?.();
          if (this.actionsState.paintModeOn) {
            this.actionsState.painting = false;
            this.actionsState.currPaintingShape = this.actionsState.selectedItem = null;
            return;
          }
          updatePosByDiff(pos);
          this.actionsState.lastDragPos = this.actionsState.dragedItem = this.actionsState.currPaintingShape = null;
        }
        const onMouseMove = (ev, pos, hoveredItems) => {
          ev?.preventDefault?.();
          if (this.actionsState.paintModeOn) {
            if (!this.actionsState.painting) return;
            if (!this.actionsState.currPaintingShape) {
              this.actionsState.currPaintingShape = { geoShape: [], zIndex: this.state.textItems.length + 1, data: {  }, style: { strokeStyle: this.state.paintOpts.clr, lineWidth: 8 }, id: Utils.getRandomId() };
              this.state.textItems.push(this.actionsState);
              this.actionsState.selectedItem = null;
              this.canvasItems.push(this.actionsState.currPaintingShape);
              updateIt();
            }
            this.actionsState.currPaintingShape.geoShape.push(pos);
            this.canvasService.updateCell(undefined, this.actionsState.currPaintingShape);
            return;
          }
          // const hoveredItem = hoveredItems.filter(c => c.id !== 'bgcItem')[0];
          const hoveredItem = getMatchedItems(hoveredItems)[0];
          if (hoveredItem) {
            this.canvasService.elCanvas.style.cursor = 'pointer';
          } else {
            this.canvasService.elCanvas.style.cursor = '';
          }
          updatePosByDiff(pos);
          updateIt();
        }
        return {
          click: (ev, pos, clickedItems) => {
            if (this.actionsState.paintModeOn) return;
            // const clickedItem = clickedItems.filter(c => c.id !== 'bgcItem')[0];
            // const clickedItem = clickedItems.filter(c => !c.data?.systemItem)[0];
            const clickedItem = getMatchedItems(clickedItems)[0];
            if (clickedItem) {
              this.actionsState.selectedItem = clickedItem;
              outlineItem.hide = false;
              setFieldValues();
            } else {
              this.actionsState.selectedItem = null;
              outlineItem.hide = true;
            }
            this.actionsState.lastDragPos = this.actionsState.dragedItem = this.actionsState.currPaintingShape = null;
            updateIt();
          },
          mousedown: onMousedown,
          mousemove: onMouseMove,
          mouseup: onMouseup,
          touchstart: onMousedown,
          touchmove: onMouseMove,
          touchend: onMouseup,
          mouseleave: () => {
            this.actionsState.lastDragPos = this.actionsState.dragedItem = this.actionsState.currPaintingShape = null;
            this.actionsState.painting = false;
          },
          mouseenter: () => {
            this.actionsState.lastDragPos = this.actionsState.dragedItem = this.actionsState.currPaintingShape = null;
            this.actionsState.painting = false;
          },
        }
      })()
    });
    this.state.textItems.forEach(t => {
      this.canvasService.updateCell(undefined, t);
    });
    const updateIt = () => {
      // canvasTextItem = { id: 'textItem', w: txtConfig.fontSize, x: w-txtConfig.padX, y: txtConfig.padY, text: txtConfig.txt, style: {fillStyle: txtConfig.txtClr, fontFamily: txtConfig.font, textAlign: txtConfig.txtAlign, textBaseline: 'end'}};
      // bgcItem = { id: 'bgcItem', w: w, h: w, x: 0, y: 0, style: {fillStyle: txtConfig.bgc}};
      outlineItem = {...outlineItem, ...(this.actionsState.selectedItem ? CanvasService.getrenderAreaItemForTxtItem(this.actionsState.selectedItem) : { hide: true })};
      // this.actionsState.selectedItem = { ...this.actionsState.selectedItem, w: outlineItem.w, h: outlineItem.h, x: outlineItem.x, y: outlineItem.y };
      this.canvasService.updateCell(undefined, bgcItem);
      this.canvasService.updateCell(undefined, outlineItem);
      if (!this.actionsState.selectedItem) return;
      this.canvasService.updateCell(undefined, this.actionsState.selectedItem);
      const selectedBgIdx = this.canvasItems.findIndex(c => c.id === `bg-${this.actionsState.selectedItem?.id}`);
      if (selectedBgIdx !== -1) {
        this.canvasItems[selectedBgIdx] = {
          ...this.canvasItems[selectedBgIdx],
          ...CanvasService.getrenderAreaItemForTxtItem(this.actionsState.selectedItem)
        }
        this.canvasService.updateCell(undefined, this.canvasItems[selectedBgIdx]);
      }
    }
    const setFieldValues = () => {
      const selectedItem = this.actionsState.selectedItem;
      const opts = this.state.opts;
      if (!selectedItem) return;
      canvasEditorContainer.querySelector('.canvas-txt-field').value = selectedItem.text;
      canvasEditorContainer.querySelector('.canvas-posx-field').value = selectedItem.x;
      canvasEditorContainer.querySelector('.canvas-posy-field').value = selectedItem.y;
      canvasEditorContainer.querySelector('.canvas-font-size-field').value = selectedItem.fontSize;
      canvasEditorContainer.querySelector('.canvas-clr-field').value = opts.fillStyle;
      canvasEditorContainer.querySelector('.canvas-bgc-field').value = opts.bgc;
      canvasEditorContainer.querySelector('.canvas-font-field').value = opts.fontFamily;
      canvasEditorContainer.querySelector('.canvas-alignment-field').value = opts.textAlign;
      canvasEditorContainer.querySelector('.canvas-direction-field').value = opts.direction;

      canvasEditorContainer.querySelector('.canvas-bg-bgc-field').value = bgcItem.style.fillStyle;

      // canvasEditorContainer.querySelector('.canvas-txt-field')?.focus();
      canvasEditorContainer.querySelector('.canvas-painter-clr-field').value = this.state.paintOpts.clr;
    }
    canvasEditorContainer.querySelector('.canvas-txt-field').oninput = (ev) => {
      this.actionsState.selectedItem.text = ev.target.value.trim();
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-clr-field').oninput = (ev) => {
      if (!this.actionsState.selectedItem) return;
      this.state.opts.fillStyle = ev.target.value;
      if (!this.actionsState.paintModeOn) this.actionsState.selectedItem.style.fillStyle = this.state.opts.fillStyle;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-bgc-field').oninput = (ev) => {
      this.state.opts.bgc = this.actionsState.selectedItem.data.bgc = ev.target.value;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-bg-bgc-field').oninput = (ev) => {
      bgcItem.style.fillStyle = ev.target.value;
      this.state.bgc = bgcItem.style.fillStyle;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-font-size-field').oninput = (ev) => {
      this.state.opts.fontSize = this.actionsState.selectedItem.fontSize = +ev.target.value;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-font-field').oninput = (ev) => {
      this.state.opts.fontFamily = this.actionsState.selectedItem.style.fontFamily = ev.target.value;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-posx-field').oninput = (ev) => {
      // padData.x = +ev.target.value;
      // this.actionsState.selectedItem.x = w-padData.x;
      this.actionsState.selectedItem.x = +ev.target.value;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-posy-field').oninput = (ev) => {
      // padData.y = +ev.target.value
      // this.actionsState.selectedItem.y = padData.y;
      this.actionsState.selectedItem.y = +ev.target.value;;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-alignment-field').oninput = (ev) => {
      const prev = this.actionsState.selectedItem.style.textAlign;
      this.state.opts.textAlign = this.actionsState.selectedItem.style.textAlign = ev.target.value;
      if (this.actionsState.selectedItem.style.textAlign === 'center') this.actionsState.selectedItem.x = this.config.w / 2;
      if (this.actionsState.selectedItem.style.textAlign === 'end') this.actionsState.selectedItem.x = this.config.w - this.config.pad.x;
      if (this.actionsState.selectedItem.style.textAlign === 'start') this.actionsState.selectedItem.x = this.config.pad.x;
      updateIt();
    }
    canvasEditorContainer.querySelector('.add-txt').oninput = (ev) => {
      this.state.opts.textAlign = this.actionsState.selectedItem.style.textAlign = ev.target.value;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-direction-field').oninput = (ev) => {
      this.state.opts.direction = this.actionsState.selectedItem.style.direction = ev.target.value;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-painter-clr-field').oninput = (ev) => {
      this.state.paintOpts.clr = ev.target.value;
      if (this.actionsState.paintModeOn) this.actionsState.selectedItem.style.strokeStyle = this.state.paintOpts.clr;
      updateIt();
    }

    canvasEditorContainer.querySelector('.print-btn').onclick = () => {
      const isUsingFrame = !outlineItem.hide;
      if (isUsingFrame) {
        outlineItem.hide = true;
        updateIt();
      }
      this.canvasService.downloadImg();
      if (isUsingFrame) {
        outlineItem.hide = false;
        updateIt();
      }
    };
    canvasEditorContainer.querySelector('.add-txt').onclick = () => {
      this.actionsState.selectedItem = initItem();
      this.state.textItems.push(this.actionsState.selectedItem);

      this.canvasItems.push(this.actionsState.selectedItem);
      this.canvasItems.push(createTextBgItem(this.actionsState.selectedItem));

      setFieldValues();
      updateIt();
    };
    canvasEditorContainer.querySelector('.toggle-paint-mode-btn').onclick = () => {
      this.actionsState.dragedItem = this.actionsState.lastDragPos = null;
      this.actionsState.paintModeOn = !this.actionsState.paintModeOn;
      canvasEditorContainer.querySelector('.toggle-paint-mode-btn').innerText = this.actionsState.paintModeOn ? 'stop Paint' : 'Paint'
      this.canvasService.elCanvas.style.cursor = this.actionsState.paintModeOn ? 'help' : '';
      this.actionsState.selectedItem = null;
      updateIt();
    };
    if (this.actionsState.selectedItem) {
      setFieldValues();
      updateIt();
    }
  }
}