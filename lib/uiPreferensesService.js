const DEFAULT_STORAGE_KEY = 'uiConfig';
const defaultUiConfig = {
  locale: 'en',
  theme: '',
  accessabilityMode: false,
  remSize: 16,
//   themesByOrg: {
//     // [orgId]: { [appName]: [themeName] }
//     default: {}
//   }
}

function loadUiPreferences(key = DEFAULT_STORAGE_KEY) {
    return localStorage[key] ? { ...JSON.parse(JSON.stringify(defaultUiConfig)), ...JSON.parse(localStorage[key]) } : { ...JSON.parse(JSON.stringify(defaultUiConfig)) }
}
function saveUiPreferences(uiConfig = {}, key = DEFAULT_STORAGE_KEY) {
    localStorage[key] = JSON.stringify(uiConfig);
}

export const uiPreferenceService = {
    loadUiPreferences,
    saveUiPreferences
}