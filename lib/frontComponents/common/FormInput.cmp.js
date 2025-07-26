import { elementService } from '../../element.service.js';
const { StyleEl, _ } = elementService;
import { elementComponentService } from '../../ElementComponent.class.js';
const { createCmp : ElCmp } = elementComponentService;
import { Utils } from '../../utils.service';
import Tooltip from './Tooltip.cmp.js';
// import PhoneInput from './PhoneInput.vue';

const inputTypes = [
  'text',
  'number',
  'textarea',
  'password',
  'checkbox',
  'color',
  'date'
];

const defaultProps = () => ({
  value: '', onChange: (val) => {},
  label: '',
  placeholder: '',
  labelholder: '',
  type: 'text',
  items: [],
  itemsMap: {},
  id: '',
  disabled: false,
  required: false,
  iconPos: '',
  showError: false,
  min: -Infinity,
  max: Infinity,
  step: 0,
  accept: '',
  
  showVals: false,
  showActualValues: false,
  listUp: false,

  error: '',
  tooltipMsg: '',

  debug: false,
  reactive: true,

  format: '',
  allowAddValsToMultiSelect: false,
});

export function FormInput(props = {}) {
  props = Utils.concatItems(props, defaultProps());
  const state = {
      val: props.value,
      inputId: props.id || Utils.getRandomId(),
      isOpen: false,

      valsFilterStr: '',
      didInit: false,
      dontEmit: false,
  }

  
  const getters = {
    componentType: () => {
      const { type } = props;
      if (type === 'multiselect') return 'multiselect';
      if (type === 'search') return 'search';
      if (type === 'textarea') return 'textarea';
      if (inputTypes.includes(type)) return 'input';
      return type;
    },
    itemsToRender: () => {
      if (props.itemsMap) {
        const res = [];
        // for (let key in this.itemsMap) res.push({ label: this.itemsMap[key], value: key });
        for (let key in props.itemsMap) res.push({ label: key, value: props.itemsMap[key] });
        return res
      }
      return props.items.map((item) => {
        if (typeof item !== 'object') {
          return { value: item, label: item };
        }
        return item;
      })
    },
    itemsToRenderToShow: () => {
      const filterItems = c => props.type === 'multiselect'? c.label?.toLowerCase?.().includes(state.valsFilterStr.toLowerCase()) : true;
      return getters.itemsToRender().filter(filterItems);
    },
    isEmpty: () => {
      if (
        props.type === 'number' &&
        (state.val < props.min || state.val > props.max)
      )
        return true;
      return !state.val && state.val !== 0;
    },
  }

  const methods = {
    init: () => {
      if (props.type === 'multiselect') {
        if (!Array.isArray(props.value)) {
          state.val = [];
        }
      }
      if (this.componentType === 'select') {
        // if (!this.val) this.val = '';
        // else this.val = this.val?.value || this.val;
        // if (!this.val || typeof this.val === 'string') this.val = { value: this.value || '', label: this.value || '' };  
        // else 
        state.val = state.val?.value || state.val;
      }
      methods.fixDateValIfNeeded();
    },
    autoCloseSelect: () => {
      state.isOpen = false;
    },

    closeDropDown: (e) => {
      if(!e.relatedTarget || e.relatedTarget.id !== 'formCheckbox') {
        state.isOpen = false
      } else {
        e.target.focus()
      }
    },

    gatValToShowForMultiSelect: (val) => {
      return getters.itemsToRender().find(c => c.value === val)?.label || val;
      // if (!this.showActualValues) return val;
      // return this.itemsToRender.find(c => c.value === val)?.label;
    },
    subValName(name = '') {
      let sub = name.slice(0, 8);
      if (sub.length < name.length) sub += '..';
      return sub
    },

    addNewValToMultiSelect() {
      state.val.push(state.valsFilterStr);
      state.valsFilterStr = '';
    },

    fixDateValIfNeeded() {
      if ((props.type === 'date') && Utils.isDateValid(state.val)) {
        const date = new Date(state.val || undefined);
        state.val = `${date.getFullYear()}-${Utils.padNum(date.getMonth()+1)}-${Utils.padNum(date.getDate())}`;
      }
    }
  }


  methods.init();

  return ElCmp({ state, template: () => `
    <section class="form-input" :class="{ 'show-error': showError, ['form-input-' + type]: true, 'has-label': label || labelholder }">
      <label class="label flex align-center gap5" :for="inputId" v-if="label || labelholder">
        <span class="require-span" v-if="required && isEmpty" :style="{ opacity: isEmpty ? 1 : 0 }">*</span>
        <p :title="$t(label || labelholder)">{{ $t(label || labelholder) }}</p>
      </label>
      <div
        ref="elInputContainer"
        class="input"
        :class="{
          [type]: true,
          empty: isEmpty,
          [(iconPos && 'icon-' + iconPos) || '']: true,
        }"
      >
        <input
          class="actual-input"
          v-if="['input', 'autocomplete'].includes(componentType)"
          :list="componentType === 'autocomplete' ? 'autocomplete-datalist-' + this.inputId : ''"
          ref="elInput"
          :disabled="disabled"
          :id="inputId"
          :required="required"
          :min="min"
          :max="max"
          :placeholder="$t(placeholder || labelholder)"
          :type="componentType === 'autocomplete' ? 'text' : type"
          v-model="val"
          :step="step"
          :accept="accept"
        />
        <textarea
          class="actual-input"
          v-else-if="componentType === 'textarea'"
          ref="elInput"
          :disabled="disabled"
          :id="inputId"
          :required="required"
          :placeholder="$t(placeholder || labelholder)"
          v-model="val"
        />

        <select
          class="actual-input"
          v-else-if="componentType === '_select'"
          ref="elInput"
          :disabled="disabled"
          :id="inputId"
          :required="required"
          :placeholder="$t(placeholder || labelholder)"
          v-model="val"
          @change="$emit('change', val)"
        >
          <!-- <option value="" disabled selected>{{$t(placeholder || labelholder)}}</option> -->
          <template v-if="itemsToRenderToShow.length">
            <option
              v-for="item in itemsToRenderToShow"
              :key="item.label"
              :value="item.value"
              :labellll="$t(item.label)"
              :selected="val === item.value"
            >
              <span>{{$t(item.label)}}</span>
              <span v-if="item.img" :style="{backgroundImage: item.img}" :src="item.img"></span>
            </option>
          </template>
          <option v-else @click.prevent.stop="">No data</option>
        </select>

        <div
          v-else-if="['select', 'multiselect'].includes(componentType)"
          ref="elInput"
          :id="inputId"
          :class="{ open: isOpen }"
          @blur="closeDropDown"
          class="select"
        >
          <div v-if="isOpen" @click="autoCloseSelect" class="blur"></div>
          <div @click="isOpen = !isOpen" class="head" >
            <div class="flex align-center gap10 actual-input">
              <div class="head-content">
                <template v-if="componentType === 'multiselect'">
                  <input type="text" v-if="showVals" v-model="valsFilterStr" :placeholder="$t(placeholder || labelholder || 'search')" @keydown.enter.stop.prevent="addNewValToMultiSelect" @click.stop="isOpen = true"/>
                  <span class="placeholder" v-else-if="!showVals || (showVals && !val?.length)">{{ $t(placeholder || labelholder) }}</span>

                  <!-- <div class="inner-square"></div> -->
                  <!-- {{ $t(val) }} -->
                </template>
                <template v-else>
                  <div class="selected-preview" v-if="!itemsToRenderToShow.find(c => c.value === val)"><span class="placeholder">{{ $t(placeholder || labelholder) }}</span></div>
                  <div class="selected-preview flex align-center gap20" v-else>
                    <span>{{$t(itemsToRenderToShow.find(c => c.value === val)?.label || val)}}</span>
                    <img v-if="itemsToRenderToShow.find(c => c.value === val)?.img" :src="itemsToRenderToShow.find(c => c.value === val)?.img"/>
                  </div>
                </template>
              </div>
              <div class="toggle-btn"></div>
              <button class="btn" v-if="allowAddValsToMultiSelect && valsFilterStr" @click.prevent.stop="addNewValToMultiSelect">+</button>
            </div>
            <ul class="multiselect-vals-list" v-if="(componentType === 'multiselect') && showVals && val?.length">
              <li v-for="curr in val.filter(Boolean)" :key="curr">
                <span :title="gatValToShowForMultiSelect(curr)">{{subValName(gatValToShowForMultiSelect(curr))}}</span>
                <button @click.stop.prevent="val.splice(val.findIndex(c => c === curr) ,1)">✖</button>
              </li>
              <li class="clear-li">
                <button class="clear-btn" @click.stop="val = []">✖</button>
              </li>
            </ul>
          </div>
          <div class="drop-down flex column align-start" @click.stop="" :class="{'direction-up': listUp}">
            <template v-if="itemsToRenderToShow?.length">
              <template v-if="componentType === 'multiselect'">
                <label class="flex align-center gap5" v-for="item in itemsToRenderToShow" :key="item.label" :class="{selected: val === item.value}">
                  <input
                    v-if="componentType === 'multiselect'"
                    type="checkbox"
                    id="formCheckbox"
                    v-model="val"
                    :value="item.value"
                    :disabled="disabled"
                  />
                  <img v-if="item.img" :src="item.img"/>
                  <span>{{ $t(item.label) }}</span>
                </label>
              </template>
              <template v-else>
                <div class="flex align-center space-between gap30 drop-down-item" v-for="item in itemsToRenderToShow" :key="item.label" @click="item.disabled? () => {} : (val = item.value, autoCloseSelect())"  :class="{selected: val === item.value}">
                  <span>{{ $t(item.label) }}</span>
                  <img v-if="item.img" :src="item.img"/>
                </div>
              </template>
            </template>
            <p v-else class="width-all text-center justify-center">No data</p>
          </div>
        </div>

        <template v-else-if="['file'].includes(componentType)">
          <input
            class="actual-input"
            type="file"
            ref="elInput"
            :disabled="disabled"
            :id="inputId"
            :required="required"
            :placeholder="$t(placeholder || labelholder)"
            :accept="accept"
            @change="$event => {(val = $event.target.files);/*($event.target.value = null)*/}"
            hidden
          />
          <button
            class="btn__ primary_ underline mid file-btn"
            @click="$refs.elInput.click()"
          >{{$t(placeholder || labelholder)}}
          </button>
        </template>

        <div v-else-if="['radio'].includes(componentType)" class="flex column gap10 align-start options-container">
          <label v-for="item in itemsToRenderToShow" :key="item.label" class="flex align-center gap5">
            <input type="radio" :value="item.value" v-model="val">
            <span>{{item.label}}</span>
          </label>
        </div>

        <PhoneInput
          v-else-if="componentType === 'phone-number'"
          class="ltr actual-input phone-input no-pad"
          ref="elInput"
          :disabled="disabled"
          :id="inputId"
          :required="required"
          :placeholder="$t(placeholder || labelholder)"
          v-model="val"
        />

        <datalist v-if="componentType === 'autocomplete'" :id="'autocomplete-datalist-' + this.inputId">
          <option v-for="item in itemsToRenderToShow" :key="item.value" :value="item.value" :label="item.label"/>
        </datalist>

        <template>
          <!-- <div class="icon-container" @click="$refs.elInput.$el.querySelector('input').focus()" v-if="$slots.default || showError"> -->
          <div class="icon-container" @click="$refs.elInput.focus()" v-if="$slots.default || showError">
            <slot v-if="$slots.default"/>
          </div>
          <Tooltip class="icon-container" v-if="error || tooltipMsg" :msg="error || tooltipMsg">
            <template v-slot:preview v-if="error">
              <img class="icon-img" :src="require('@/assets/images/icons/red_exclamation_mark.png')" alt="">
            </template>
          </Tooltip>
        </template>
      </div>
    </section>
  `, children: [
    StyleEl('', {
      '.form-input': {
        // 'height': em(40px);
        // min-width: em(150px);
        'display': 'flex',
        // 'align-items': flex-end,
        'justify-content': 'space-between',
        'align-items': 'center',
        'flex-wrap': 'wrap',
        'gap': em(5),
        // .gap30 {
          
        // }
        // border-bottom: em(1px) solid gray,
        'label': {
          '.require-span': {
            'color': 'red',
          },
          'p': {
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
          }
        },

        '&.form-input-checkbox': {
          '&.has-label': {
            'flex-direction': 'row-reverse',
          },
          'input': {
            // width: em(15px),
            // 'height': em(15px),
          },
          '.input': {
            'border': 'none',
          }
        },
        // &.form-input-checkbox, &.form-input-radio {
        //   // label {
        //   //   flex: 1,
        //   // }
        // }
        // &.form-input-color {
        //   input {
        //     width: em(70px),
        //     'height': em(40px),
        //   }
        // }
        '.input': {
          'position': 'relative',
          'height': '100%',
          // $borderColor: rgba(128, 128, 128, 0.5),

          '.placeholder, ::placeholder': {
            'color': 'gray',
          },
          '.actual-input': {
            'height': '100%',
            // border: em(1px) solid $borderColor,
            // border-radius: em(3px),
            // overflow: hidden,
            '&:not(.no-pad)': {
              'padding': em(5),
            }
          },
          '&:not(.checkbox):not(.radio)': {
            'flex': '1',
          },
          '&.checkbox, .radio': {
            // 'height': fit-content,
            // width: fit-content,
            'width': em(15),
            'height': em(15),
          },
          '&.radio': {
            'input': {
              'width': 'unset',
            }
          },
          'input, select, textarea': {
            // border: unset,
            'height': '100%',
            'width': '100%',
            'margin': '0',
            'resize': 'none',

            // &[type="checkbox"] {
            //   width: em(15px),
            //   'height': em(15px),
            // }

            '&[type="color"]': {
              'width': em(70),
              'height': em(40),
            }
          },
          'textarea': {
            'height': em(100),
          },

          '[type="checkbox"], select, option': {
            '&:hover:not(:disabled)': {
              'cursor': 'pointer',
            }
          },
          'option': {
            'color': 'black',
          }
        },

        '.icon-container': {
          'position': 'absolute',
          'top': '50%',
          'inset-inline-end': em(5),
          'transform': 'translateY(-50%)',
          'width': em(18),
          'height': em(18),
          '.icon-img, .tooltip-preview, .tooltip': {
            'width': '100%',
            'height': '100%',
          }
        }
      },

      '.form-input-select': {
        '.head': {
          // padding: em(5px),
        }
      },
      '.form-input-multiselect': {
        '.input': {
          '.head': {
            // padding: 0 em(5px),
            
            '.multiselect-vals-list': {
              'border': '1px solid rgba(128, 128, 128, 0.5)',
              'border-radius': em(3),
              'display': 'flex',
              'align-items': 'center',
              'flex-wrap': 'wrap',
              'gap': em(5),
              'width': '100%',
              'padding': em(5),

              // input {
              //   width: fit-content,
              // }

              'li': {
                // width: em(50px),
                'height': em(20),
                'border-radius': em(5),
                'padding': em(5),
                'color': 'white',
                'background-color': '#2090D4',
                'font-size': em(12),
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'space-between',
                'gap': em(5)
              },
              
              '.clear-li': {
                'background-color': 'rgb(255, 109, 109)',
                'border-radius': '50%',
                'width': em(25),
                'height': em(25),
                'padding': 0,
                'button': {
                  'width': '100%',
                  'height': '100%',
                }
              }
            }
          },
          'input': {
            'border': 0,
            'background': 'unset',
            'border': 'unset',
          }
        }
      },
      '.form-input-multiselect, .form-input-select': {
        // width: em(220px),
        // color: #606266,
        // 'height': 100%,
        'display': 'flex',
        'align-items': 'center',
        '.selected-preview': {
          'display': 'flex',
          'align-items': 'center',
          // color: $gray-700,
          'font-weight': '400',
          'padding-inline-end': em(8),
          'height': '100%',
        },
        'box-sizing': 'border-box',
        '.input': {
          
          // min-width: em(180px),
          // min-'height': em(25px),
          // width: 100%,
          'flex': '1',
          // 'height': 100%,
          '.select': {
            'cursor': 'pointer',
            'height': '100%',
            '.head': {
              'height': '100%',
              '.head-content': {
                'height': '100%',
              }
            },

            '.blur': {
              'position': 'fixed',
              'top': '0',
              'inset-inline-start': '0',
              'width': '100vw',
              'height': '100vh',
              'z-index': '4',
              'cursor': 'pointer !important',
            }
          },
          
          '> div': {
            'user-select': 'none',
            // 'background-color': #fff,
            'font-weight': '400',
            'display': 'flex',
            'align-items': 'center',
            // padding: 0 em(5px),
            'width': '100%',
            // 'height': 100%,
            // border: em(1px) solid $borderColor,
            // border-radius: em(3px),
            'position': 'relative',
            '.toggle-btn, .inner-square': {
              'border-inline-end': `${em(5)} solid transparent`,
              'border-inline-start': `${em(5)} solid transparent`,
              'border-bottom': `${em(5)} solid #c5c6cd`,
              'color': rgb(96, 98, 102),
              // position: absolute,
              // inset-inline-start: em(14px),
              // bottom: 50%,
              // transform: translateY(50%) rotate(180deg),
              'transform': 'rotate(180deg)',
              'transition': '0.2s',
              // 'z-index': 1,
              '&:hover': {
                'cursor': 'pointer',
              }
            },
            '.inner-square': {
              'top': em(11),
              'border-bottom': `${em(5)} solid white`,
            },
            '.drop-down': {
              'height': 0,
              'overflow': 'hidden',
              // overflow: auto,
              'max-height': em(500),
              'color': '#606266',
              'background-color': '#fff',
              'min-width': `calc(100% + ${em(2)})`,
              'width': 'fit-content',
              'position': 'absolute',
              'padding': `${em(6)} 0`,
              'top': '100%',
              '&.direction-up': {
                'top': 'unset !important',
                'bottom': '100%',
              },
              'inset-inline-end': `-${em(1)}`,
              'opacity': '0',
              'transform': `translateY(${em(3)})`,
              'z-index': '-1',
              'transition': 'opacity 0.3s',
              'box-shadow': `0px 0px ${em(5)} ${em(3)} rgba(0, 0, 0, 0.2)`,
              'border-radius': em(4),
              '> *': {
                'width': '100%',
                // 'height': em(32px),
                // line-'height': em(34px),
                '&:not(:last-child)': {
                  'border-bottom': `${em(1)} solid rgb(210, 210, 210)`,
                },
                'display': 'flex',
                // 'align-items': center,
                // gap: em(5px),
                'padding': `${em(5)} ${em(20)}`,
                'cursor': 'pointer',
                '&:hover': {
                  'background-color': '#f5f7fa',
                }
              },
              'input': {
                'width': 'fit-content',
              }
            },
            '&.open': {
              '.toggle-btn, .inner-square': {
                'transform': 'translateY(50%) rotate(0deg)',
              },
              '.drop-down': {
                'opacity': '1',
                'z-index': '5',
                'top': `calc(100% + ${em(12)})`,
                'height': 'unset',
                'overflow': 'auto',
              }
            }
          },
          
          'img': {
            'width': em(50),
            'height': em(50),
            'object-fit': 'contain',
            'background-color': 'rgb(206, 206, 206)',
          }
        },

        '.head': {
          // padding: em(5px),
          'display': 'flex',
          // flex-direction: column,
          // gap: em(2px),
          'width': '100%',
          'height': '100%',
          'flex-direction': 'column',
          // 'align-items':center,
          // gap:5px
          '.head-content': {
            'width': '100%',
            'input': {
              'width': '100%',
            },
            'display': 'flex',
            'flex-direction': 'column',
            'gap': em(5),

            
          }
        },

        '.drop-down': {

        }
      },
      '.phone-input': {
        'padding': '0 !important',

      },
      'input': {
        // padding: em(5px),
        'padding-inline-end': 'none',
        'border': 'unset',
        'background': 'unset',
        'outline': 'none',
      }
    })
  ] });
}



const FROM_VUE_APP = {
  methods: {
  },
  watch: {
    val: {
      deep: true,
      handler(val, prev) {
        if (val === prev) return;
        if (this.dontEmit) return;
        if (this.type === 'number') {
          const { min, max } = this;
          if (typeof min === 'number' && val < min) this.val = min;
          if (typeof max === 'number' && val > max) this.val = max;
          val = +val;
        }
        this.$emit('input', val);
        this.$emit('change', val);
      },
    },

    value(val, prev) {
      if (this.didInit && !this.reactive) return; // TODO; MAKE SURE IT IS NOT NEEDED;
      if (val === prev) return;
      if (!this.didInit) this.dontEmit = true;
      this.val = val;
      this.dontEmit = false;
      this.didInit = true;
      this.fixDateValIfNeeded();
    },
  },
};