import { elementService } from '../../element.service.js';
const { StyleEl, _ } = elementService;
import { elementComponentService } from '../../ElementComponent.class.js';
const { createCmp : ElCmp } = elementComponentService;
import { Utils } from '../../utils.service.js';

export function ClipTxt(props = { txt: '', titleTxt: '', maxLength: 100 }) {
  const state = {
    toggled: false
  }
  const getters = {
    needsToggle: () => (props.txt.length + (props.titleTxt?.length || 0)) > props.maxLength,
    txtToShow: () => {
      if (state.toggled) return props.txt;
      return Utils.cropText(props.txt, props.maxLength - (props.titleTxt?.length || 0));
    },
    title: () => [props.titleTxt, props.txt].filter(Boolean).join(' ')
  }
  const methods = {
    toggle: (val) => {
      if (typeof val === 'boolean') state.toggled = val;
      else state.toggled = !state.toggled;
    }
  }
  return ElCmp({ state, template: `<div class="txt-cliper"></div>`, children: [
      ElCmp({ template: () => ` <p class="txt" title="${getters.title()}">
          ${ props.titleTxt ? `<span class="txt-title">${props.titleTxt}</span>` : '' }
          ${ getters.txtToShow() }
        </p>`, children: [
          // ElCmp({template: () => getters.txtToShow(), textElemet: true}),
          ElCmp({ template: () => `<button class="read-more-btn"></button>`,
            options : { showIf: () => getters.needsToggle() },
            attributes: { onclick: () => methods.toggle() },
            children: [
              ElCmp({ template: () => `${!state.toggled? 'Read more' : 'Read less'}`, options: { isTxt: true } })
            ]
          })
        ]
      }),
      ElCmp({ template: () => `<p class="full-txt" title="${getters.title()}">
        ${ props.titleTxt ? `<span class="txt-title">${props.titleTxt}</span>` : '' }
        ${ props.txt }
      </p>`}),
      StyleEl('.txt-cliper', {
        '.full-txt': {
          display: 'none'
        },
        '.txt-title': {
          'text-decoration': 'underline'
        }
      })
    ]
  });
}