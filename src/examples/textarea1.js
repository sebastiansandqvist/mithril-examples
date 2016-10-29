import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`function setHeight(domNode) {
  domNode.style.height = ''; // reset before recalculating
  domNode.style.height = domNode.scrollHeight + 'px';
}

var Textarea = {
  oninit: function(vnode) {
    vnode.state.value = m.prop();
  },
  oncreate: function(vnode) {
    vnode.state.value.run(function() {
      setHeight(vnode.dom);
    )};
  },
  view: function(vnode) {
    return m('textarea', {
      value: vnode.state.value(),
      oninput: m.withAttr('value', vnode.state.value)
    });
  }
};`);

const es6 = codeString(
`function setHeight(domNode) {
  domNode.style.height = ''; // reset before recalculating
  domNode.style.height = \`$\{domNode.scrollHeight}px\`;
}

const Textarea = {
  oninit({ state }) {
    state.value = m.prop();
  },
  oncreate({ dom, state }) {
    state.value.run(() => setHeight(dom));
  },
  view({ state }) {
    return m('textarea', {
      value: state.value(),
      oninput: m.withAttr('value', state.value)
    });
  }
};`);

const jsx = codeString(
`function setHeight(domNode) {
  domNode.style.height = ''; // reset before recalculating
  domNode.style.height = \`$\{domNode.scrollHeight}px\`;
}

const Textarea = {
  oninit({ state }) {
    state.value = m.prop();
  },
  oncreate({ dom, state }) {
    state.value.run(() => setHeight(dom));
  },
  view({ state }) {
    return <textarea
      value={state.value()}
      oninput={m.withAttr('value', state.value)}/>;
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

function setHeight(domNode) {
  domNode.style.height = ''; // reset before recalculating
  domNode.style.height = `${domNode.scrollHeight}px`;
}

export const Component = {
  oninit({ state }) {
    state.value = m.prop();
  },
  oncreate({ dom, state }) {
    state.value.map(() => setHeight(dom));
  },
  view({ state }) {
    return m('textarea', {
      value: state.value(),
      oninput: m.withAttr('value', state.value)
    });
  }
};