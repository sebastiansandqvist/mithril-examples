import codeString from '../../util/codeString.js';

const es6 = codeString(
  `import stream from 'mithril/stream';

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

function ClassNamesComponent() {
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
}`);

const es5 = codeString(
  `var stream = require('mithril/stream');

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

var DynamicClassComponent = {
  view: function(vnode) {
    return (
      m('button.Button.Button--small', {
        className: getClassName(vnode.attrs.model)
      }, 'Demo component')
    );
  }
};

function ClassNamesComponent() {
  var model = classNameModel();
  return {
    view: function() {
      return (
        m('div',
          m('label',
            m('input[type=checkbox]', {
              checked: model.hasError(),
              onchange: function(event) {
                model.hasError(event.target.checked);
              }
            }),
            m('span', 'Add error class')
          ),
          m('br'),
          m('label',
            m('input[type=checkbox]', {
              checked: model.hasAnimation(),
              onchange: function(event) {
                model.hasAnimation(event.target.checked);
              }
            }),
            m('span', 'Add animated class')
          ),
          m('br'),
          m('label',
            m('input[type=radio][name=corner][value=rounded]', {
              checked: model.corner() === 'rounded',
              onchange: function(event) {
                model.corner(event.target.value);
              }
            }),
            m('span', 'Rounded')
          ),
          m('label',
            m('input[type=radio][name=corner][value=squared]', {
              checked: model.corner() === 'squared',
              onchange: function(event) {
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
}`);

export default [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];
