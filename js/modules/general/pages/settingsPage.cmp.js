import { uiPreferenceService } from "../../../../lib/uiPreferensesService.js";
// import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import evEmmiter from '../../../../lib/EventEmiter.js';

export default class SettingsPage {
    name = 'SettingsPage';
    state = {
      langs: [{value: 'en', label: 'English'}, {value: 'he', label: 'עברית'}],
      defaultThemes: ['red', 'lemon', 'purple', 'pink', 'blue', 'dark'],
      remOpts: [{label: 'small', value: 12}, {label: 'medium', value: 15}, {label: 'big', value: 17}, {label: 'bigger', value: 20}],
      settings: null,
      uiConfig: uiPreferenceService.loadUiPreferences(),
      test: ''
    }
    template = `
        <main class="SandBox app-main">
            <div class="container flex column gap30 main-pad-y">
              <h1 class="flex-center">{{$t('_settingsLocales.settings')}}</h1>
              <div class="simple-form width-content">
                  <label class="flex align-center gap10">
                    <span>{{$t('_settingsLocales.locale')}}</span>
                    <select A-model="uiConfig.locale" @change="saveUiConfig" placeholder="{{$t('_settingsLocales.locale')}}">
                      <option
                        A-for="opt in langs" key="{{opt.value}}"
                        value="{{opt.value}}"
                        label="{{opt.label}}"
                        A-selected="opt.value === uiConfig.locale"
                      ></option>
                    </select>
                  </label>
                  <label class="flex align-center gap10">
                    <span>{{$t('_settingsLocales.theme')}}</span>
                    <select A-model="uiConfig.theme" @change="saveUiConfig" placeholder="{{$t('_settingsLocales.theme')}}">
                      <option
                        A-for="opt in themes" key="{{opt.value}}"
                        value="{{opt.value}}"
                        label="{{opt.label}}"
                        A-selected="opt.value === uiConfig.theme"
                      ></option>
                    </select>
                  </label>
                  <label class="flex align-center gap10">
                    <span>{{$t('_settingsLocales.textSize')}}</span>
                    <select A-model="uiConfig.remSize" @change="saveUiConfig" placeholder="{{$t('_settingsLocales.textSize')}}">
                      <option
                        A-for="opt in remOptsToRender" key="{{opt.value}}"
                        value="{{opt.value}}"
                        label="{{opt.label}}"
                        A-selected="opt.value == uiConfig.remSize"
                      ></option>
                    </select>
                  </label>
              </div>
              <div class="simple-form" A-if="false">
                  <FormInput type="select" class="gap10" labelholder="settingsLocales.locale" v-model="uiConfig.locale" :items="langs"/>
                  <!-- <FormInput type="select" class="gap10" labelholder="settingsLocales.theme" v-model="uiConfig.theme" :items="themes"/> -->
                  <FormInput type="select" class="gap10" labelholder="settingsLocales.theme" v-model="uiConfig.themesByOrg[org?._id || 'default'][selectedAppData.name]" @change="saveUiConfig" :items="themes"/>
                  <FormInput type="select" class="gap10" labelholder="settingsLocales.textSize" v-model="uiConfig.remSize" :items="remOpts"/>
                  <!-- <FormInput class="gap10 row-reverse" label="settings.darkMode" :value="uiConfig.darkMode" type="checkbox" @input="setDarkMode"/> -->
                  <!-- <FormInput type="checkbox" class="gap10" label="settings.accessability" v-model="uiConfig.accessabilityMode"/> -->
              </div>
            </div>
        </main>
    `;

    style = {
      'label span': {
        display: 'inline-block',
        'width': '6em'
      }
    }

  getters = {
    themes() {
      let themesToSelect = this.defaultThemes;
    //   if (this.org) themesToSelect = Array.from(new Set([...this.org.designPreferences?.producerApp.map(c => c.name), ...themesToSelect]));
      return themesToSelect.map(c => ({value: c, label: this.$t('_settingsLocales._themes.'+c, c)}))
    },
    remOptsToRender() {
      return this.remOpts.map(c => ({...c, label: this.$t(`_settingsLocales._textSize.${c.label}`)}));
    }
    // themeItemToSelect() {
    //   this.uiConfig.themesByOrg[this.org?._id || 'default'][this.selectedAppData.name];
    // }
  }
  methods = {
    saveUiConfig() {
        console.log(this.uiConfig.theme);
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