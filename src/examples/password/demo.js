import m from 'mithril';
import stream from 'mithril/stream/stream';

// toggles a stream's value
function toggle(s) {
  s(!s());
}

export default function PasswordInput() {
  const visible = stream(false);
  const value = stream('');
  return {
    view() {
      return [
        m('input', {
          type: visible() ? 'text' : 'password',
          placeholder: visible() ? 'password' : '••••••••',
          value: value(),
          oninput: m.withAttr('value', value),
        }),
        m('button', {
          onclick() { toggle(visible); },
        }, visible() ? 'Hide' : 'Show'),
      ];
    },
  };
}
