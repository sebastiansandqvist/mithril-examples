import m from 'mithril';
import stream from 'mithril/stream';

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

export default function TodoApp() {
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
            `Add #${model.todos.length + 1}`
          )
        )
			];
		}
	};
}