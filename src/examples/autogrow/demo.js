import m from 'mithril';
import stream from 'mithril/stream/stream';

function setHeight(domNode) {
  domNode.style.height = ''; // reset before recalculating
  domNode.style.height = `${domNode.scrollHeight}px`;
}

export default function AutogrowTextarea() {
  const value = stream('');
  return {
    oncreate({ dom }) {
      value.map(() => setHeight(dom));
    },
    view() {
      return m('textarea.fullWidth', {
        value: value(),
        placeholder: 'Enter some text',
        oninput: m.withAttr('value', value)
      });
    }
  };
}
