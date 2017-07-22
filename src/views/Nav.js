import m from 'mithril';
import T from 's-types';

const pages = [
  'Examples',
  'Getting started',
];

const linkType = T({
  page: T.string,
  active: T.string,
});

const Link = {
  view({ attrs }) {

    linkType(attrs, 'Link');

    return (
      m('a.Nav-link', {
        href: `/${attrs.page.replace(' ', '').toLowerCase()}`,
        oncreate: m.route.link,
        className: attrs.active === attrs.page ? 'active' : '',
      }, attrs.page)
    );
  },
};

const navType = T({ active: T.string });

function view({ attrs }) {

  navType(attrs, 'Nav');

  return (
    m('.Nav',
      pages.map((page) => m(Link, { page, active: attrs.active }))
    )
  );
}

const Nav = {
  view,
};

export default Nav;
