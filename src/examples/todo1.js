import m from 'mithril';
import stream from 'mithril/stream';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var stream = require('mithril/stream');

var model = {
  todos: [],
  newTodoText: stream(''),
  addTodo: function(event) {
    event.preventDefault();
    model.todos.push(model.newTodoText());
    model.newTodoText(''); // reset
  }
};

var TodoList = {
  view: function(vnode) {
    return (
      m('ul',
        vnode.attrs.items.map(function(item, i) {
          return m('li', { key: i }, item);
        })
      )
    );
  }
};

var TodoApp = {
  view: function() {
    return (
      m('div',
        m('h3', 'To-do'),
        m(TodoList, { items: model.todos }),
        m('form', { onsubmit: model.addTodo },
          m('input[type=text]', {
            oninput: m.withAttr('value', model.newTodoText),
            value: model.newTodoText()
          }),
          m('button', {
            type: 'submit'
          }, 'Add #' + (model.todos.length + 1))
        )
      )
    );
  }
};`);

const es6 = codeString(
`import stream from 'mithril/stream';

const model = {
  todos: [],
  newTodoText: stream(''),
  addTodo(event) {
    event.preventDefault();
    model.todos.push(model.newTodoText());
    model.newTodoText(''); // reset
  }
};

const TodoList = {
  view({ attrs }) {
    return (
      m('ul',
        attrs.items.map((item, i) =>
          m('li', { key: i }, item)
        )
      )
    );
  }
};

const TodoApp = {
  view() {
    return (
      m('div',
        m('h3', 'To-do'),
        m(TodoList, { items: model.todos }),
        m('form', { onsubmit: model.addTodo },
          m('input[type=text]', {
            oninput: m.withAttr('value', model.newTodoText),
            value: model.newTodoText()
          }),
          m('button', { type: 'submit' }, \`Add #$\{model.todos.length + 1}\`)
        )
      )
    );
  }
};`);

const jsx = codeString(
`import stream from 'mithril/stream';

const model = {
  todos: [],
  newTodoText: stream(''),
  addTodo(event) {
    event.preventDefault();
    model.todos.push(model.newTodoText());
    model.newTodoText(''); // reset
  }
};

const TodoList = {
  view({ attrs }) {
    return (
      <ul>
        {
          attrs.items.map((item, i) => <li key={i}>{item}</li>)
        }
      </ul>
    );
  }
};

const TodoApp = {
  view() {
    return (
      <div>
        <h3>To-do</h3>
        <TodoList items={model.todos}/>
        <form onsubmit={model.addTodo}>
          <input
            type='text'
            value={model.newTodoText()}
            oninput={m.withAttr('value', model.newTodoText)}/>
          <button type='submit'>
            Add #{model.todos.length + 1}
          </button>
        </form>
      </div>
    );
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

const model = {
  todos: [],
  newTodoText: stream(''),
  addTodo(event) {
    event.preventDefault();
    model.todos.push(model.newTodoText());
    model.newTodoText(''); // reset
  }
};

const TodoList = {
  view({ attrs }) {
    return (
      m('ul',
        attrs.items.map((item, i) =>
          m('li', { key: i }, item)
        )
      )
    );
  }
};

export const Component = {
  view() {
    return (
      m('div',
        m('h3', 'To-do'),
        m(TodoList, { items: model.todos }),
        m('form', { onsubmit: model.addTodo },
          m('input[type=text]', {
            oninput: m.withAttr('value', model.newTodoText),
            value: model.newTodoText()
          }),
          m('button', { type: 'submit' }, `Add #${model.todos.length + 1}`)
        )
      )
    );
  }
};