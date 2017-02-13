import m from 'mithril';
import stream from 'mithril/stream';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var stream = require('mithril/stream');

var model = {
  hasError: stream(false),
  hasAnimation: stream(false),
  cornerType: stream('squared')
};

function getClassName() {
  return [
    model.hasError() ? 'error' : '',
    model.hasAnimation() ? 'animated' : '',
    model.cornerType()
  ].join(' ');
}

var DynamicClassComponent = {
  view: function() {
    return (
      m('button.Button.Button--small', {
        className: getClassName()
      }, 'Demo component')
    );
  }
};

var Component = {
  view: function() {
    return (
      m('div',
        m('label',
          m('input[type=checkbox]', {
            checked: model.hasError(),
            onchange: m.withAttr('checked', model.hasError)
          }),
          m('span', 'Add error class')
        ),
        m('br'),
        m('label',
          m('input[type=checkbox]', {
            checked: model.hasAnimation(),
            onchange: m.withAttr('checked', model.hasAnimation)
          }),
          m('span', 'Add animated class')
        ),
        m('br'),
        m('label',
          m('input[type=radio][name=cornerType][value=rounded]', {
            checked: model.cornerType() === 'rounded',
            onchange: m.withAttr('value', model.cornerType)
          }),
          m('span', 'Rounded')
        ),
        m('label',
          m('input[type=radio][name=cornerType][value=squared]', {
            checked: model.cornerType() === 'squared',
            onchange: m.withAttr('value', model.cornerType)
          }),
          m('Span', 'Squared')
        ),
        m('hr'),
        m(DynamicClassComponent)
      )
    );
  }
};`);

const es6 = codeString(
`import stream from 'mithril/stream';

const model = {
  hasError: stream(false),
  hasAnimation: stream(false),
  cornerType: stream('squared')
};

function getClassName() {
  return [
    model.hasError() ? 'error' : '',
    model.hasAnimation() ? 'animated' : '',
    model.cornerType()
  ].join(' ');
}

const DynamicClassComponent = {
  view() {
    return (
      m('button.Button.Button--small', {
        className: getClassName()
      }, 'Demo component')
    );
  }
};

const Component = {
  view() {
    return (
      m('div',
        m('label',
          m('input[type=checkbox]', {
            checked: model.hasError(),
            onchange: m.withAttr('checked', model.hasError)
          }),
          m('span', 'Add error class')
        ),
        m('br'),
        m('label',
          m('input[type=checkbox]', {
            checked: model.hasAnimation(),
            onchange: m.withAttr('checked', model.hasAnimation)
          }),
          m('span', 'Add animated class')
        ),
        m('br'),
        m('label',
          m('input[type=radio][name=cornerType][value=rounded]', {
            checked: model.cornerType() === 'rounded',
            onchange: m.withAttr('value', model.cornerType)
          }),
          m('span', 'Rounded')
        ),
        m('label',
          m('input[type=radio][name=cornerType][value=squared]', {
            checked: model.cornerType() === 'squared',
            onchange: m.withAttr('value', model.cornerType)
          }),
          m('Span', 'Squared')
        ),
        m('hr'),
        m(DynamicClassComponent)
      )
    );
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 }
];

const model = {
  hasError: stream(false),
  hasAnimation: stream(false),
  cornerType: stream('squared')
};

function getClassName() {
  return [
    model.hasError() ? 'error' : '',
    model.hasAnimation() ? 'animated' : '',
    model.cornerType()
  ].join(' ');
}

const DynamicClassComponent = {
  view() {
    return (
      m('button.Button.Button--small', {
        className: getClassName()
      }, 'Demo component')
    );
  }
};

export const Component = {
  view() {
    return (
      m('div',
        m('label',
          m('input[type=checkbox]', {
            checked: model.hasError(),
            onchange: m.withAttr('checked', model.hasError)
          }),
          m('span', 'Add error class')
        ),
        m('br'),
        m('label',
          m('input[type=checkbox]', {
            checked: model.hasAnimation(),
            onchange: m.withAttr('checked', model.hasAnimation)
          }),
          m('span', 'Add animated class')
        ),
        m('br'),
        m('label',
          m('input[type=radio][name=cornerType][value=rounded]', {
            checked: model.cornerType() === 'rounded',
            onchange: m.withAttr('value', model.cornerType)
          }),
          m('span', 'Rounded')
        ),
        m('label',
          m('input[type=radio][name=cornerType][value=squared]', {
            checked: model.cornerType() === 'squared',
            onchange: m.withAttr('value', model.cornerType)
          }),
          m('Span', 'Squared')
        ),
        m('hr'),
        m(DynamicClassComponent)
      )
    );
  }
};