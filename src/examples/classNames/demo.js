import m from 'mithril';
import stream from 'mithril/stream/stream';

function classNameModel() {
  return {
    hasError: stream(false),
    hasAnimation: stream(false),
    corner: stream('squared')
  };
}

function getClassName(model) {
  return [
    model.hasError() ? 'error' : '',
    model.hasAnimation() ? 'animated' : '',
    model.corner()
  ].join(' ');
}

const DynamicClassComponent = {
  view({ attrs }) {
    return (
      m('button.Button.Button--small', {
        className: getClassName(attrs.model)
      }, 'Demo component')
    );
  }
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
              onchange(event) {
                model.hasError(event.target.checked);
              }
            }),
            m('span', 'Add error class')
          ),
          m('br'),
          m('label',
            m('input[type=checkbox]', {
              checked: model.hasAnimation(),
              onchange(event) {
                model.hasAnimation(event.target.checked);
              }
            }),
            m('span', 'Add animated class')
          ),
          m('br'),
          m('label',
            m('input[type=radio][name=corner][value=rounded]', {
              checked: model.corner() === 'rounded',
              onchange(event) {
                model.corner(event.target.value);
              }
            }),
            m('span', 'Rounded')
          ),
          m('label',
            m('input[type=radio][name=corner][value=squared]', {
              checked: model.corner() === 'squared',
              onchange(event) {
                model.corner(event.target.value);
              }
            }),
            m('Span', 'Squared')
          ),
          m('hr'),
          m(DynamicClassComponent, { model })
        )
      );
    }
  };
}
