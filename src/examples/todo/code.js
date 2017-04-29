import codeString from '../../util/codeString.js';

const es6 = codeString(
`import stream from 'mithril/stream';

function todoModel() {
  return {
    todos: [],
    newTodoText: stream('')
  };
}

const actions = {
  addTodo(model) {
    model.todos.push(model.newTodoText());
    model.newTodoText(''); // reset
  }
};

const TodoList = {
  view({ attrs }) {
    return (
      m('ul',
        attrs.items.map((item) =>
          m('li', item)
        )
      )
    );
  }
};

function TodoApp() {
  const model = todoModel();
  return {
    view() {
      return [
        m('h3', 'To-do'),
        m(TodoList, { items: model.todos }),
        m('form', {
          onsubmit(event) {
            event.preventDefault();
            actions.addTodo(model);
          }
        },
          m('input[type=text]', {
            oninput: m.withAttr('value', model.newTodoText),
            value: model.newTodoText()
          }),
          m('button[type=submit]',
            \`Add #$\{model.todos.length + 1}\`
          )
        )
      ];
    }
  };
}`);

const es5 = codeString(
`var stream = require('mithril/stream');

function todoModel() {
  return {
    todos: [],
    newTodoText: stream('')
  };
}

var actions = {
  addTodo: function(model) {
    model.todos.push(model.newTodoText());
    model.newTodoText(''); // reset
  }
};

var TodoList = {
  view: function(vnode) {
    return (
      m('ul',
        vnode.attrs.items.map(function(item) {
          return m('li', item);
        })
      )
    );
  }
};

function TodoApp() {
  var model = todoModel();
  return {
    view: function() {
      return [
        m('h3', 'To-do'),
        m(TodoList, { items: model.todos }),
        m('form', {
          onsubmit: function(event) {
            event.preventDefault();
            actions.addTodo(model);
          }
        },
          m('input[type=text]', {
            oninput: m.withAttr('value', model.newTodoText),
            value: model.newTodoText()
          }),
          m('button[type=submit]',
            'Add #' + (model.todos.length + 1)
          )
        )
      ];
    }
  };
}`);

export default [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];
