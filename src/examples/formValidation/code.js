import codeString from '../../util/codeString.js';

const es6 = codeString(
  `import stream from 'mithril/stream';

function formModel() {
  const model = {
    longField: {
      value: stream(''),
      error: '',
      validate() {
        model.longField.error =
          model.longField.value().length < 10 ?
            'Expected at least 10 characters' : '';
      }
    },
    shortField: {
      value: stream(''),
      error: '',
      validate() {
        model.shortField.error =
          model.shortField.value().length > 5 ?
            'Expected no more than 5 characters' : '';
      }
    }
  };
  return model;
}

function validateAll(model) {
  Object.keys(model).forEach((field) =>
    model[field].validate());
}

const ValidatedInput = {
  view({ attrs }) {
    return [
      m('input[type=text]', {
        className: attrs.field.error ? 'error' : '',
        value: attrs.field.value(),
        oninput(event) {
          attrs.field.value(event.target.value);
        }
      }),
      m('p.errorMessage', attrs.field.error)
    ];
  }
};

function Form() {
  const model = formModel();
  return {
    view() {
      return (
        m('form', {
          onsubmit(event) {
            event.preventDefault();
            validateAll(model);
          }
        },
          m('p', 'At least 10 characters:'),
          m(ValidatedInput, { field: model.longField }),
          m('p', 'No more than 5 characters:'),
          m(ValidatedInput, { field: model.shortField }),
          m('hr'),
          m('button[type=submit]', 'Validate')
        )
      );
    }
  };
}`);

const es5 = codeString(
  `var stream = require('mithril/stream');

function formModel() {
  var model = {
    longField: {
      value: stream(''),
      error: '',
      validate: function() {
        model.longField.error =
          model.longField.value().length < 10 ?
            'Expected at least 10 characters' : '';
      }
    },
    shortField: {
      value: stream(''),
      error: '',
      validate: function() {
        model.shortField.error =
          model.shortField.value().length > 5 ?
            'Expected no more than 5 characters' : '';
      }
    }
  };
  return model;
}

function validateAll(model) {
  Object.keys(model).forEach(function(field) {
    model[field].validate();
  });
}

var ValidatedInput = {
  view: function(vnode) {
    var field = vnode.attrs.field;
    return [
      m('input[type=text]', {
        className: field.error ? 'error' : '',
        value: field.value(),
        oninput: function(event) {
          attrs.field.value(event.target.value);
        }
      }),
      m('p.errorMessage', field.error)
    ];
  }
};

function Form() {
  var model = formModel();
  return {
    view: function() {
      return (
        m('form', {
          onsubmit: function(event) {
            event.preventDefault();
            validateAll(model);
          }
        },
          m('p', 'At least 10 characters:'),
          m(ValidatedInput, { field: model.longField }),
          m('p', 'No more than 5 characters:'),
          m(ValidatedInput, { field: model.shortField }),
          m('hr'),
          m('button[type=submit]', 'Validate')
        )
      );
    }
  };
}`);

export default [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];
