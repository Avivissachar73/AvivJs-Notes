
import { elementService } from '../../element.service.js';
const { StyleEl, _ } = elementService;
import { elementComponentService } from '../../ElementComponent.class.js';
const { createCmp : ElCmp } = elementComponentService;

export function ToggleBtns(props = { value: '', onChange: (val) => {}, options: [] }) {
    const state = {
        localVal: props.value
    }
    const getters = {
        mapedOptions() {
            return props.options.map(opt => typeof opt === 'object'? opt : { label: opt, value: opt });
        }
    }
    const methods = {
        emitVal(ev, val) {
            ev.preventDefault()
            ev.stopPropagation()
            state.localVal = val;
            props.onChange(val);
        }
    }
    return ElCmp({ state, template: () => `<div class="toggle-btns"></div>`, children: [
        ...getters.mapedOptions().map(opt => ElCmp({template: () => `<button class="${state.localVal === opt.value ? 'selected' : ''}">
            ${opt.img ? `<img src="${opt.img}"/>` : ''}
            ${!opt.img && opt.html ? ` <span/>${opt.html}</span>` : ''}
            ${opt.label ? `<span>${opt.label}</span>` : ''}
        </button>`, attributes: { onclick: ($ev) => methods.emitVal($ev, opt.value) } })),
        StyleEl('.toggle-btns', { // flex align-center space-between gap5 
            'display': 'flex',
            'align-items': 'center',
            'flex-wrap': 'wrap',
            'border': `${_.em(1)} solid black`,
            'border-radius': _.em(5),
            'overflow': 'hidden',
            // background-color: #fff,
            // 'box-shadow': `0 0 ${_.em(10)} ${_.em(1)} black`, // 0 0 em(10px) em(1px) color-mix(in srgb, var(--clr-0) 20%, transparent)
            'button': {
                'background-color': '#fff',
                'color': 'black',
                'padding': _.em(3),
                // color: black,
                'height': '100%',
                'border-radius': 0,
                'border': 'none',
                '&:not(:last-child)': {
                    'border-inline-end': `${_.em(1)} solid black`,
                },
                '&.selected': {
                    // background-color: $clr-light-green,
                    'background-color': 'var(--clr-4-d-20)',
                    'font-weight': 'bold',
                },
                img: {
                    width: _.em(30),
                    height: _.em(30),
                }
            }
        })
    ] });
}