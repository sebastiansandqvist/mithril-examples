import m from 'mithril';
import stream from 'mithril/stream';

function classNameModel() {
  return {
    hasError: stream(false),
    hasAnimation: stream(false),
    corner: stream('squared'),
  };
}

function getClassName(model) {
  return [
    model.hasError() ? 'error' : '',
    model.hasAnimation() ? 'animated' : '',
    model.corner(),
  ].join(' ');
}

const DynamicClassComponent = {
  view({ attrs }) {
    return (
      m('button.Button.Button--small', {
        className: getClassName(attrs.model),
      }, 'Demo component')
    );
  },
};

export default function ClassNamesComponent() {
  const model = classNameModel();
  return {
    view() {
      return (
        m('div',
          m('label',
            m('input[type=checkbox]', {
              checked: model.hasError(),
              onchange: m.withAttr('checked', model.hasError),
            }),
            m('span', 'Add error class')
          ),
          m('br'),
          m('label',
            m('input[type=checkbox]', {
              checked: model.hasAnimation(),
              onchange: m.withAttr('checked', model.hasAnimation),
            }),
            m('span', 'Add animated class')
          ),
          m('br'),
          m('label',
            m('input[type=radio][name=corner][value=rounded]', {
              checked: model.corner() === 'rounded',
              onchange: m.withAttr('value', model.corner),
            }),
            m('span', 'Rounded')
          ),
          m('label',
            m('input[type=radio][name=corner][value=squared]', {
              checked: model.corner() === 'squared',
              onchange: m.withAttr('value', model.corner),
            }),
            m('Span', 'Squared')
          ),
          m('hr'),
          m(DynamicClassComponent, { model })
        )
      );
    },
  };
}