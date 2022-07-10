'use strict';
import {Utils} from '../../../../../lib/utils.service.js';

export default class TodoNote {
    name = 'todo-note';
    props = ['info', 'isEditable'];
    template = `
        <section class="note-info todo-info column-layout">
            <form @submit.prevent="addTodo" class="flex space-between align-center">
                <input placeholder="do it?" A-model="newTodoTxt"/>
                <button>+</button>
            </form>
            <ul class="clean-list column-layout width-all">
                <li A-for="todo in info.todos" class="flex align-center width-all">
                    <button @click.stop.prevent="removeTodo(todo.id)" class="todo-remove-btn">X</button>
                    <p class="{{todo.isDone? 'done' : ''}}" @click="toggleTodo(todo.id)">{{todo.txt}}</p>
                </li>
            </ul>
        </section>
    `;
    state = {
        newTodoTxt: ''
    }
    getters = {
        isDesable() {
            return (!this.newTodoTxt)? true : false; 
        }
    }
    methods = {
        removeTodo(id) {
            var infoToEdit = JSON.parse(JSON.stringify(this.info));
            var todos = infoToEdit.todos;
            var idx = todos.findIndex(todo => todo.id === id);
            if (idx === -1) throw new Error('Something went wrong removing todo');
            todos.splice(idx, 1);
            this.emitChanges(infoToEdit);
        },
        toggleTodo(id) {
            var infoToEdit = JSON.parse(JSON.stringify(this.info));

            var todos = infoToEdit.todos;
            var todo = todos.find(todo => todo.id === id);
            if (!todo) throw new Error('Something went wrong toggling todo');
            todo.isDone = !todo.isDone;
            this.emitChanges(infoToEdit);
        },
        addTodo() {
            if (!this.newTodoTxt) return;
            var todo = {
                txt: this.newTodoTxt,
                isDone: false,
                id: Utils.getRandomId()
            }
            var infoToEdit = JSON.parse(JSON.stringify(this.info));
            infoToEdit.todos.unshift(todo);
            this.emitChanges(infoToEdit);
            this.state.newTodoTxt = '';
        },
        emitChanges(editedInfo) {
            // this.context.emit('infoUpdated', JSON.parse(JSON.stringify(this.infoToEdit)));
            this.context.emit('infoUpdated', editedInfo);
        }
    }
}