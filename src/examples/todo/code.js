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
    model.todos.push({
      text: model.newTodoText(),
      id: Date.now()
    });
    model.newTodoText(''); // reset
  }
};

const TodoList = {
  view({ attrs }) {
    return (
      m('ul',
        attrs.todos.map((todo) =>
          m('li', { key: todo.id }, todo.text)
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
        m(TodoList, { todos: model.todos }),
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
    model.todos.push({
      text: model.newTodoText(),
      id: Date.now()
    });
    model.newTodoText(''); // reset
  }
};

var TodoList = {
  view: function(vnode) {
    return (
      m('ul',
        vnode.attrs.todos.map(function(todo) {
          return m('li', { key: todo.id }, todo.text);
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
        m(TodoList, { todos: model.todos }),
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
