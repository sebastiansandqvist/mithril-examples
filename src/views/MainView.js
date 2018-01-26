import m from 'mithril';
import Tabs from './Tabs.js';
import T from 's-types';

const ExamplesType = T({
  examples: T.arrayOf(T.schema({
    title: T.string,
    demo: T.any, // a mithril component
    tags: T.arrayOf(T.schema({ name: T.string, url: T.string })),
    isOpen: T.bool,
    description: T.arrayOf(T.schema({
      text: T.any,
      demo: T.any, // a mithril component
      code: T.arrayOf(T.schema({ // tabs
        id: T.string,
        code: T.string
      })),
      noTabs: [T.bool, T.optional],
      fiddle: [T.string, T.optional]
    }))
  }))
});

function view({ attrs }) {

  ExamplesType(attrs, 'MainView');
  const examples = attrs.examples;

  return examples.map(function(example) {
    return (
      m('.Section', { key: example.title },
        m('.LeftContent',
          m('h2.Expander', {
            className: example.isOpen ? 'isOpen' : '',
            onclick() { example.isOpen = !example.isOpen; }
          },
          example.title,
          m('span.Subtitle', {
            className: example.isOpen ? 'fadeOut' : ''
          }, '[ View code ]')
          ),
          m('.Tags', example.tags.map((tag) => m('a.Tag', { href: tag.url, key: tag.name }, tag.name)))
        ),
        example.isOpen ? (
          m('.Description.clear',
            example.description.map(function(description) {
              return m('div.clear',
                m('p', description.text),
                m('.Demo',
                  m('.Demo-left',
                    m(Tabs, { tabs: description.code, noTabs: Boolean(description.noTabs), fiddle: description.fiddle })
                  ),
                  m('.Demo-right',
                    m('.Demo-result', m(description.demo))
                  )
                )
              );
            })
          )
        ) : (
          m('.RightContent',
            m('.Demo-result', m(example.demo))
          )
        )
      )
    );
  });
}

const MainView = {
  view
};

export default MainView;
