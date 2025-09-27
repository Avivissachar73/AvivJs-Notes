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
  };
  constructor(parentSelector = 'body', initState = null) {
    if (initState) this.state = initState;
    this.initState = initState;
    this.parentSelector = parentSelector;
    this.parentEl = parentSelector instanceof Element ? parentSelector : document.querySelector(parentSelector);
    this.initCanvasEditor();
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
                <button class="print-btn">Download</button>
            </div>
            <!-- <textarea class="canvas-txt-field" name="" id=""></textarea> -->
            ${inputCmp('canvas-txt-field', 'textarea', '', 'Text')}
            <div class="canvas-editor"></div>
        </div>
    `;
    // const editorContainer = document.querySelector('.canvas-editor');
    const w = this.config.w;
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
        bgc: 'white'
      },
      style: {
        fillStyle: '#000000',
        fontFamily: 'Arial',
        textAlign: 'end',
        textBaseline: 'top',
        direction: 'ltr'
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
    let selectedItem = canvasTextItem;
    this.canvasItems = [
      bgcItem,
      outlineItem,
      ...this.state.textItems.reduce((acc, c) => [...acc, c, createTextBgItem(c)], [])
    ];
    console.log(this.canvasItems);
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
      shapes: [],
      staticShapes: [],
    }, { selector: '.canvas-editor', enableZoom: false, enableZoomUi: false, enableScrollUi: false, bgc: 'white' }, undefined, {
      ...(() => {
        let lastPos = null;
        let dragedItem = null;
        const updatePosByDiff = (pos) => {
          if (!lastPos || !dragedItem) return;
          // const newPos = Utils.getPosOnTargetElementFromMouseEvent(ev);
          const newPos = pos;
          const diff = {
            x: newPos.x - lastPos.x,
            y: newPos.y - lastPos.y
          }
          dragedItem.x += diff.x;
          dragedItem.y += diff.y;
          lastPos = newPos;
          setFieldValues();
          updateIt();
        }
        const onMousedown = (ev, pos, items) => {
          const item = items.filter(c => !c.data?.systemItem)[0];
          if (!item) {
            outlineItem.hide = true;
            return;
          }

          if (!selectedItem?.id !== item.id) {
            selectedItem = item;
            outlineItem.hide = false;
            setFieldValues();
          }

          // selectedItem = item;
          updateIt();
          // lastPos = Utils.getPosOnTargetElementFromMouseEvent(ev);
          dragedItem = selectedItem;
          lastPos = pos;
        }
        const onMouseup = (ev, pos) => {
          updatePosByDiff(pos);
          lastPos = dragedItem = null;
        }
        const onMouseMove = (ev, pos, hoveredItems) => {
          const hoveredItem = hoveredItems.filter(c => c.id !== 'bgcItem')[0];
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
            // const clickedItem = clickedItems.filter(c => c.id !== 'bgcItem')[0];
            const clickedItem = clickedItems.filter(c => !c.data?.systemItem)[0];
            if (clickedItem) {
              selectedItem = clickedItem;
              outlineItem.hide = false;
              setFieldValues();
            } else {
              outlineItem.hide = true;
            }
            lastPos = dragedItem = null;
            updateIt();
          },
          mousedown: onMousedown,
          mousemove: onMouseMove,
          mouseup: onMouseup,
          touchstart: onMousedown,
          touchmove: onMouseMove,
          touchend: onMouseup,
          mouseleave() {
            lastPos = dragedItem = null;
          },
          mouseenter() {
            lastPos = dragedItem = null;
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
      outlineItem = {...outlineItem, ...CanvasService.getrenderAreaItemForTxtItem(selectedItem)};
      // selectedItem = { ...selectedItem, w: outlineItem.w, h: outlineItem.h, x: outlineItem.x, y: outlineItem.y };
      this.canvasService.updateCell(undefined, bgcItem);
      this.canvasService.updateCell(undefined, selectedItem);
      this.canvasService.updateCell(undefined, outlineItem);
      const selectedBgIdx = this.canvasItems.findIndex(c => c.id === `bg-${selectedItem?.id}`);
      if (selectedBgIdx !== -1) {
        this.canvasItems[selectedBgIdx] = {
          ...this.canvasItems[selectedBgIdx],
          ...CanvasService.getrenderAreaItemForTxtItem(selectedItem)
        }
        this.canvasService.updateCell(undefined, this.canvasItems[selectedBgIdx]);
      }
    }
    function setFieldValues() {
      canvasEditorContainer.querySelector('.canvas-txt-field').value = selectedItem.text;
      canvasEditorContainer.querySelector('.canvas-clr-field').value = selectedItem.style.fillStyle;
      canvasEditorContainer.querySelector('.canvas-bgc-field').value = selectedItem.bgc;
      canvasEditorContainer.querySelector('.canvas-bg-bgc-field').value = bgcItem.style.fillStyle;
      canvasEditorContainer.querySelector('.canvas-font-size-field').value = selectedItem.fontSize;
      canvasEditorContainer.querySelector('.canvas-font-field').value = selectedItem.style.fontFamily;
      canvasEditorContainer.querySelector('.canvas-posx-field').value = selectedItem.x;
      canvasEditorContainer.querySelector('.canvas-posy-field').value = selectedItem.y;
      canvasEditorContainer.querySelector('.canvas-alignment-field').value = selectedItem.style.textAlign;
      canvasEditorContainer.querySelector('.canvas-direction-field').value = selectedItem.style.direction;
      // canvasEditorContainer.querySelector('.canvas-txt-field')?.focus();
    }
    canvasEditorContainer.querySelector('.canvas-txt-field').oninput = (ev) => {
      selectedItem.text = ev.target.value.trim();
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-clr-field').oninput = (ev) => {
      selectedItem.style.fillStyle = ev.target.value;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-bgc-field').oninput = (ev) => {
      selectedItem.bgc = ev.target.value;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-bg-bgc-field').oninput = (ev) => {
      bgcItem.style.fillStyle = ev.target.value;
      this.state.bgc = bgcItem.style.fillStyle;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-font-size-field').oninput = (ev) => {
      selectedItem.fontSize = +ev.target.value;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-font-field').oninput = (ev) => {
      selectedItem.style.fontFamily = ev.target.value;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-posx-field').oninput = (ev) => {
      // padData.x = +ev.target.value;
      // selectedItem.x = w-padData.x;
      selectedItem.x = +ev.target.value;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-posy-field').oninput = (ev) => {
      // padData.y = +ev.target.value
      // selectedItem.y = padData.y;
      selectedItem.y = +ev.target.value;;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-alignment-field').oninput = (ev) => {
      const prev = selectedItem.style.textAlign;
      selectedItem.style.textAlign = ev.target.value;
      if (selectedItem.style.textAlign === 'center') selectedItem.x = this.config.w / 2;
      if (selectedItem.style.textAlign === 'end') selectedItem.x = this.config.w-this.config.pad.x;
      if (selectedItem.style.textAlign === 'start') selectedItem.x = this.config.pad.x;
      updateIt();
    }
    canvasEditorContainer.querySelector('.add-txt').oninput = (ev) => {
      selectedItem.style.textAlign = ev.target.value;
      updateIt();
    }
    canvasEditorContainer.querySelector('.canvas-direction-field').oninput = (ev) => {
      selectedItem.style.direction = ev.target.value;
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
      selectedItem = initItem();
      this.state.textItems.push(selectedItem);

      this.canvasItems.push(selectedItem);
      this.canvasItems.push(createTextBgItem(selectedItem));

      setFieldValues();
      updateIt();
    };
    if (selectedItem) {
      setFieldValues();
      updateIt();
    }
  }
}