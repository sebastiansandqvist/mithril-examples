import codeString from '../../util/codeString.js';

const es6 = codeString(
  `function setHeight(domNode) {
  domNode.style.height = ''; // reset before recalculating
  domNode.style.height = \`$\{domNode.scrollHeight}px\`;
}

function Textarea() {
  const value = stream('');
  return {
    oncreate({ dom }) {
      value.map(() => setHeight(dom));
    },
    view() {
      return m('textarea', {
        value: value(),
        placeholder: 'Enter some text',
        oninput(event) {
          value(event.target.value);
        }
      });
    }
  };
}`);

const es5 = codeString(
  `function setHeight(domNode) {
  domNode.style.height = ''; // reset before recalculating
  domNode.style.height = domNode.scrollHeight + 'px';
}

function Textarea() {
  var value = stream('');
  return {
    oncreate: function(vnode) {
      value.map(function() {
        setHeight(vnode.dom);
      });
    },
    view: function() {
      return m('textarea', {
        value: value(),
        placeholder: 'Enter some text',
        oninput: function(event) {
          value(event.target.value);
        }
      });
    }
  };
}`);

export default [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];
