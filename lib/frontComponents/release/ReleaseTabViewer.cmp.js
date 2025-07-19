const { StyleEl, El, _ } = window.elementServiceModule.elementService;
const { createCmp : ElCmp } = window.elementComponentModule;
const { Utils, watchOnObj } = window.utilsServiceModule;
const { createItemForDynamicForm, validateDataByDataField } = window.dynamicFormModule;

export function ReleaseTabView(props = { tabView: false, release: {}, hideTabs: [], mapTabs: (_ => _), organization: {}, dataFields: [] }) {
  const state = {
    selectedTab: ''
  }
  const getters = {
    isScreenWide() {
      return true; // this.$store.getters.isScreenWide;
    },
    tabsData() {
      return {...props.release.releaseData, _id: props.release._id};
    },
    dataFieldsToShow() {
      const formatFields = (fields = []) => {
        return fields
              .filter(c => !c.hideFromUi)
              .filter((field) => {
                return validateDataByDataField(field, getters.tabsData()[field.fieldName], getters.tabsData(), props.release);
              })
              .sort((a, b) => {
                return (a.index || 100) - (b.index || 100)
              })
              .map(c => {
                if (c.type === 'ROW') {
                  c.fields = formatFields(c.fields);
                }
                return c;
              })
              .filter(c => {
                if ((c.type === 'ROW') && !c.fields.length) return false;
                return true; 
              });
      }
      return formatFields(props.dataFields);
    },
    allTabNames() {
      return Array.from(new Set(getters.dataFieldsToShow().map(c => c.uiSections).filter(Boolean).reduce((acc, c) => [...acc, ...c], []))).map(c => ({
        name: c,
        type: 'section',
        ...(props.mapTabs? props.mapTabs(c) : [])
      }));
    }
  }
  const methods = {
    loadReleaseDataFields() {
      state.selectedTab = Utils.getQueryParam('tab') || getters.allTabNames()[0].name;
    },
    init() {
      methods.loadReleaseDataFields();
    },
    scrollToEl(ev, elId) {
      ev.preventDefault();
      state.selectedTab = elId;
      Utils.setQueryParam('tab', elId);
      return Utils.scrollToEl(`#${elId}`, -20);
    },
    validateTab(tabName) {
      if (props.hideTabs?.includes(tabName)) return false;
      return true;
    }
  }

  methods.init();

  return ElCmp(`<div class="release-tab-view height-all flex align-start_ gap100"></div>`, state, {}, {}, [
    ElCmp(`<div class="release-page-nav sticky flex column space-between_ gap100 wide-screen-item"></div>`, {}, {}, {}, [
      ElCmp(`<div class="wide-screen-item flex column gap10_"></div>`, {}, {}, { showIf: () => getters.allTabNames().length }, [
        ...(getters.allTabNames() || ['content', 'images', 'videos', 'files', 'links']).map(tab => (
          ElCmp(() => `<a class="tab-link ${state.selectedTab === tab.name ? 'bold selected' : ''}"></a>`,
            {}, { onclick: (ev) => methods.scrollToEl(ev, tab.name)  }, { showIf: () => (tab.type === 'section') && (methods.validateTab(tab.name)) }, [
              // ElCmp(`<span class="hover-pop">{{$t('releaseLocales.tabs.${tab.name}')}}</span>`)
              ElCmp(() => `<span class="flex hover-pop">${tab.name}</span>`, {}, {}, {textElemet: true}, [])
            ])
        ))
      ]),
      ElCmp(`<div><slot/></div>`, {}, {}, {}, []),
    ]),
    ElCmp(`<div class="flex column flex-1 gap30"></div>`, {}, {}, {}, [
      ...getters.dataFieldsToShow().map(field => (
        ElCmp(() => `<div id="${field.fieldName}" class="${field.fieldName}-display"></div>`, {}, {}, { showIf: () => !getters.isScreenWide() || !getters.allTabNames().length || (props.tabView && field.uiSections?.includes(state.selectedTab)) }, [
          ElCmp(() => `<p :dataField="field" :value="tabsData[field.fieldName]" :parentItem="tabsData" :organization="org" :release="release">${getters.tabsData()[field.fieldName]}</p>`, {}, {}, [])
          // ElCmp(`<DynamicField :dataField="field" :value="tabsData[field.fieldName]" :parentItem="tabsData" :organization="org" :release="release"/>`, {}, {}, [])
        ])
      ))
    ]),
    StyleEl('.release-tab-view', {
      '.release-page-nav': {
        'height': 'fit-content',
        'top': _.em(20),
        'width': _.rem(150),
        '.tab-link': {
          'padding': `${_.em(15)} 0`,
          '&:first-child': {
            'padding-top': 0
          },
          '&:not(:last-child)': {
            'border-bottom': '1px solid #595959',
          },
          '&.selected': {
            'color': 'var(--clr-4)',
            'font-weight': 'bold'
          }
        }
      }
    })
  ]);
}