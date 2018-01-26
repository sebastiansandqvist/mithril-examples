import m from 'mithril';
import stream from 'mithril/stream/stream';

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
        oninput: m.withAttr('value', attrs.field.value)
      }),
      m('p.errorMessage', attrs.field.error)
    ];
  }
};

export default function Form() {
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
}
