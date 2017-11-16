import m from 'mithril';
import stream from 'mithril/stream/stream';
import marked from 'marked';

export default function MarkdownEditor() {
  const value = stream('Type some *markdown* here!');
  const markdown = value.map(marked);
  return {
    view() {
      return [
        m('h3', 'Input'),
        m('textarea.fullWidth', {
          oninput: m.withAttr('value', value),
          value: value(),
        }),
        m('h3', 'Output'),
        m('div', m.trust(markdown())),
      ];
    },
  };
}
