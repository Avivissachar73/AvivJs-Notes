const {StyleEl} = window.elementServiceModule.elementService
const {createElementCmp : ElCmp} = window.elementServiceModule.elementService // TODODODOODO!
const { Utils, watchOnObj } = window.utilsServiceModule;

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

  return ElCmp({
    state,
    template: `<div class="txt-cliper"></div>`,
    children: [
      ElCmp({
        template: () => `
          <p class="txt" title="${getters.title()}">
            ${ props.titleTxt ? `<span class="txt-title">${props.titleTxt}</span>` : '' }
            ${ getters.txtToShow() }
          </p>
        `,
        children: [
          // ElCmp({template: () => getters.txtToShow(), textElemet: true}),
          getters.needsToggle() && ElCmp({
            template: () => `
              <button class="read-more-btn">
                ${!state.toggled? 'Read more' : 'Read less'}
              </button>
            `,
            events: {
              onclick: () => methods.toggle()
            }
          })
        ]
      }),
      ElCmp({
        template: () => `
          <p class="full-txt" title="${getters.title()}">
            ${ props.titleTxt ? `<span class="txt-title">${props.titleTxt}</span>` : '' }
            ${ props.txt }
          </p>
        `
      }),
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