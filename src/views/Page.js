import m from 'mithril';
import T from 's-types';
import Nav from './Nav.js';

const pageType = T({ id: T.string });

function view({ attrs, children }) {

  pageType(attrs, 'Page');

  return (
    m('div',
      m('.Display',
        m('.Container',
          m('h1', 'Mithril.js examples'),
          m(Nav, { active: attrs.id })
        )
      ),
      m('.Content',
        m('.Container', children)
      ),
      m('.Footer',
        m('a.Footer-link[href=https://github.com/sebastiansandqvist/mithril-examples]', 'Contribute'),
        m('a.Footer-link[href=https://mithril.js.org]', 'Mithril.js.org'),
        m('a.Footer-link[href=https://github.com/MithrilJS/mithril.js]', 'Mithril Github'),
        m('a.Footer-link[href=https://gitter.im/lhorie/mithril.js]', 'Chat')
      )
    )
  );
}

const Page = {
  view,
};

export default Page;