import markup from '../../util/markup.js';

export default markup(
  'These examples use a simple convention for state management.',
  'Models are created via factory functions, and any methods that',
  'modify an instance of a model are defined in an `actions` object.',
  'This is completely optional. Some alternatives include:',
  '* Using `vnode.state` to keep track of model data',
  '* Using state management libraries (redux, mobx, etc.)'
);
