'use strict';

export default class ColorsEdit {
    name = 'colors-edit';
    props = ['colors'];
    template = `
        <div A-if="colorsToEdit" class="colors-edit" style="width:100%;">
            <style>
                .colors-edit .colors {
                    display: flex;
                    align-itemps: center;
                    justify-content: space-around;
                    flex-wrap: wrap;
                    width: 100%;
                }
                .colors-edit .color {
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    border: 1px solid black;
                    box-shadow: 0px 0px 5px 1px rgba(0,0,0,1);
                    transition: 3s;
                    margin: 5px;
                }
                .colors-edit .color:hover {cursor: pointer;}
                .colors-edit .color.selected {border: 1px solid white}
                .colors-edit .color:not(:last-child){margin-right: 5px}
                .colors-edit .color-edit-input {
                    position: absolute;
                    top: -2000px;
                }
                .colors-edit .colors-edit-section {
                    width: 100%;
                    border: 1px solid black;
                    border-radius: 5px;
                    padding: 5px;
                    text-align: center;
                }
                .colors-edit .colors-edit-section >:not(:last-child) {
                    margin-bottom: 10px;
                }
                .colors-edit .color-edit-actions {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                }
            </style>
            <section class="colors-edit-section">
                <h4>Change Colors</h4>
                <template A-for="colors,key in colorsToEdit">
                    {{key}}
                    <div class="colors">
                        <template A-for="color,idx in colors">
                            <label>
                                <div @click="select(color)" style="background-color:{{color}};" class="color {{color===selectedColor? 'selected' : ''}}"></div>
                                <input type="color" class="color-edit-input" A-model="colorsToEdit[key][idx]"/>
                            </label>
                        </template>
                    </div>
                </template>
                <div class="color-edit-actions">
                    <button @click="emitChanges">Save changes</button>
                    <button @click="close">Cancel</button>
                </div>
            </section>
        </div>
    `;
    state = {
        colorsToEdit: null,
        selectedColor: ''
    }
    methods = {
        select(color) {
            this.state.selectedColor = color;
        },
        emitChanges() {
            this.context.emit('colorsUpdate', JSON.parse(JSON.stringify(this.colorsToEdit)));
        },
        close() {
            this.context.emit('close');
        }
    }
    onCreated() {
        this.state.colorsToEdit = JSON.parse(JSON.stringify(this.colors));
    }
    watch = {
        colors(newVal) {
            this.state.colorsToEdit = JSON.parse(JSON.stringify(newVal));
        }
    }
}