import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`function mapAsciiToBraille(character) {

  var map = {
    a: '⠁',
    b: '⠃',
    c: '⠉',
    d: '⠙',
    e: '⠑',
    f: '⠋',
    g: '⠛',
    h: '⠓',
    i: '⠊',
    j: '⠚',
    k: '⠅',
    l: '⠇',
    m: '⠍',
    n: '⠝',
    o: '⠕',
    p: '⠏',
    q: '⠟',
    r: '⠗',
    s: '⠎',
    t: '⠞',
    u: '⠥',
    v: '⠧',
    w: '⠺',
    x: '⠭',
    y: '⠽',
    z: '⠵',
    0: '⠼⠚',
    1: '⠼⠁',
    2: '⠼⠃',
    3: '⠼⠉',
    4: '⠼⠙',
    5: '⠼⠑',
    6: '⠼⠋',
    7: '⠼⠛',
    8: '⠼⠓',
    9: '⠼⠊'
  };

  return map[character] || character;

}

var BrailleTranslator = {
  oninit: function(vnode) {
    vnode.state.input = m.prop('');
    vnode.state.output = vnode.state.input.run(function(text) {
      return text
        .toLowerCase()
        .split('')
        .map(mapAsciiToBraille)
        .join('');
    });
  },
  view: function(vnode) {
    return (
      m('div',
        m('div', 'Enter ascii text:'),
        m('input[type=text]', {
          placeholder: 'input',
          value: vnode.state.input(),
          oninput: m.withAttr('value', vnode.state.input)
        }),
        m('hr'),
        m('div', 'Braille:'),
        m('div', vnode.state.output())
      )
    );
  }
};`);

const es6 = codeString(
`function mapAsciiToBraille(character) {

  const map = {
    a: '⠁',
    b: '⠃',
    c: '⠉',
    d: '⠙',
    e: '⠑',
    f: '⠋',
    g: '⠛',
    h: '⠓',
    i: '⠊',
    j: '⠚',
    k: '⠅',
    l: '⠇',
    m: '⠍',
    n: '⠝',
    o: '⠕',
    p: '⠏',
    q: '⠟',
    r: '⠗',
    s: '⠎',
    t: '⠞',
    u: '⠥',
    v: '⠧',
    w: '⠺',
    x: '⠭',
    y: '⠽',
    z: '⠵',
    0: '⠼⠚',
    1: '⠼⠁',
    2: '⠼⠃',
    3: '⠼⠉',
    4: '⠼⠙',
    5: '⠼⠑',
    6: '⠼⠋',
    7: '⠼⠛',
    8: '⠼⠓',
    9: '⠼⠊'
  };

  return map[character] || character;

}

const BrailleTranslator = {
  oninit({ state }) {
    state.input = m.prop('');
    state.output = state.input.run(function(text) {
      return text
        .toLowerCase()
        .split('')
        .map(mapAsciiToBraille)
        .join('');
    });
  },
  view({ state }) {
    return (
      m('div',
        m('div', 'Enter ascii text:'),
        m('input[type=text]', {
          placeholder: 'input',
          value: state.input(),
          oninput: m.withAttr('value', state.input)
        }),
        m('hr'),
        m('div', 'Braille:'),
        m('div', state.output())
      )
    );
  }
};`);

const jsx = codeString(
`function mapAsciiToBraille(character) {

  const map = {
    a: '⠁',
    b: '⠃',
    c: '⠉',
    d: '⠙',
    e: '⠑',
    f: '⠋',
    g: '⠛',
    h: '⠓',
    i: '⠊',
    j: '⠚',
    k: '⠅',
    l: '⠇',
    m: '⠍',
    n: '⠝',
    o: '⠕',
    p: '⠏',
    q: '⠟',
    r: '⠗',
    s: '⠎',
    t: '⠞',
    u: '⠥',
    v: '⠧',
    w: '⠺',
    x: '⠭',
    y: '⠽',
    z: '⠵',
    0: '⠼⠚',
    1: '⠼⠁',
    2: '⠼⠃',
    3: '⠼⠉',
    4: '⠼⠙',
    5: '⠼⠑',
    6: '⠼⠋',
    7: '⠼⠛',
    8: '⠼⠓',
    9: '⠼⠊'
  };

  return map[character] || character;

}

const BrailleTranslator = {
  oninit({ state }) {
    state.input = m.prop('');
    state.output = state.input.run(function(text) {
      return text
        .toLowerCase()
        .split('')
        .map(mapAsciiToBraille)
        .join('');
    });
  },
  view({ state }) {
    return (
      <div>
        <div>Enter ascii text:</div>
        <input
          type='text'
          value={state.input()}
          oninput={m.withAttr('value', state.input)}/>
        <hr/>
        <div>Braille:</div>
        <div>{state.output()}</div>
      </div>
    );
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];


function mapAsciiToBraille(character) {

  const map = {
    a: '⠁',
    b: '⠃',
    c: '⠉',
    d: '⠙',
    e: '⠑',
    f: '⠋',
    g: '⠛',
    h: '⠓',
    i: '⠊',
    j: '⠚',
    k: '⠅',
    l: '⠇',
    m: '⠍',
    n: '⠝',
    o: '⠕',
    p: '⠏',
    q: '⠟',
    r: '⠗',
    s: '⠎',
    t: '⠞',
    u: '⠥',
    v: '⠧',
    w: '⠺',
    x: '⠭',
    y: '⠽',
    z: '⠵',
    0: '⠼⠚',
    1: '⠼⠁',
    2: '⠼⠃',
    3: '⠼⠉',
    4: '⠼⠙',
    5: '⠼⠑',
    6: '⠼⠋',
    7: '⠼⠛',
    8: '⠼⠓',
    9: '⠼⠊'
  };

  return map[character] || character;

}

export const Component = {
  oninit({ state }) {
    state.input = m.prop('');
    state.output = state.input.run(function(text) {
      return text
        .toLowerCase()
        .split('')
        .map(mapAsciiToBraille)
        .join('');
    });
  },
  view({ state }) {
    return (
      m('div',
        m('div', 'Enter ascii text:'),
        m('input[type=text]', {
          placeholder: 'input',
          value: state.input(),
          oninput: m.withAttr('value', state.input)
        }),
        m('hr'),
        m('div', 'Braille:'),
        m('div', state.output())
      )
    );
  }
};