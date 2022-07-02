'use strict';

AvivJs.Component('TextWrapper', class TextWrapper {
    name = 'text-wrapper';
    props = ['text', 'limit'];
    template = `
        <p title="{{title}}" class="text-wrapper">
            <style>
                .text-wrapper button {
                    margin: 0;
                    padding: 0;
                    display: inline;
                    /* margin-left: 5px; */
                    border: unset;
                    color: #717171 !important;
                    /* border-bottom: 1px solid #717171 !important; */
                    background-color: unset !important;
                    border-radius: unset;
                }
            </style>
            {{txtToShow}}
            <button A-if="isLongTxt" @click="toggle">{{btnMsg}}</button>
        </p>
    `;
    state = {
        isShowAll: false
    }
    getters = {
        isLongTxt() {
            const {text, limit} = this;
            if (!limit) limit = 100;
            return (text.length >= limit)
        },
        txtToShow() {
            const {text, limit} = this;
            if (!limit) limit = 100;
            if (!this.isLongTxt || this.isShowAll) return text;
            return text.substring(0, limit) + '...';
        },
        btnMsg() {
            return this.isShowAll? 'Less' : '..More';
        },
        title() {
            return this.isLongTxt && !this.isShowAll && this.text;
        }
    }
    methods = {
        toggle() {
            console.log('toggling');
            this.state.isShowAll = !this.state.isShowAll;
        }
    }
});

AvivJs.Component('ColorPicker', class ColorPicker {
    name = 'color-picker';
    props = ['colors', 'value'];
    template = `
        <section class="color-picker">
            <div class="colors">
                <template A-for="color in colors">
                   <div @click="select(color)" style="background-color:{{color}};" class="color {{color===selectedColor? 'selected' : ''}}"></div>
                </template>
            </div>
        </section>
        `;
        style = {
            '.colors': {
                display: 'flex',
                'align-items': 'center',
                'justify-content': 'space-around',
                'flex-wrap': 'wrap',
                'width': '100%',
                
                '.color': {
                    'width': '15px',
                    'height': '15px',
                    'border-radius': '25%',
                    'border': '1px solid black',
                    'box-shadow': '0px 0px 5px 1px rgba(0,0,0,1)',
                    transition: '0.2s',
                    margin: '5px',

                    '&:hover': {cursor: 'pointer',},
                    '&.selected': {'border': '1px solid white'},
                    '&:not(:last-child)': {'margin-right': '5px'}
                }
            },
        }
    state = {
        selectedColor: ''
    }
    methods = {
        select(value) {
            this.state.selectedColor = value;
            this.context.emit('input', value);
        }
    }
    onCreated() {
        if (!this.colors) this.colors = ['#ffbebe', '#b5f9e3', '#99bdff', '#fffdbf', '#e02626'];
        this.state.selectedColor = this.value;
        console.log(this.value);
    } 
    watch = {
        value(curr, prev) {
            this.state.selectedColor = this.value;
        }
    }
});