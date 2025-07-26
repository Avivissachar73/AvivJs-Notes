import { uiPreferenceService } from "../../../../lib/uiPreferensesService.js";
// import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import evEmmiter from '../../../../lib/EventEmiter.js';

export default class SettingsPage {
    name = 'SettingsPage';
    state = {
      langs: [{value: 'en', label: 'English'}, {value: 'he', label: 'עברית'}],
      defaultThemes: ['red', 'lemon', 'purple', 'pink', 'blue', 'dark'],
      remOpts: [{label: 'Small', value: 12}, {label: 'Medium', value: 15}, {label: 'Big', value: 17}, {label: 'Bigger', value: 20}].map(c => ({...c, label: `_settingsLocales.textSize${c.label}`})),
      settings: null,
      uiConfig: uiPreferenceService.loadUiPreferences(),
    }
    template = `
        <main class="SandBox app-main container flex column gap30 main-pad-y">
            <h1 class="flex-center">{{$t('_settingsLocales.settings')}}</h1>
            <div class="simple-form" A-if="false">
                <FormInput type="select" class="gap10" labelholder="settingsLocales.locale" v-model="uiConfig.locale" :items="langs"/>
                <!-- <FormInput type="select" class="gap10" labelholder="settingsLocales.theme" v-model="uiConfig.theme" :items="themes"/> -->
                <FormInput type="select" class="gap10" labelholder="settingsLocales.theme" v-model="uiConfig.themesByOrg[org?._id || 'default'][selectedAppData.name]" @change="saveUiConfig" :items="themes"/>
                <FormInput type="select" class="gap10" labelholder="settingsLocales.textSize" v-model="uiConfig.remSize" :items="remOpts"/>
                <!-- <FormInput class="gap10 row-reverse" label="settings.darkMode" :value="uiConfig.darkMode" type="checkbox" @input="setDarkMode"/> -->
                <!-- <FormInput type="checkbox" class="gap10" label="settings.accessability" v-model="uiConfig.accessabilityMode"/> -->
            </div>
        </main>
    `;


  getters = {
    themes() {
      let themesToSelect = this.defaultThemes;
    //   if (this.org) themesToSelect = Array.from(new Set([...this.org.designPreferences?.producerApp.map(c => c.name), ...themesToSelect]));
      return themesToSelect.map(c => ({value: c.name, label: this.$t('_settingsLocales._themes.'+c, c)}))
    },
    // themeItemToSelect() {
    //   this.uiConfig.themesByOrg[this.org?._id || 'default'][this.selectedAppData.name];
    // }
  }
  methods = {
    saveUiConfig() {
        uiPreferenceService.saveUiPreferences(this.uiConfig);
        evEmmiter.emit('app_config_update', this.uiConfig);
    }
  };
  onCreated() {
    // this.settings = JSON.parse(JSON.stringify(this.$store.getters['settings/settings']));
    // if (!this.uiConfig.themesByOrg) this.uiConfig.themesByOrg = { default: [] };
    // if (this.org) {
    //   if (!this.uiConfig.themesByOrg[this.org._id]) this.uiConfig.themesByOrg[this.org._id] = {};
    // }
  }
//   watch = {
//     uiConfig: {
//       deep: true,
//       handler() {
//         this.saveUiConfig();
//       }
//     }
//   }
//   components = { FormInput }
}