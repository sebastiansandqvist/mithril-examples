import markup from '../../util/markup.js';

export default markup(
  '`m.request` is similar to the native `fetch` api,',
  'but adds automatic redrawing upon completion and',
  'converts the response to JSON. (It also allows for',
  'more advanced features like request cancellation',
  'and progress events.) For comparison, the following',
  'code is roughly equivalent to the first example,',
  'using the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)',
  'api instead:'
);
