https://mithril-examples.firebaseapp.com/

# Ideas

- Applications: chat app
- Applications: calculator
- Request: loading indicator & error state
- Request: file upload progress (simulate)
- Request: m.jsonp
- Components: custom checkbox
- Components: collapser
- Components: notification (trigger with function)
- Components: SVG
- Components: slider
- Components: list filtering using input
- Components: debounced typing indicator
- Components: m.route.link

# Contributing

Run `npm start` to start the local server.
Run `npm run watch` to bundle the code and continue watching for incremental builds.
Run `npm run lint` and make sure there are no linting errors or warnings in your changes prior to making a pull request.

Since browser support for tab-spacing is poor, spaces (not tabs) should be used for indentation in the code example strings on the website. This means any code within `src/demos/**/code.js` should be indented with spaces. All code anywhere else should be indented with tabs.

To add an example, create a folder for it in `src/demos`. Within that folder, add three files: `code.js`, `demo.js`, and `text.js`. See the existing examples as a guide for what to export from those files. Next, in `src/examples/index.js`, add a new object to the exported array that follows the same schema as the existing examples. This schema is defined as follows in `src/views/MainView.js`:

```js
T.schema({
  title: T.string,
  demo: T.any, // a mithril component
  // tags must come from the existing tags defined in `src/examples/index.js`
  tags: T.arrayOf(T.schema({ name: T.string, url: T.string })),
  isOpen: T.bool,
  description: T.arrayOf(T.schema({
    text: T.any, // a string, array, anything that can be rendered by mithril
    demo: T.any, // a mithril component
    code: T.arrayOf(T.schema({ // tabs
      id: T.string,
      code: T.string
    })),
    noTabs: [T.bool, T.optional],
    fiddle: [T.string, T.optional] // a jsfiddle id
  }))
});
```

In use, it looks something like this:

```js
{
  title: 'To-do List',
  demo: todoDemo, // './demos/todo/demo.js'
  tags: [tag.closureComponent, tag.stream, tag.withAttr],
  isOpen: false,
  description: [
    {
      text: todoText, // './demos/todo/text.js'
      demo: todoDemo, // './demos/todo/demo.js',
      code: todoCode  // './demos/todo/code.js'
    }
  ]
}
```

When adding text descriptions for code examples in `src/examples/**/text.js`, you can use `src/util/markup.js` to help format the text. This provides a minimal markdown-like syntax for formatting links (`[title](url)`), code (``var x = 5``), and unordered lists (`* list item`).



# Todo

- Add jsfiddles to refactored examples
- Add jsx syntax to refactored examples
- Finish refactoring examples in `src/examples/old/...`
- Add `{ key: ??? }` to todo example?
- Allow filtering examples by tags
- Fix markup.js bug that requires todo/text.js to have ``dom`` on its own line
- Find better url for `tags.dom`
- Use async/await for cleaner morse code player
