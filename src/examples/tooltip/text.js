import markup from '../../util/markup.js';

export default markup(
  'This tooltip implementation relies more on CSS than javascript,',
  'but mithril makes it easy to reuse the component. The code that',
  'defines the tooltip component just wraps arbitrary child components',
  '(in `vnode.children`) with the correct CSS class names, and allows',
  'the value of the tooltip to be dynamically set using `attrs.value`.'
);
