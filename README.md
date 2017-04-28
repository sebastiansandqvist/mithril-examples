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
- Display only title/demo + button to reveal more in examples
- Navigation: [ Getting Started, Examples ]
- Server render everything but the demos

# Contributing

Install the firebase cli tools from npm in order to run the local server.

Run `npm start` to start the local server.
Run `npm run watch` to bundle the code and continue watching for incremental builds.
Run `npm run lint` and make sure there are no linting errors or warnings in your changes prior to making a pull request.

Since browser support for tab-spacing is poor, spaces (not tabs) should be used in all of the code for the examples on the website. This means any code within `src/examples/` should be indented with spaces. All code anywhere else should be indented using tabs.
