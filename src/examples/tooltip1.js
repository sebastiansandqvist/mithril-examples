import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`// define the Tooltip component
var Tooltip = {
  view: function(vnode) {
    return (
      m('.Tooltip-wrap',
        vnode.children,
        m('.Tooltip', vnode.attrs.value)
      )
    );
  }
};

// elsewhere, use the Tooltip component
var Component = {
  view: function() {
    return (
      m('div',
        m(Tooltip, { value: 'Foo' },
          m('button', 'Hover over this button')
        ),
        m(Tooltip, { value: 'Bar' },
          m('span', 'or hover here')
        )
      )
    );
  }
};`);

const es6 = codeString(
`// define the Tooltip component
const Tooltip = {
  view({ attrs, children }) {
    return (
      m('.Tooltip-wrap',
        children,
        m('.Tooltip', attrs.value)
      )
    );
  }
};

// elsewhere, use the Tooltip component
const Component = {
  view() {
    return (
      m('div',
        m(Tooltip, { value: 'Foo' },
          m('button', 'Hover over this button')
        ),
        m(Tooltip, { value: 'Bar' },
          m('span', 'or hover here')
        )
      )
    );
  }
};`);

const jsx = codeString(
`// define the Tooltip component
const Tooltip = {
  view({ attrs, children }) {
    return (
      <div className='Tooltip-wrap'>
        {children}
        <div className='Tooltip'>{attrs.value}</div>
      </div>
    );
  }
};

// elsewhere, use the Tooltip component
const Component = {
  view() {
    return (
      <div>
        <Tooltip value='Foo'>
          <button>Hover over this button</button>
        </Tooltip>
        <Tooltip value='Bar'>
          <span>or hover here</span>
        </Tooltip>
      </div>
    );
  }
};`);

const css = codeString.css(
`.Tooltip-wrap {
  display: inline-block;
  position: relative;
  transform: translateZ(0);
}

.Tooltip-wrap:hover .Tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(5px);
    transition: all .3s ease .5s;
    visibility: visible;
}

.Tooltip {
  background: rgba(0, 0, 0, .8);
  border-radius: 2px;
  bottom: -30px;
  color: white;
  font-size: 12px;
  left: 50%;
  opacity: 0;
  padding: 5px 10px;
  position: absolute;
  transition: all .2s ease;
  transform: translateX(-50%) translateY(0);
  user-select: none;
  visibility: hidden;
  white-space: nowrap;
}`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx },
  { id: 'css', code: css }
];


const Tooltip = {
  view({ attrs, children }) {
    return (
      m('.Tooltip-wrap',
        children,
        m('.Tooltip', attrs.value)
      )
    );
  }
};

export const Component = {
  view() {
    return (
      m('div',
        m(Tooltip, { value: 'Foo' },
          m('button', 'Hover over this button')
        ),
        m(Tooltip, { value: 'Bar' },
          m('span', 'or hover here')
        )
      )
    );
  }
};