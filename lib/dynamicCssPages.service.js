
// import defaultThemes from './themes/index.js';
import { elementService } from './element.service.js';
import { Utils } from './utils.service.js';


const defaultStylingTheme = {
  name: '',
  class: '', // css class
  colors: [
    'black', // main-clr
    'white', // main-bg
    'white', // header-bg
    'black', // header-bg
    'gold',  // heading clr
    'blue',  // link clr
    'blue'   // btn clr
  ],
  fonts: [],
  css: '' // css code as string;,
}


var SelectedhTheme = null;
function getSelectedTheme() {
  return SelectedhTheme;
}

// var lastCssEl = null;
function setDynamicStylingThemeEl(stylingTheme = defaultStylingTheme || {}, selector, remSize = 16) {
  const STYLE_EL_CLASSNAME = 'theme-styling-element';
  if (remSize) {
    document.documentElement.style['font-size'] = remSize + 'px';
  }
  SelectedhTheme = stylingTheme;
  const lastCssEl = document.head.querySelector('.'+STYLE_EL_CLASSNAME);
  if (lastCssEl) document.head.removeChild(lastCssEl);
  if (stylingTheme.title) document.title = stylingTheme.title;
  const cssEl = elementService.El(elementService.StyleElWrapper(createDynamicCssCode(stylingTheme, selector, remSize)));
  cssEl.classList.add(STYLE_EL_CLASSNAME);
  document.head.appendChild(cssEl);
  // lastCssEl = cssEl;
  return cssEl;
}

function createDynamicCssCode(stylingTheme = {}, selector, remSize = 16) {
  const colors = stylingTheme?.colors || [];
  const fonts = stylingTheme?.fonts || [];
  const _ig = ':not(.ignore-theme-style)';
  const css = elementService.dataToCss(selector, {
    ...fonts.reduce((acc, c, idx) => ({
      [`--font-${idx}`]: fonts[idx]
    }), {}),
    // ...colors.reduce((acc, c, idx) => ({
    ...Utils.range(7).reduce((acc, c, idx) => {
      c = colors[idx] || defaultStylingTheme.colors[idx]
      return { // 8 colors
        ...acc,
        [`--clr-${idx}`]: `${c} !important`,
        [`.clr-${idx}${_ig}`]: {
          color: `${c} !important`
        },
        [`.bg-${idx}${_ig}`]: {
          backgroundColor: `${c} !important`
        },
        [`.border-clr-${idx}${_ig}`]: {
          'border-color': `${c} !important`
        },
        // ...Utils.range(100).reduce((_acc, lvl, _idx) => ({
        ...Utils.range(10).map(_ => (_)*10).reduce((_acc, lvl, _idx) => ({
          ..._acc,
          [`--clr-${idx}-d-${100 - lvl + 0}`]: `${Utils.getColorLighterOrDarker(c, lvl, true)} !important`,
          [`--clr-${idx}-l-${100 - lvl + 0}`]: `${Utils.getColorLighterOrDarker(c, lvl, false)} !important`,
        }), {}),
      }
    }, {}),
    '--main-color': colors[0],
    '--main-bgc': colors[1],
    '--header-color': colors[2],
    '--header-bgc': colors[3],
    '--heading-color': colors[4],
    // '--heading-bg': colors[5], // NOT USED! REMOVE IT!;
    '--link-color': colors[5],
    '--btn-color': colors[6],

    [`.app-main${_ig}`]: {
      color: 'var(--clr-0)' || colors[0] || 'black',
      backgroundColor: 'var(--clr-1)' || colors[1] || 'white'
    },
    [`.app-header${_ig}, .app-footer${_ig}`]: {
      color: 'var(--clr-2)' || colors[2] || 'white',
      backgroundColor: 'var(--clr-3)' || colors[3] || 'black'
    },
    [`h1${_ig}, h2${_ig}, h3${_ig}, h4${_ig}, h5${_ig}, h6${_ig}`]: {
      color: 'var(--clr-4)' || colors[4] || 'black',
    },
    [colors[5]? `a${_ig}` : '__a__']: {
      color: 'var(--clr-5)' || colors[5] || 'blue',
    },

    '.btn': {
      '&:not(.clear)': {
        'background-color': 'var(--clr-6)',
        'color': 'var(--clr-1)',
        '&.primary': {
          // background-color: $clr-light-green,
          // background-color: black,
          // color: white,
          'background-color': 'var(--clr-4-d-20)',
          // color: 'var(--clr-1)',
        },
        '&.secondary': {
          // 'background-color': $clr-light-blue,
        },
        '&.danger': {
          // 'background-color': $clr-light-red,
        }
      }
    }
  }) + stylingTheme.css;
  return css;
}


// for dynamic organization ui::

function setStylingForOrgTheme(org, selector, remSize = 16, isClient = false) {
  const theme = getRelevantThemeForOrg(org, isClient);
  return setDynamicStylingThemeEl({...theme, title: org.name}, selector, remSize);
}

function getRelevantThemeForOrg(org, isClient, uiConfig, selectedAppData) {
  const selectedThemeName = uiConfig?.themesByOrg?.[org?._id || 'default']?.[selectedAppData?.name]; // || uiConfig?.theme;
  let themesToSelect = defaultThemes;
  if (org) themesToSelect = [...(isClient ? org?.designPreferences?.clientApp : org?.designPreferences?.producerApp || []), ...defaultThemes];
  let themeItem = themesToSelect.find(c => c.name === selectedThemeName) || themesToSelect[0];
  if (themeItem) {
    themeItem = {
      ...themeItem,
      title: [`<AppName>`, org?.name].filter(Boolean).join(' - '),
      // css: `${selector} {}`
    };
  }
  return themeItem;
}


const _dynamicCssPagesService = {
  getSelectedTheme,
  setDynamicStylingThemeEl,
  createDynamicCssCode,
  setStylingForOrgTheme,
  getRelevantThemeForOrg
}
export const dynamicCssPagesService = _dynamicCssPagesService;