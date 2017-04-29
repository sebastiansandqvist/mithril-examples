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

export default function TodoApp() {
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
            `Add #${model.todos.length + 1}`
          )
        )
			];
		}
	};
}