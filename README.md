https://mithril-examples.firebaseapp.com/

# Ideas

- Applications: chat app
- Applications: calculator
- Request: loading indicator & error state
- Request: file upload progress (simulate)
- Components: custom checkbox
- Components: collapser
- Components: notification (trigger with function)
- Components: SVG
- Components: slider
- Components: list filtering using input
- Components: debounced typing indicator
- Components: m.route.link

# Todo

- Add jsfiddles to refactored examples
- Add jsx syntax to refactored examples
- Finish refactoring examples in `src/examples/old/...`

# Contributing

Run `npm start` to start the local server.
Run `npm run watch` to bundle the code and continue watching for incremental builds.
Run `npm run lint` and make sure there are no linting errors or warnings in your changes prior to making a pull request.

Since browser support for tab-spacing is poor, spaces (not tabs) should be used for indentation in all of the code for the examples on the website. This means any code within `src/demos/**/code.js` should be indented with spaces. All code anywhere else should be indented using tabs.

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