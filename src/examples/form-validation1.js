import m from 'mithril';
import stream from 'mithril/stream';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var stream = require('mithril/stream');

var model = {
  fieldLong: {
    value: stream(''),
    error: '',
    validate: function() {
      model.fieldLong.error = model.fieldLong.value().length < 10 ?
        'Expected at least 10 characters' : '';
    }
  },
  fieldShort: {
    value: stream(''),
    error: '',
    validate: function() {
      model.fieldShort.error = model.fieldShort.value().length > 5 ?
        'Expected no more than 5 characters' : '';
    }
  }
};

function validateAll(event) {
  event.preventDefault();
  Object.keys(model).forEach(function(field) {
    model[field].validate();
  });
}

var ValidatedInput = {
  view: function(vnode) {
    return (
      m('div',
        m('input[type=text]', {
          className: vnode.attrs.model.error ? 'error' : '',
          value: vnode.attrs.model.value(),
          oninput: m.withAttr('value', vnode.attrs.model.value)
        }),
        m('p.errorMessage', vnode.attrs.model.error)
      )
    );
  }
};

var Component = {
  view: function() {
    return (
      m('form', { onsubmit: validateAll },
        m('p', 'At least 10 characters:'),
        m(ValidatedInput, { model: model.fieldLong }),
        m('p', 'No more than 5 characters:'),
        m(ValidatedInput, { model: model.fieldShort }),
        m('hr'),
        m('button[type=submit]', 'Validate')
      )
    );
  }
};`);

const es6 = codeString(
`import stream from 'mithril/stream';

const model = {
  fieldLong: {
    value: stream(''),
    error: '',
    validate() {
      model.fieldLong.error = model.fieldLong.value().length < 10 ?
        'Expected at least 10 characters' : '';
    }
  },
  fieldShort: {
    value: stream(''),
    error: '',
    validate() {
      model.fieldShort.error = model.fieldShort.value().length > 5 ?
        'Expected no more than 5 characters' : '';
    }
  }
};

function validateAll(event) {
  event.preventDefault();
  Object.keys(model).forEach(function(field) {
    model[field].validate();
  });
}

const ValidatedInput = {
  view({ attrs }) {
    return (
      m('div',
        m('input[type=text]', {
          className: attrs.model.error ? 'error' : '',
          value: attrs.model.value(),
          oninput: m.withAttr('value', attrs.model.value)
        }),
        m('p.errorMessage', attrs.model.error)
      )
    );
  }
};

const Component = {
  view() {
    return (
      m('form', { onsubmit: validateAll },
        m('p', 'At least 10 characters:'),
        m(ValidatedInput, { model: model.fieldLong }),
        m('p', 'No more than 5 characters:'),
        m(ValidatedInput, { model: model.fieldShort }),
        m('hr'),
        m('button[type=submit]', 'Validate')
      )
    );
  }
};`);

const jsx = codeString(
`import stream from 'mithril/stream';

const model = {
  fieldLong: {
    value: stream(''),
    error: '',
    validate() {
      model.fieldLong.error = model.fieldLong.value().length < 10 ?
        'Expected at least 10 characters' : '';
    }
  },
  fieldShort: {
    value: stream(''),
    error: '',
    validate() {
      model.fieldShort.error = model.fieldShort.value().length > 5 ?
        'Expected no more than 5 characters' : '';
    }
  }
};

function validateAll(event) {
  event.preventDefault();
  Object.keys(model).forEach(function(field) {
    model[field].validate();
  });
}

const ValidatedInput = {
  view({ attrs }) {
    return (
      <div>
        <input
          type="text"
          className={attrs.model.error ? 'error' : ''}
          value={attrs.model.value()}
          oninput={m.withAttr('value', attrs.model.value)}/>
        <p className="errorMessage">{attrs.model.error}</p>
      </div>
    );
  }
};

const Component = {
  view() {
    return (
      <form onsubmit={validateAll}>
        <p>At least 10 characters:</p>
        <ValidatedInput model={model.fieldLong}/>
        <p>No more than 5 characters:</p>
        <ValidatedInput model={model.fieldShort}/>
        <hr/>
        <button type="submit">Validate</button>
      </form>
    );
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

const model = {
  fieldLong: {
    value: stream(''),
    error: '',
    validate() {
      model.fieldLong.error = model.fieldLong.value().length < 10 ?
        'Expected at least 10 characters' : '';
    }
  },
  fieldShort: {
    value: stream(''),
    error: '',
    validate() {
      model.fieldShort.error = model.fieldShort.value().length > 5 ?
        'Expected no more than 5 characters' : '';
    }
  }
};

function validateAll(event) {
  event.preventDefault();
  Object.keys(model).forEach(function(field) {
    model[field].validate();
  });
}

const ValidatedInput = {
  view({ attrs }) {
    return (
      m('div',
        m('input[type=text]', {
          className: attrs.model.error ? 'error' : '',
          value: attrs.model.value(),
          oninput: m.withAttr('value', attrs.model.value)
        }),
        m('p.errorMessage', attrs.model.error)
      )
    );
  }
};

export const Component = {
  view() {
    return (
      m('form', { onsubmit: validateAll },
        m('p', 'At least 10 characters:'),
        m(ValidatedInput, { model: model.fieldLong }),
        m('p', 'No more than 5 characters:'),
        m(ValidatedInput, { model: model.fieldShort }),
        m('hr'),
        m('button[type=submit]', 'Validate')
      )
    );
  }
};