import { elementService } from "./element.service.js";
import { Utils } from "./utils.service.js";

function getBaseCssAndHelpers(baseSelector = '', emUnit = 16) {
  const em = elementService.makeEmHelperFunc(emUnit);
  const smallScreenBreakPxVal = '900px';
  const helpers = elementService.dataToCss(baseSelector, {
    /* helpers */
    /* FLEX HELPERS: */
    '.flex': {
      display: 'flex'
    },
    '.align-center': {
      'align-items': 'center'
    },
    '.align-end': {
      'align-items': 'end'
    },
    '.align-start': {
      'align-items': 'start'
    },
    '.align-stretch': {
      'align-items': 'stretch'
    },
    '.justify-center': {
      'justify-content': 'center'
    },
    '.space-around': {
      'justify-content': 'space-around'
    },
    '.space-between': {
      'justify-content': 'space-between'
    },
    '.column': {
      'flex-direction': 'column'
    },
    '.wrap': {
      'flex-wrap': 'wrap'
    },
    '.wrap-reverse': {
      'flex-wrap': 'wrap-reverse'
    },
    '.flex-start': {
      'align-items': 'flex-start'
    },
    '.flex-end': {
      'align-items': 'flex-end'
    },
    '.justify-end': {
      'justify-content': 'flex-end'
    },
    '.flex-center': {
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center'
    },
    '.flex-1': {
      flex: 1
    },
    '.flex-2': {
      flex: 2
    },
    '.stretch-self': {
      'align-self': 'stretch'
    },
    '.align-self-end': {
      'align-self': 'flex-end'
    },
    '.align-self-start': {
      'align-self': 'flex-start'
    },
    '.align-self-center': {
      'align-self': 'center'
    },
    '.row-reverse': {
      'flex-direction': 'row-reverse'
    },
    '.column-reverse': {
      'flex-direction': 'column-reverse'
    },
    
    '.column-layout': {
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center'
    },
    // '.gap3': { gap: em(3) },
    // '.gap5': { gap: em(5) },
    // '.gap10': { gap: em(10) },
    // '.gap15': { gap: em(15) },
    // '.gap20': { gap: em(20) },
    // '.gap30': { gap: em(30) },
    ...Utils.range(100, 1).reduce((acc, c) => {
      return {
        ...acc,
        [`.gap${c}`]: {gap: `${em(c)}`}
      }
    }, {}),

    '.text-center': {
      'text-align': 'center'
    },
    '.text-end': {
      'text-align': 'end'
    },
    '.text-start': {
      'text-align': 'start'
    },
    '.clean-list': {
      'list-style-type': 'none',
      margin: 0,
      padding: 0,
    },
    '.width-all': {
      width: '100%'
    },
    '.height-all': {
      height: '100%'
    },
    '.width-half': {
      width: '50%'
    },
    '.height-half': {
      height: '50%'
    },
    '.width-content': {
      width: 'fit-content !important'
    },
    '.height-content': {
      height: 'fit-content'
    },
    '.uppercase': {
      'text-transform': 'uppercase'
    },
    '.no-pad-top': {
      paddingTop: '0 !important'
    },
    '.no-pad-bottom': {
      paddingBottom: '0 !important'
    },


    '.danger': {
      color: 'red'
    },
    '.safe': {
      color: 'green'
    },
    '.warn': {
      color: 'yellow'
    },


    '.simple-form': {
      display: 'flex',
      'flex-direction': 'column',
      'width': '100%',
      // 'align-items': 'flex-start',
      gap: em(10),
      'position': 'relative',
      '.form-input': {
        '&:not(.form-input-checkbox)': {
          // 'align-items': 'flex-start',
          // width: em(300),
          '&.width-content': {
            width: 'fit-content'
          },
          '.input': {
            flex: 1
          },
          '.label': {
            width: em(100)
          }
        }
      },
      '&.gap30': {
        gap: em(30)
      },
      '&.gap40': {
        gap: em(40)
      },
      '>.btn': {
        width: 'fit-content'
      }

      // .form-footer {
      //   position: absolute;
      //   bottom: 0;
      // }
    },

    
    '.underline': {
      'text-decoration': 'underline !important'
    },
    '.pointer': {
      'cursor': 'pointer'
    },
    '.sticky': {
      'position': 'sticky',
      'top': 0
    },
    '.bold': {
      'font-weight': 'bold'
    },

    '.hover-pop': {
      'transition': 'transform 0.1s',
      // display: inline-block;
      '&:hover': {
        'transform': 'scale(1.05)'
      }
    },

    '.blured-content': {
      'filter': 'blur(1px)'
    },

    '.respect-lines': {
      'white-space': 'pre',
      // 'unicode-bidi': 'embed'
    },

    '.rtl': {
      direction: 'rtl'
    },
    '.ltr': {
      direction: 'ltr'
    },

    '--small-screen-break': smallScreenBreakPxVal,
    [`@media (min-width: ${smallScreenBreakPxVal})`]: {
      '.small-screen-item': {
        display: 'none !important'
      }
    },
    [`@media (max-width: ${smallScreenBreakPxVal})`]: {
      '.wide-screen-item': {
        display: 'none !important'
      }
    },

    '.svg-parrent': {
      width: '1em',
      height: '1em',
      'svg': {
        width: '100%',
        height: '100%',
        'object-fit': 'contain'
      }
    },

    '.grid': {
      display: 'grid',
      // grid-template-rows: auto;
      // grid-template-columns: repeat(5, minmax(100px, 300px));
      'grid-template-columns': `repeat(auto-fill, minmax(${em(200)}, 1fr))`,
      // justify-content: space-between;
      [`@media (max-width: ${smallScreenBreakPxVal})`]: {
        'grid-template-columns': '1fr'
      },
      // grid-auto-flow: dense;
      
      // '&.columns-1': {
      //   'grid-auto-columns': 'unset',
      //   'grid-template-columns': '1fr',
      // },
      // '&.columns-2': {
      //   'grid-auto-columns': 'unset',
      //   'grid-template-columns': '1fr 1fr',
      // },
      ...Utils.range(10, 1).reduce((acc, c) => {
          return {
            ...acc,
            [`.columns-${c}`]: {
              'grid-auto-columns': 'unset',
              'grid-template-columns': Utils.range(c).map(() => '1fr').join(' '),
            }
          }
      }, {}),
    },

    '.exact-spacing': {
      'white-space': 'pre-wrap'
    },

    '.pretty-scroll': {
      '&::-webkit-scrollbar': {
        'margin-inline-end': '2.5px',
        'padding': '1px',
        'width': '5px',
        'background-color': 'rgb(83, 83, 83)', // rgb(228, 59, 59) // rgb(255, 137, 137)
        'border-radius': '10px',
      },
      '&::-webkit-scrollbar-thumb': {
        /* width: 5px, */
        'background-color': 'rgb(60, 60, 60)', // rgb(255, 137, 137) // rgb(255, 239, 149)
        'border-radius': '10px',
        
      },
      '&::-webkit-scrollbar-button': {
        'height': '0px',
        /* width: 0px, */
        /* 'background-color': blue, */
        'border-radius': '10px',
        'background-color': 'rgb(83, 83, 83)', // rgb(228, 59, 59)
      }
    }
  });

  
  const reset = elementService.dataToCss(baseSelector, {
    [`html,
    body,
    div,
    span,
    applet,
    object,
    iframe,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    blockquote,
    pre,
    a,
    abbr,
    acronym,
    address,
    big,
    cite,
    code,
    del,
    dfn,
    em,
    img,
    ins,
    kbd,
    q,
    s,
    samp,
    small,
    strike,
    strong,
    sub,
    sup,
    tt,
    var,
    b,
    u,
    i,
    center,
    dl,
    dt,
    dd,
    ol,
    ul,
    li,
    fieldset,
    form,
    label,
    legend,
    table,
    caption,
    tbody,
    tfoot,
    thead,
    tr,
    th,
    td,
    article,
    aside,
    canvas,
    details,
    embed,
    figure,
    figcaption,
    footer,
    header,
    hgroup,
    menu,
    nav,
    output,
    ruby,
    section,
    summary,
    time,
    mark,
    audio,
    video`]: {
        // all: 'unset',
        margin: 0,
        padding: 0,
        border: 0,
        'font-size': '100%',
        font: 'inherit',
        'vertical-align': 'baseline',
    },
    [`article,
    aside,
    details,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    menu,
    nav,
    section`]: {
        display: 'block'
    },
    body: {
        'line-height': 1,
    },
    [`ol,
    ul`]: {
        'list-style': 'none'
    },
    [`blockquote,
    q`]: {
        quotes: 'none'
    },
    [`blockquote:before,
    blockquote:after,
    q:before,
    q:after`]: {
        content: "",
        content: 'none',
    },
    table: {
        'border-collapse': 'collapse',
        'border-spacing': 0,
    },
    a: {
        color: 'unset'
    },
    button: {
        border: 'none',
        margin: 0,
        padding: 0,
        width: 'auto',
        overflow: 'visible',
        cursor: 'pointer',
        background: 'transparent',
        color: 'inherit',
        font: 'inherit',
        'line-height': 'normal',
        '-webkit-font-smoothing': 'inherit',
        '-moz-osx-font-smoothing': 'inherit',
        '-webkit-appearance': 'none',
        '&::-moz-focus-inner': {
            'border': 0,
            'padding': 0,
        }
    }
  });
  return ``+
      `/* BASE */\n${baseSelector} * {\n  box-sizing: border-box !important;\n}\n/* END BASE */` +
  `\n\n/* HELPERS */\n${helpers}\n/* END HELPERS */`   +
  `\n\n/* RESET CSS */\n${reset}\n/* END RESET CSS */`;
}

function getBaseCssAndHelpersWrapped(isLivingElement = true) {
  const wrapped = elementService.StyleElWrapper(getBaseCssAndHelpers());
  if (isLivingElement) return elementService.El(wrapped);
  return wrapped;
}


// module.exports = {
export const baseCssService = {
  getBaseCssAndHelpers,
  getBaseCssAndHelpersWrapped
}