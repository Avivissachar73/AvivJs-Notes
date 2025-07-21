import { elementService } from '../../element.service.js';
const { StyleEl, _ } = elementService;
import { elementComponentService } from '../../ElementComponent.class.js';
const { createCmp : ElCmp } = elementComponentService;
import { Utils } from '../../utils.service.js';

export function Tooltip(props = {msg: '', attachToElement: 'body', previewSlot: '', contentSlot: ''}) {
    var cmp;
    const state = {
        show: false,
        hoverShow: false,
        elMsgPosStyle: ''
    }
    const methods = {
        toggleShow(val) {
            const newVal = typeof val === 'boolean'? val : !state.show;
            if (newVal === state.show) return;
            state.show = newVal;
            if (state.show) methods.viewMsg();
            else state.hoverShow = false;
        },
        toggleHoverShow(val) {
            const newVal = typeof val === 'boolean'? val : !state.hoverShow;
            if (newVal === state.hoverShow) return;
            state.hoverShow = newVal;
            if (state.hoverShow) methods.viewMsg();
        },
        viewMsg(ev) {
            // if (state.show || state.hoverShow) return;
            const [elPreview, elMsg] = [cmp.element.querySelector('.tooltip-preview'), cmp.element.querySelector('.tooltip-msg')];
            const { offsetWidth: preWidth, offsetHeight: preHeight } = elPreview;
            let { offsetWidth: msgWidth, offsetHeight: msgHeight } = elMsg;
            const { offsetWidth: parentWidth, offsetHeight: parentHeight } = (props.attachToElement instanceof HTMLElement? props.attachToElement : document.querySelector(props.attachToElement || 'body'));
            const elPreviewPos = Utils.getElPosInParent(elPreview, props.attachToElement);
            const rightProp = 'inset-inline-start';
            const leftProp = 'inset-inline-end';
            const style = {};
            style[leftProp] = style[rightProp] = style.bottom = style.top = style.width = style.transform = '';
            let width = 280;
            const height = msgHeight || 100;
            style[leftProp] = preWidth/2;
            let diffXFromBorder;
            if ((parentWidth - elPreviewPos.x) < width) {
                style[leftProp] -= width
                diffXFromBorder = elPreviewPos.x - width;
            } else diffXFromBorder = elPreviewPos.x + width;
            if (diffXFromBorder < 0) style[leftProp] -= diffXFromBorder;
            else if (diffXFromBorder > parentWidth) style[leftProp] += diffXFromBorder;
            else style[leftProp] += preWidth / 2;
            style[leftProp] += 'px';
            style.top = preHeight/2;
            if ((parentHeight - elPreviewPos.y) < height) {
                style.top -= height;
            }
            style.top += 'px';
            if ((width*1.5) > parentWidth) {
                style.width = 0.90*parentWidth + 'px';
                style[leftProp] = parentWidth / 2 - elPreviewPos.x + 'px';
                style.transform = window.getComputedStyle(elMsg).direction === 'rtl' ? 'translateX(-50%)' : 'translateX(50%)';
            } else style.width = width + 'px';
            // for (let key in style) elMsg.style[key] = style[key];
            // state.elMsgPosStyle = style;
            state.elMsgPosStyle = Object.entries(style).map(c => `${c[0]}:${c[1]}`).join(';');
        }
    }
    cmp = ElCmp({ state, template: () => `<span class="tooltip"></span>`, 
        attributes: { onmouseleave: () => methods.toggleHoverShow(false) },
        children: [
            ElCmp({ template: () => `<span class="tooltip-preview flex align-center justify-center">
                ${props.previewSlot ? props.previewSlot : '<span class="default-preview">(?)</span>' }
            </span>`, attributes: { onclick: () => methods.toggleShow(), onmouseover: () => methods.toggleHoverShow(true) } }),
            ElCmp({ template: () => `<div style=" ${!(state.show || state.hoverShow) ? `display: none` : state.elMsgPosStyle || ''}" class="tooltip-msg"></div>`, children: [
                ElCmp(({ template: () => `<button class="btn__ small close-btn">✖</button>`, options: { showIf: () => state.show },  attributes: { onclick: () => methods.toggleShow(false) } })),
                ElCmp(({ template: () => props.contentSlot ? props.contentSlot : `<p>${ props.msg? props.msg : 'No tooltip message...' }</p>` }))
            ] }),
            StyleEl('.tooltip', {
                position: 'relative',
                display: 'inline-block',
                '.tooltip-preview': {
                    display: 'inline-block',
                    width: 'fit-content',
                    height: 'fit-content',
                    cursor: 'help',
                    '.tooltip-img, .default-preview': {
                        // width: _.em(17),
                        // height: _.em(17),
                        'border-radius': '50%',
                        // 'background-color': '#fff',
                    },
                    // '.default-preview': {
                    //     display: 'inline-block',
                    // }
                },
                '.tooltip-msg': {
                    'position': 'absolute',
                    'z-index': 1000,
                    'width': _.em(280),
                    'padding': _.em(20),
                    'line-height': 1.3,
                    'background-color': '#5a5a5a',
                    'color': '#ffffff',
                    'box-shadow': `0 ${_.em(5)} ${_.em(13)} 0 #44444478`,
                    'font-weight': 'normal',
                    '.close-btn': {
                        'position': 'absolute',
                        'top': _.em(5),
                        'inset-inline-end': _.em(5),
                        'line-height': '1em',
                    }
                }
                // .default-preview {
                //     height: 1em;
                //     width: 1em;
                //     font-size: 0.8em;
                // }
            })
        ]
    });
    return cmp;
}