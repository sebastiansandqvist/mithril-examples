(function () {
'use strict';

function Vnode$1(tag, key, attrs, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs, children: children, text: text, dom: dom, domSize: undefined, state: {}, events: undefined, instance: undefined, skip: false}
}
Vnode$1.normalize = function(node) {
	if (node instanceof Array) { return Vnode$1("[", undefined, undefined, Vnode$1.normalizeChildren(node), undefined, undefined) }
	else if (node != null && typeof node !== "object") { return Vnode$1("#", undefined, undefined, node, undefined, undefined) }
	return node
};
Vnode$1.normalizeChildren = function normalizeChildren(children) {
	for (var i = 0; i < children.length; i++) {
		children[i] = Vnode$1.normalize(children[i]);
	}
	return children
};

var vnode = Vnode$1;

var Vnode = vnode;

var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
var selectorCache = {};
function hyperscript$1(selector) {
	var arguments$1 = arguments;

	if (selector == null || typeof selector !== "string" && selector.view == null) {
		throw Error("The selector must be either a string or a component.");
	}

	if (typeof selector === "string" && selectorCache[selector] === undefined) {
		var match, tag, classes = [], attributes = {};
		while (match = selectorParser.exec(selector)) {
			var type = match[1], value = match[2];
			if (type === "" && value !== "") { tag = value; }
			else if (type === "#") { attributes.id = value; }
			else if (type === ".") { classes.push(value); }
			else if (match[3][0] === "[") {
				var attrValue = match[6];
				if (attrValue) { attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\"); }
				attributes[match[4]] = attrValue || true;
			}
		}
		if (classes.length > 0) { attributes.className = classes.join(" "); }
		selectorCache[selector] = function(attrs, children) {
			var hasAttrs = false, childList, text;
			var className = attrs.className || attrs.class;
			for (var key in attributes) { attrs[key] = attributes[key]; }
			if (className !== undefined) {
				if (attrs.class !== undefined) {
					attrs.class = undefined;
					attrs.className = className;
				}
				if (attributes.className !== undefined) { attrs.className = attributes.className + " " + className; }
			}
			for (var key in attrs) {
				if (key !== "key") {
					hasAttrs = true;
					break
				}
			}
			if (children instanceof Array && children.length == 1 && children[0] != null && children[0].tag === "#") { text = children[0].children; }
			else { childList = children; }

			return Vnode(tag || "div", attrs.key, hasAttrs ? attrs : undefined, childList, text, undefined)
		};
	}
	var attrs, children, childrenIndex;
	if (arguments[1] == null || typeof arguments[1] === "object" && arguments[1].tag === undefined && !(arguments[1] instanceof Array)) {
		attrs = arguments[1];
		childrenIndex = 2;
	}
	else { childrenIndex = 1; }
	if (arguments.length === childrenIndex + 1) {
		children = arguments[childrenIndex] instanceof Array ? arguments[childrenIndex] : [arguments[childrenIndex]];
	}
	else {
		children = [];
		for (var i = childrenIndex; i < arguments.length; i++) { children.push(arguments$1[i]); }
	}

	if (typeof selector === "string") { return selectorCache[selector](attrs || {}, Vnode.normalizeChildren(children)) }

	return Vnode(selector, attrs && attrs.key, attrs || {}, Vnode.normalizeChildren(children), undefined, undefined)
}

var hyperscript_1$2 = hyperscript$1;

var Vnode$2 = vnode;

var trust = function(html) {
	return Vnode$2("<", undefined, undefined, html, undefined, undefined)
};

var Vnode$3 = vnode;

var fragment = function(attrs, children) {
	return Vnode$3("[", attrs.key, attrs, Vnode$3.normalizeChildren(children), undefined, undefined)
};

var hyperscript = hyperscript_1$2;

hyperscript.trust = trust;
hyperscript.fragment = fragment;

var hyperscript_1 = hyperscript;

var stream$2 = function(log) {
	var guid = 0, noop = function() {}, HALT = {};
	function createStream() {
		function stream() {
			if (arguments.length > 0 && arguments[0] !== HALT) { updateStream(stream, arguments[0], undefined); }
			return stream._state.value
		}
		initStream(stream);

		if (arguments.length > 0 && arguments[0] !== HALT) { updateStream(stream, arguments[0], undefined); }

		return stream
	}
	function initStream(stream) {
		stream.constructor = createStream;
		stream._state = {id: guid++, value: undefined, error: undefined, state: 0, derive: undefined, recover: undefined, deps: {}, parents: [], errorStream: undefined, endStream: undefined};
		stream.map = map, stream.ap = ap, stream.of = createStream;
		stream.valueOf = valueOf, stream.toJSON = toJSON, stream.toString = valueOf;
		stream.run = run, stream.catch = doCatch;

		Object.defineProperties(stream, {
			error: {get: function() {
				if (!stream._state.errorStream) {
					var errorStream = function() {
						if (arguments.length > 0 && arguments[0] !== HALT) { updateStream(stream, undefined, arguments[0]); }
						return stream._state.error
					};
					initStream(errorStream);
					initDependency(errorStream, [stream], noop, noop);
					stream._state.errorStream = errorStream;
				}
				return stream._state.errorStream
			}},
			end: {get: function() {
				if (!stream._state.endStream) {
					var endStream = createStream();
					endStream.map(function(value) {
						if (value === true) { unregisterStream(stream), unregisterStream(endStream); }
						return value
					});
					stream._state.endStream = endStream;
				}
				return stream._state.endStream
			}}
		});
	}
	function updateStream(stream, value, error) {
		updateState(stream, value, error);
		for (var id in stream._state.deps) { updateDependency(stream._state.deps[id], false); }
		finalize(stream);
	}
	function updateState(stream, value, error) {
		error = unwrapError(value, error);
		if (error !== undefined && typeof stream._state.recover === "function") {
			if (!resolve(stream, updateValues, true)) { return }
		}
		else { updateValues(stream, value, error); }
		stream._state.changed = true;
		if (stream._state.state !== 2) { stream._state.state = 1; }
	}
	function updateValues(stream, value, error) {
		stream._state.value = value;
		stream._state.error = error;
	}
	function updateDependency(stream, mustSync) {
		var state = stream._state, parents = state.parents;
		if (parents.length > 0 && parents.filter(active).length === parents.length && (mustSync || parents.filter(changed).length > 0)) {
			var failed = parents.filter(errored);
			if (failed.length > 0) { updateState(stream, undefined, failed[0]._state.error); }
			else { resolve(stream, updateState, false); }
		}
	}
	function resolve(stream, update, shouldRecover) {
		try {
			var value = shouldRecover ? stream._state.recover() : stream._state.derive();
			if (value === HALT) { return false }
			update(stream, value, undefined);
		}
		catch (e) {
			update(stream, undefined, e.__error != null ? e.__error : e);
			if (e.__error == null) { reportUncaughtError(stream, e); }
		}
		return true
	}
	function unwrapError(value, error) {
		if (value != null && value.constructor === createStream) {
			if (value._state.error !== undefined) { error = value._state.error; }
			else { error = unwrapError(value._state.value, value._state.error); }
		}
		return error
	}
	function finalize(stream) {
		stream._state.changed = false;
		for (var id in stream._state.deps) { stream._state.deps[id]._state.changed = false; }
	}
	function reportUncaughtError(stream, e) {
		if (Object.keys(stream._state.deps).length === 0) {
			setTimeout(function() {
				if (Object.keys(stream._state.deps).length === 0) { log(e); }
			}, 0);
		}
	}

	function run(fn) {
		var self = createStream(), stream = this;
		return initDependency(self, [stream], function() {
			return absorb(self, fn(stream()))
		}, undefined)
	}
	function doCatch(fn) {
		var self = createStream(), stream = this;
		var derive = function() {return stream._state.value};
		var recover = function() {return absorb(self, fn(stream._state.error))};
		return initDependency(self, [stream], derive, recover)
	}
	function combine(fn, streams) {
		if (streams.length > streams.filter(valid).length) { throw new Error("Ensure that each item passed to m.prop.combine/m.prop.merge is a stream") }
		return initDependency(createStream(), streams, function() {
			var failed = streams.filter(errored);
			if (failed.length > 0) { throw {__error: failed[0]._state.error} }
			return fn.apply(this, streams.concat([streams.filter(changed)]))
		}, undefined)
	}
	function absorb(stream, value) {
		if (value != null && value.constructor === createStream) {
			var absorbable = value;
			var update = function() {
				updateState(stream, absorbable._state.value, absorbable._state.error);
				for (var id in stream._state.deps) { updateDependency(stream._state.deps[id], false); }
			};
			absorbable.map(update).catch(function(e) {
				update();
				throw {__error: e}
			});
			
			if (absorbable._state.state === 0) { return HALT }
			if (absorbable._state.error) { throw {__error: absorbable._state.error} }
			value = absorbable._state.value;
		}
		return value
	}

	function initDependency(dep, streams, derive, recover) {
		var state = dep._state;
		state.derive = derive;
		state.recover = recover;
		state.parents = streams.filter(notEnded);

		registerDependency(dep, state.parents);
		updateDependency(dep, true);

		return dep
	}
	function registerDependency(stream, parents) {
		for (var i = 0; i < parents.length; i++) {
			parents[i]._state.deps[stream._state.id] = stream;
			registerDependency(stream, parents[i]._state.parents);
		}
	}
	function unregisterStream(stream) {
		for (var i = 0; i < stream._state.parents.length; i++) {
			var parent = stream._state.parents[i];
			delete parent._state.deps[stream._state.id];
		}
		for (var id in stream._state.deps) {
			var dependent = stream._state.deps[id];
			var index = dependent._state.parents.indexOf(stream);
			if (index > -1) { dependent._state.parents.splice(index, 1); }
		}
		stream._state.state = 2; //ended
		stream._state.deps = {};
	}

	function map(fn) {return combine(function(stream) {return fn(stream())}, [this])}
	function ap(stream) {return combine(function(s1, s2) {return s1()(s2())}, [this, stream])}
	function valueOf() {return this._state.value}
	function toJSON() {return this._state.value != null && typeof this._state.value.toJSON === "function" ? this._state.value.toJSON() : this._state.value}

	function valid(stream) {return stream._state }
	function active(stream) {return stream._state.state === 1}
	function changed(stream) {return stream._state.changed}
	function notEnded(stream) {return stream._state.state !== 2}
	function errored(stream) {return stream._state.error}

	function reject(e) {
		var stream = createStream();
		stream.error(e);
		return stream
	}

	function merge(streams) {
		return combine(function () {
			return streams.map(function(s) {return s()})
		}, streams)
	}
	createStream.merge = merge;
	createStream.combine = combine;
	createStream.reject = reject;
	createStream.HALT = HALT;

	return createStream
};

var stream = stream$2(console.log.bind(console));

var build = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") { return "" }

	var args = [];
	for (var key in object) {
		destructure(key, object[key]);
	}
	return args.join("&")

	function destructure(key, value) {
		if (value instanceof Array) {
			for (var i = 0; i < value.length; i++) {
				destructure(key + "[" + i + "]", value[i]);
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key + "[" + i + "]", value[i]);
			}
		}
		else { args.push(encodeURIComponent(key) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : "")); }
	}
};

var buildQueryString = build;

var request$2 = function($window, Stream) {
	var callbackCount = 0;

	var oncompletion;
	function setCompletionCallback(callback) {oncompletion = callback;}
	
	function request(args) {
		var stream = Stream();
		if (args.initialValue !== undefined) { stream(args.initialValue); }
		
		var useBody = typeof args.useBody === "boolean" ? args.useBody : args.method !== "GET" && args.method !== "TRACE";
		
		if (typeof args.serialize !== "function") { args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify; }
		if (typeof args.deserialize !== "function") { args.deserialize = deserialize; }
		if (typeof args.extract !== "function") { args.extract = extract; }
		
		args.url = interpolate(args.url, args.data);
		if (useBody) { args.data = args.serialize(args.data); }
		else { args.url = assemble(args.url, args.data); }
		
		var xhr = new $window.XMLHttpRequest();
		xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined);
		
		if (args.serialize === JSON.stringify && useBody) {
			xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		}
		if (args.deserialize === deserialize) {
			xhr.setRequestHeader("Accept", "application/json, text/*");
		}
		
		if (typeof args.config === "function") { xhr = args.config(xhr, args) || xhr; }
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				try {
					var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args));
					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
						stream(cast(args.type, response));
					}
					else {
						var error = new Error(xhr.responseText);
						for (var key in response) { error[key] = response[key]; }
						stream.error(error);
					}
				}
				catch (e) {
					stream.error(e);
				}
				if (typeof oncompletion === "function") { oncompletion(); }
			}
		};
		
		if (useBody) { xhr.send(args.data); }
		else { xhr.send(); }
		
		return stream
	}

	function jsonp(args) {
		var stream = Stream();
		if (args.initialValue !== undefined) { stream(args.initialValue); }
		
		var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++;
		var script = $window.document.createElement("script");
		$window[callbackName] = function(data) {
			script.parentNode.removeChild(script);
			stream(cast(args.type, data));
			if (typeof oncompletion === "function") { oncompletion(); }
			delete $window[callbackName];
		};
		script.onerror = function() {
			script.parentNode.removeChild(script);
			stream.error(new Error("JSONP request failed"));
			if (typeof oncompletion === "function") { oncompletion(); }
			delete $window[callbackName];
		};
		if (args.data == null) { args.data = {}; }
		args.url = interpolate(args.url, args.data);
		args.data[args.callbackKey || "callback"] = callbackName;
		script.src = assemble(args.url, args.data);
		$window.document.documentElement.appendChild(script);
		return stream
	}

	function interpolate(url, data) {
		if (data == null) { return url }

		var tokens = url.match(/:[^\/]+/gi) || [];
		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i].slice(1);
			if (data[key] != null) {
				url = url.replace(tokens[i], data[key]);
				delete data[key];
			}
		}
		return url
	}

	function assemble(url, data) {
		var querystring = buildQueryString(data);
		if (querystring !== "") {
			var prefix = url.indexOf("?") < 0 ? "?" : "&";
			url += prefix + querystring;
		}
		return url
	}

	function deserialize(data) {
		try {return data !== "" ? JSON.parse(data) : null}
		catch (e) {throw new Error(data)}
	}

	function extract(xhr) {return xhr.responseText}
	
	function cast(type, data) {
		if (typeof type === "function") {
			if (data instanceof Array) {
				for (var i = 0; i < data.length; i++) {
					data[i] = new type(data[i]);
				}
			}
			else { return new type(data) }
		}
		return data
	}
	
	return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
};

var Stream = stream;
var request = request$2(window, Stream);

var pubsub = function() {
	var callbacks = [];
	function unsubscribe(callback) {
		var index = callbacks.indexOf(callback);
		if (index > -1) { callbacks.splice(index, 1); }
	}
    function publish() {
        var arguments$1 = arguments;
        var this$1 = this;

        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i].apply(this$1, arguments$1);
        }
    }
	return {subscribe: callbacks.push.bind(callbacks), unsubscribe: unsubscribe, publish: publish}
};

var redraw = pubsub();

var Vnode$4 = vnode;

var render$2 = function($window) {
	var $doc = $window.document;
	var $emptyFragment = $doc.createDocumentFragment();

	var onevent;
	function setEventCallback(callback) {return onevent = callback}

	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode$$1 = vnodes[i];
			if (vnode$$1 != null) {
				insertNode(parent, createNode(vnode$$1, hooks, ns), nextSibling);
			}
		}
	}
	function createNode(vnode$$1, hooks, ns) {
		var tag = vnode$$1.tag;
		if (vnode$$1.attrs != null) { initLifecycle(vnode$$1.attrs, vnode$$1, hooks); }
		if (typeof tag === "string") {
			switch (tag) {
				case "#": return createText(vnode$$1)
				case "<": return createHTML(vnode$$1)
				case "[": return createFragment(vnode$$1, hooks, ns)
				default: return createElement(vnode$$1, hooks, ns)
			}
		}
		else { return createComponent(vnode$$1, hooks, ns) }
	}
	function createText(vnode$$1) {
		return vnode$$1.dom = $doc.createTextNode(vnode$$1.children)
	}
	function createHTML(vnode$$1) {
		var match = vnode$$1.children.match(/^\s*?<(\w+)/im) || [];
		var parent = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match[1]] || "div";
		var temp = $doc.createElement(parent);

		temp.innerHTML = vnode$$1.children;
		vnode$$1.dom = temp.firstChild;
		vnode$$1.domSize = temp.childNodes.length;
		var fragment = $doc.createDocumentFragment();
		var child;
		while (child = temp.firstChild) {
			fragment.appendChild(child);
		}
		return fragment
	}
	function createFragment(vnode$$1, hooks, ns) {
		var fragment = $doc.createDocumentFragment();
		if (vnode$$1.children != null) {
			var children = vnode$$1.children;
			createNodes(fragment, children, 0, children.length, hooks, null, ns);
		}
		vnode$$1.dom = fragment.firstChild;
		vnode$$1.domSize = fragment.childNodes.length;
		return fragment
	}
	function createElement(vnode$$1, hooks, ns) {
		var tag = vnode$$1.tag;
		switch (vnode$$1.tag) {
			case "svg": ns = "http://www.w3.org/2000/svg"; break
			case "math": ns = "http://www.w3.org/1998/Math/MathML"; break
		}

		var attrs = vnode$$1.attrs;
		var is = attrs && attrs.is;

		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag);
		vnode$$1.dom = element;

		if (attrs != null) {
			setAttrs(vnode$$1, attrs, ns);
		}

		if (vnode$$1.text != null) {
			if (vnode$$1.text !== "") { element.textContent = vnode$$1.text; }
			else { vnode$$1.children = [Vnode$4("#", undefined, undefined, vnode$$1.text, undefined, undefined)]; }
		}

		if (vnode$$1.children != null) {
			var children = vnode$$1.children;
			createNodes(element, children, 0, children.length, hooks, null, ns);
			setLateAttrs(vnode$$1);
		}
		return element
	}
	function createComponent(vnode$$1, hooks, ns) {
		// For object literals since `Vnode()` always sets the `state` field.
		if (!vnode$$1.state) { vnode$$1.state = {}; }
		assign(vnode$$1.state, vnode$$1.tag);

		initLifecycle(vnode$$1.tag, vnode$$1, hooks);
		vnode$$1.instance = Vnode$4.normalize(vnode$$1.tag.view.call(vnode$$1.state, vnode$$1));
		if (vnode$$1.instance != null) {
			if (vnode$$1.instance === vnode$$1) { throw Error("A view cannot return the vnode it received as arguments") }
			var element = createNode(vnode$$1.instance, hooks, ns);
			vnode$$1.dom = vnode$$1.instance.dom;
			vnode$$1.domSize = vnode$$1.dom != null ? vnode$$1.instance.domSize : 0;
			return element
		}
		else {
			vnode$$1.domSize = 0;
			return $emptyFragment
		}
	}

	//update
	function updateNodes(parent, old, vnodes, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) { return }
		else if (old == null) { createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, undefined); }
		else if (vnodes == null) { removeNodes(parent, old, 0, old.length, vnodes); }
		else {
			var recycling = isRecyclable(old, vnodes);
			if (recycling) { old = old.concat(old.pool); }

			if (old.length === vnodes.length && vnodes[0] != null && vnodes[0].key == null) {
				for (var i = 0; i < old.length; i++) {
					if (old[i] === vnodes[i] || old[i] == null && vnodes[i] == null) { continue }
					else if (old[i] == null) { insertNode(parent, createNode(vnodes[i], hooks, ns), getNextSibling(old, i + 1, nextSibling)); }
					else if (vnodes[i] == null) { removeNodes(parent, old, i, i + 1, vnodes); }
					else { updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns); }
					if (recycling && old[i].tag === vnodes[i].tag) { insertNode(parent, toFragment(old[i]), getNextSibling(old, i + 1, nextSibling)); }
				}
			}
			else {
				var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map;
				while (oldEnd >= oldStart && end >= start) {
					var o = old[oldStart], v = vnodes[start];
					if (o === v && !recycling) { oldStart++, start++; }
					else if (o != null && v != null && o.key === v.key) {
						oldStart++, start++;
						updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), recycling, ns);
						if (recycling && o.tag === v.tag) { insertNode(parent, toFragment(o), nextSibling); }
					}
					else {
						var o = old[oldEnd];
						if (o === v && !recycling) { oldEnd--, start++; }
						else if (o != null && v != null && o.key === v.key) {
							updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns);
							if (recycling || start < end) { insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling)); }
							oldEnd--, start++;
						}
						else { break }
					}
				}
				while (oldEnd >= oldStart && end >= start) {
					var o = old[oldEnd], v = vnodes[end];
					if (o === v && !recycling) { oldEnd--, end--; }
					else if (o != null && v != null && o.key === v.key) {
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns);
						if (recycling && o.tag === v.tag) { insertNode(parent, toFragment(o), nextSibling); }
						if (o.dom != null) { nextSibling = o.dom; }
						oldEnd--, end--;
					}
					else {
						if (!map) { map = getKeyMap(old, oldEnd); }
						if (v != null) {
							var oldIndex = map[v.key];
							if (oldIndex != null) {
								var movable = old[oldIndex];
								updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns);
								insertNode(parent, toFragment(movable), nextSibling);
								old[oldIndex].skip = true;
								if (movable.dom != null) { nextSibling = movable.dom; }
							}
							else {
								var dom = createNode(v, hooks, undefined);
								insertNode(parent, dom, nextSibling);
								nextSibling = dom;
							}
						}
						end--;
					}
					if (end < start) { break }
				}
				createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);
				removeNodes(parent, old, oldStart, oldEnd + 1, vnodes);
			}
		}
	}
	function updateNode(parent, old, vnode$$1, hooks, nextSibling, recycling, ns) {
		var oldTag = old.tag, tag = vnode$$1.tag;
		if (oldTag === tag) {
			vnode$$1.state = old.state;
			vnode$$1.events = old.events;
			if (shouldUpdate(vnode$$1, old)) { return }
			if (vnode$$1.attrs != null) {
				updateLifecycle(vnode$$1.attrs, vnode$$1, hooks, recycling);
			}
			if (typeof oldTag === "string") {
				switch (oldTag) {
					case "#": updateText(old, vnode$$1); break
					case "<": updateHTML(parent, old, vnode$$1, nextSibling); break
					case "[": updateFragment(parent, old, vnode$$1, hooks, nextSibling, ns); break
					default: updateElement(old, vnode$$1, hooks, ns);
				}
			}
			else { updateComponent(parent, old, vnode$$1, hooks, nextSibling, recycling, ns); }
		}
		else {
			removeNode(parent, old, null);
			insertNode(parent, createNode(vnode$$1, hooks, undefined), nextSibling);
		}
	}
	function updateText(old, vnode$$1) {
		if (old.children.toString() !== vnode$$1.children.toString()) {
			old.dom.nodeValue = vnode$$1.children;
		}
		vnode$$1.dom = old.dom;
	}
	function updateHTML(parent, old, vnode$$1, nextSibling) {
		if (old.children !== vnode$$1.children) {
			toFragment(old);
			insertNode(parent, createHTML(vnode$$1), nextSibling);
		}
		else { vnode$$1.dom = old.dom, vnode$$1.domSize = old.domSize; }
	}
	function updateFragment(parent, old, vnode$$1, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode$$1.children, hooks, nextSibling, ns);
		var domSize = 0, children = vnode$$1.children;
		vnode$$1.dom = null;
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				if (child != null && child.dom != null) {
					if (vnode$$1.dom == null) { vnode$$1.dom = child.dom; }
					domSize += child.domSize || 1;
				}
			}
			if (domSize !== 1) { vnode$$1.domSize = domSize; }
		}
	}
	function updateElement(old, vnode$$1, hooks, ns) {
		var element = vnode$$1.dom = old.dom;
		switch (vnode$$1.tag) {
			case "svg": ns = "http://www.w3.org/2000/svg"; break
			case "math": ns = "http://www.w3.org/1998/Math/MathML"; break
		}
		if (vnode$$1.tag === "textarea") {
			if (vnode$$1.attrs == null) { vnode$$1.attrs = {}; }
			if (vnode$$1.text != null) { vnode$$1.attrs.value = vnode$$1.text; } //FIXME handle multiple children
		}
		updateAttrs(vnode$$1, old.attrs, vnode$$1.attrs, ns);
		if (old.text != null && vnode$$1.text != null && vnode$$1.text !== "") {
			if (old.text.toString() !== vnode$$1.text.toString()) { old.dom.firstChild.nodeValue = vnode$$1.text; }
		}
		else {
			if (old.text != null) { old.children = [Vnode$4("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]; }
			if (vnode$$1.text != null) { vnode$$1.children = [Vnode$4("#", undefined, undefined, vnode$$1.text, undefined, undefined)]; }
			updateNodes(element, old.children, vnode$$1.children, hooks, null, ns);
		}
	}
	function updateComponent(parent, old, vnode$$1, hooks, nextSibling, recycling, ns) {
		vnode$$1.instance = Vnode$4.normalize(vnode$$1.tag.view.call(vnode$$1.state, vnode$$1));
		updateLifecycle(vnode$$1.tag, vnode$$1, hooks, recycling);
		if (vnode$$1.instance != null) {
			if (old.instance == null) { insertNode(parent, createNode(vnode$$1.instance, hooks, ns), nextSibling); }
			else { updateNode(parent, old.instance, vnode$$1.instance, hooks, nextSibling, recycling, ns); }
			vnode$$1.dom = vnode$$1.instance.dom;
			vnode$$1.domSize = vnode$$1.instance.domSize;
		}
		else if (old.instance != null) {
			removeNode(parent, old.instance, null);
			vnode$$1.dom = undefined;
			vnode$$1.domSize = 0;
		}
		else {
			vnode$$1.dom = old.dom;
			vnode$$1.domSize = old.domSize;
		}
	}
	function isRecyclable(old, vnodes) {
		if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
			var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0;
			var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0;
			var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0;
			if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
				return true
			}
		}
		return false
	}
	function getKeyMap(vnodes, end) {
		var map = {}, i = 0;
		for (var i = 0; i < end; i++) {
			var vnode$$1 = vnodes[i];
			if (vnode$$1 != null) {
				var key = vnode$$1.key;
				if (key != null) { map[key] = i; }
			}
		}
		return map
	}
	function toFragment(vnode$$1) {
		var count = vnode$$1.domSize;
		if (count != null || vnode$$1.dom == null) {
			var fragment = $doc.createDocumentFragment();
			if (count > 0) {
				var dom = vnode$$1.dom;
				while (--count) { fragment.appendChild(dom.nextSibling); }
				fragment.insertBefore(dom, fragment.firstChild);
			}
			return fragment
		}
		else { return vnode$$1.dom }
	}
	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) { return vnodes[i].dom }
		}
		return nextSibling
	}

	function insertNode(parent, dom, nextSibling) {
		if (nextSibling && nextSibling.parentNode) { parent.insertBefore(dom, nextSibling); }
		else { parent.appendChild(dom); }
	}

	//remove
	function removeNodes(parent, vnodes, start, end, context) {
		for (var i = start; i < end; i++) {
			var vnode$$1 = vnodes[i];
			if (vnode$$1 != null) {
				if (vnode$$1.skip) { vnode$$1.skip = false; }
				else { removeNode(parent, vnode$$1, context); }
			}
		}
	}
	function once(f) {
		var called = false;
		return function() {
			if (!called) {
				called = true;
				f();
			}
		}
	}
	function removeNode(parent, vnode$$1, context) {
		var expected = 1, called = 0;
		if (vnode$$1.attrs && vnode$$1.attrs.onbeforeremove) {
			expected++;
			vnode$$1.attrs.onbeforeremove.call(vnode$$1.state, vnode$$1, once(continuation));
		}
		if (typeof vnode$$1.tag !== "string" && vnode$$1.tag.onbeforeremove) {
			expected++;
			vnode$$1.tag.onbeforeremove.call(vnode$$1.state, vnode$$1, once(continuation));
		}
		continuation();
		function continuation() {
			if (++called === expected) {
				onremove(vnode$$1);
				if (vnode$$1.dom) {
					var count = vnode$$1.domSize || 1;
					if (count > 1) {
						var dom = vnode$$1.dom;
						while (--count) {
							parent.removeChild(dom.nextSibling);
						}
					}
					if (vnode$$1.dom.parentNode != null) { parent.removeChild(vnode$$1.dom); }
					if (context != null && vnode$$1.domSize == null && !hasIntegrationMethods(vnode$$1.attrs) && typeof vnode$$1.tag === "string") { //TODO test custom elements
						if (!context.pool) { context.pool = [vnode$$1]; }
						else { context.pool.push(vnode$$1); }
					}
				}
			}
		}
	}
	function onremove(vnode$$1) {
		if (vnode$$1.attrs && vnode$$1.attrs.onremove) { vnode$$1.attrs.onremove.call(vnode$$1.state, vnode$$1); }
		if (typeof vnode$$1.tag !== "string" && vnode$$1.tag.onremove) { vnode$$1.tag.onremove.call(vnode$$1.state, vnode$$1); }
		if (vnode$$1.instance != null) { onremove(vnode$$1.instance); }
		else {
			var children = vnode$$1.children;
			if (children instanceof Array) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i];
					if (child != null) { onremove(child); }
				}
			}
		}
	}

	//attrs
	function setAttrs(vnode$$1, attrs, ns) {
		for (var key in attrs) {
			setAttr(vnode$$1, key, null, attrs[key], ns);
		}
	}
	function setAttr(vnode$$1, key, old, value, ns) {
		var element = vnode$$1.dom;
		if (key === "key" || (old === value && !isFormAttribute(vnode$$1, key)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key)) { return }
		var nsLastIndex = key.indexOf(":");
		if (nsLastIndex > -1 && key.substr(0, nsLastIndex) === "xlink") {
			element.setAttributeNS("http://www.w3.org/1999/xlink", key.slice(nsLastIndex + 1), value);
		}
		else if (key[0] === "o" && key[1] === "n" && typeof value === "function") { updateEvent(vnode$$1, key, value); }
		else if (key === "style") { updateStyle(element, old, value); }
		else if (key in element && !isAttribute(key) && ns === undefined) {
			//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
			if (vnode$$1.tag === "input" && key === "value" && vnode$$1.dom.value === value && vnode$$1.dom === $doc.activeElement) { return }
			element[key] = value;
		}
		else {
			if (typeof value === "boolean") {
				if (value) { element.setAttribute(key, ""); }
				else { element.removeAttribute(key); }
			}
			else { element.setAttribute(key === "className" ? "class" : key, value); }
		}
	}
	function setLateAttrs(vnode$$1) {
		var attrs = vnode$$1.attrs;
		if (vnode$$1.tag === "select" && attrs != null) {
			if ("value" in attrs) { setAttr(vnode$$1, "value", null, attrs.value, undefined); }
			if ("selectedIndex" in attrs) { setAttr(vnode$$1, "selectedIndex", null, attrs.selectedIndex, undefined); }
		}
	}
	function updateAttrs(vnode$$1, old, attrs, ns) {
		if (attrs != null) {
			for (var key in attrs) {
				setAttr(vnode$$1, key, old && old[key], attrs[key], ns);
			}
		}
		if (old != null) {
			for (var key in old) {
				if (attrs == null || !(key in attrs)) {
					if (key === "className") { key = "class"; }
					if (key[0] === "o" && key[1] === "n" && !isLifecycleMethod(key)) { updateEvent(vnode$$1, key, undefined); }
					else if (key !== "key") { vnode$$1.dom.removeAttribute(key); }
				}
			}
		}
	}
	function isFormAttribute(vnode$$1, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode$$1.dom === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function isAttribute(attr) {
		return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
	}
	function hasIntegrationMethods(source) {
		return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
	}

	//style
	function updateStyle(element, old, style) {
		if (old === style) { element.style.cssText = "", old = null; }
		if (style == null) { element.style.cssText = ""; }
		else if (typeof style === "string") { element.style.cssText = style; }
		else {
			if (typeof old === "string") { element.style.cssText = ""; }
			for (var key in style) {
				element.style[key] = style[key];
			}
			if (old != null && typeof old !== "string") {
				for (var key in old) {
					if (!(key in style)) { element.style[key] = ""; }
				}
			}
		}
	}

	//event
	function updateEvent(vnode$$1, key, value) {
		var element = vnode$$1.dom;
		var callback = function(e) {
			var result = value.call(element, e);
			if (typeof onevent === "function") { onevent.call(element, e); }
			return result
		};
		if (key in element) { element[key] = callback; }
		else {
			var eventName = key.slice(2);
			if (vnode$$1.events === undefined) { vnode$$1.events = {}; }
			if (vnode$$1.events[key] != null) { element.removeEventListener(eventName, vnode$$1.events[key], false); }
			if (typeof value === "function") {
				vnode$$1.events[key] = callback;
				element.addEventListener(eventName, vnode$$1.events[key], false);
			}
		}
	}

	//lifecycle
	function initLifecycle(source, vnode$$1, hooks) {
		if (typeof source.oninit === "function") { source.oninit.call(vnode$$1.state, vnode$$1); }
		if (typeof source.oncreate === "function") { hooks.push(source.oncreate.bind(vnode$$1.state, vnode$$1)); }
	}
	function updateLifecycle(source, vnode$$1, hooks, recycling) {
		if (recycling) { initLifecycle(source, vnode$$1, hooks); }
		else if (typeof source.onupdate === "function") { hooks.push(source.onupdate.bind(vnode$$1.state, vnode$$1)); }
	}
	function shouldUpdate(vnode$$1, old) {
		var forceVnodeUpdate, forceComponentUpdate;
		if (vnode$$1.attrs != null && typeof vnode$$1.attrs.onbeforeupdate === "function") { forceVnodeUpdate = vnode$$1.attrs.onbeforeupdate.call(vnode$$1.state, vnode$$1, old); }
		if (typeof vnode$$1.tag !== "string" && typeof vnode$$1.tag.onbeforeupdate === "function") { forceComponentUpdate = vnode$$1.tag.onbeforeupdate.call(vnode$$1.state, vnode$$1, old); }
		if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
			vnode$$1.dom = old.dom;
			vnode$$1.domSize = old.domSize;
			vnode$$1.instance = old.instance;
			return true
		}
		return false
	}

	function assign(target, source) {
		Object.keys(source).forEach(function(k){target[k] = source[k];});
	}

	function render(dom, vnodes) {
		if (!dom) { throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.") }
		var hooks = [];
		var active = $doc.activeElement;

		// First time rendering into a node clears it out
		if (dom.vnodes == null) { dom.textContent = ""; }

		if (!(vnodes instanceof Array)) { vnodes = [vnodes]; }
		updateNodes(dom, dom.vnodes, Vnode$4.normalizeChildren(vnodes), hooks, null, undefined);
		dom.vnodes = vnodes;
		for (var i = 0; i < hooks.length; i++) { hooks[i](); }
		if ($doc.activeElement !== active) { active.focus(); }
	}

	return {render: render, setEventCallback: setEventCallback}
};

var render = render$2(window);

var throttle$1 = function(callback) {
	//60fps translates to 16.6ms, round it down since setTimeout requires int
	var time = 16;
	var last = 0, pending = null;
	var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout;
	return function(synchronous) {
		var now = Date.now();
		if (synchronous === true || last === 0 || now - last >= time) {
			last = now;
			callback();
		}
		else if (pending === null) {
			pending = timeout(function() {
				pending = null;
				callback();
				last = Date.now();
			}, time - (now - last));
		}
	}
};

var throttle = throttle$1;

var autoredraw$1 = function(root, renderer, pubsub, callback) {
	var run = throttle(callback);
	if (renderer != null) {
		renderer.setEventCallback(function(e) {
			if (e.redraw !== false) { pubsub.publish(); }
		});
	}

	if (pubsub != null) {
		if (root.redraw) { pubsub.unsubscribe(root.redraw); }
		pubsub.subscribe(run);
	}

	return root.redraw = run
};

var Vnode$5 = vnode;
var autoredraw = autoredraw$1;

var mount$2 = function(renderer, pubsub) {
	return function(root, component) {
		if (component === null) {
			renderer.render(root, []);
			pubsub.unsubscribe(root.redraw);
			delete root.redraw;
			return
		}

		var run = autoredraw(root, renderer, pubsub, function() {
			renderer.render(
				root,
				Vnode$5(component, undefined, undefined, undefined, undefined, undefined)
			);
		});

		run();
	}
};

var renderService = render;
var redrawService$1 = redraw;

var mount = mount$2(renderService, redrawService$1);

var parse = function(string) {
	if (string === "" || string == null) { return {} }
	if (string.charAt(0) === "?") { string = string.slice(1); }

	var entries = string.split("&"), data = {}, counters = {};
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=");
		var key = decodeURIComponent(entry[0]);
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : "";

		//TODO refactor out
		var number = Number(value);
		if (value !== "" && !isNaN(number) || value === "NaN") { value = number; }
		else if (value === "true") { value = true; }
		else if (value === "false") { value = false; }

		var levels = key.split(/\]\[?|\[/);
		var cursor = data;
		if (key.indexOf("[") > -1) { levels.pop(); }
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1];
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10));
			var isValue = j === levels.length - 1;
			if (level === "") {
				var key = levels.slice(0, j).join();
				if (counters[key] == null) { counters[key] = 0; }
				level = counters[key]++;
			}
			if (cursor[level] == null) {
				cursor[level] = isValue ? value : isNumber ? [] : {};
			}
			cursor = cursor[level];
		}
	}
	return data
};

var buildQueryString$1 = build;
var parseQueryString = parse;

var router$2 = function($window) {
	var supportsPushState = typeof $window.history.pushState === "function";
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout;

	var prefix = "#!";
	function setPrefix(value) {prefix = value;}

	function normalize(fragment) {
		var data = $window.location[fragment].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent);
		if (fragment === "pathname" && data[0] !== "/") { data = "/" + data; }
		return data
	}

	var asyncId;
	function debounceAsync(f) {
		return function() {
			if (asyncId != null) { return }
			asyncId = callAsync(function() {
				asyncId = null;
				f();
			});

		}
	}

	function parsePath(path, queryData, hashData) {
		var queryIndex = path.indexOf("?");
		var hashIndex = path.indexOf("#");
		var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length;
		if (queryIndex > -1) {
			var queryEnd = hashIndex > -1 ? hashIndex : path.length;
			var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd));
			for (var key in queryParams) { queryData[key] = queryParams[key]; }
		}
		if (hashIndex > -1) {
			var hashParams = parseQueryString(path.slice(hashIndex + 1));
			for (var key in hashParams) { hashData[key] = hashParams[key]; }
		}
		return path.slice(0, pathEnd)
	}

	function getPath() {
		var type = prefix.charAt(0);
		switch (type) {
			case "#": return normalize("hash").slice(prefix.length)
			case "?": return normalize("search").slice(prefix.length) + normalize("hash")
			default: return normalize("pathname").slice(prefix.length) + normalize("search") + normalize("hash")
		}
	}

	function setPath(path, data, options) {
		var queryData = {}, hashData = {};
		path = parsePath(path, queryData, hashData);
		if (data != null) {
			for (var key in data) { queryData[key] = data[key]; }
			path = path.replace(/:([^\/]+)/g, function(match, token) {
				delete queryData[token];
				return data[token]
			});
		}

		var query = buildQueryString$1(queryData);
		if (query) { path += "?" + query; }

		var hash = buildQueryString$1(hashData);
		if (hash) { path += "#" + hash; }

		if (supportsPushState) {
			if (options && options.replace) { $window.history.replaceState(null, null, prefix + path); }
			else { $window.history.pushState(null, null, prefix + path); }
			$window.onpopstate();
		}
		else { $window.location.href = prefix + path; }
	}

	function defineRoutes(routes, resolve, reject) {
		if (supportsPushState) { $window.onpopstate = debounceAsync(resolveRoute); }
		else if (prefix.charAt(0) === "#") { $window.onhashchange = resolveRoute; }
		resolveRoute();
		
		function resolveRoute() {
			var path = getPath();
			var params = {};
			var pathname = parsePath(path, params, params);
			
			for (var route in routes) {
				var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

				if (matcher.test(pathname)) {
					pathname.replace(matcher, function() {
						var keys = route.match(/:[^\/]+/g) || [];
						var values = [].slice.call(arguments, 1, -2);
						for (var i = 0; i < keys.length; i++) {
							params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i]);
						}
						resolve(routes[route], params, path, route);
					});
					return
				}
			}

			reject(path, params);
		}
		return resolveRoute
	}

	function link(vnode) {
		vnode.dom.setAttribute("href", prefix + vnode.attrs.href);
		vnode.dom.onclick = function(e) {
			e.preventDefault();
			e.redraw = false;
			var href = this.getAttribute("href");
			if (href.indexOf(prefix) === 0) { href = href.slice(prefix.length); }
			setPath(href, undefined, undefined);
		};
	}

	return {setPrefix: setPrefix, getPath: getPath, setPath: setPath, defineRoutes: defineRoutes, link: link}
};

var Vnode$6 = vnode;
var coreRouter = router$2;

var router = function($window, mount) {
	var router = coreRouter($window);
	var currentResolve, currentComponent, currentRender, currentArgs, currentPath;

	var RouteComponent = {view: function() {
		return [currentRender(Vnode$6(currentComponent, null, currentArgs, undefined, undefined, undefined))]
	}};
	function defaultRender(vnode$$1) {
		return vnode$$1
	}
	var route = function(root, defaultRoute, routes) {
		currentComponent = "div";
		currentRender = defaultRender;
		currentArgs = null;

		mount(root, RouteComponent);

		router.defineRoutes(routes, function(payload, args, path) {
			var isResolver = typeof payload.view !== "function";
			var render = defaultRender;

			var resolve = currentResolve = function (component) {
				if (resolve !== currentResolve) { return }
				currentResolve = null;

				currentComponent = component != null ? component : isResolver ? "div" : payload;
				currentRender = render;
				currentArgs = args;
				currentPath = path;

				root.redraw(true);
			};
			var onmatch = function() {
				resolve();
			};
			if (isResolver) {
				if (typeof payload.render === "function") { render = payload.render.bind(payload); }
				if (typeof payload.onmatch === "function") { onmatch = payload.onmatch; }
			}
		
			onmatch.call(payload, resolve, args, path);
		}, function() {
			router.setPath(defaultRoute, null, {replace: true});
		});
	};
	route.link = router.link;
	route.prefix = router.setPrefix;
	route.set = router.setPath;
	route.get = function() {return currentPath};

	return route
};

var mount$4 = mount;

var route = router(window, mount$4);

var withAttr = function(attrName, callback, context) {
	return function(e) {
		return callback.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
	}
};

var m = hyperscript_1;
var requestService = request;
var redrawService = redraw;

requestService.setCompletionCallback(redrawService.publish);

m.mount = mount;
m.route = route;
m.withAttr = withAttr;
m.prop = stream;
m.render = render.render;
m.redraw = redrawService.publish;
m.request = requestService.request;
m.jsonp = requestService.jsonp;
m.parseQueryString = parse;
m.buildQueryString = build;
m.version = "bleeding-edge";

var index = m;

var pages = [
	'Getting started',
	'Components',
	'Requests',
	'Applications',
	'Routing'
];

var Link = {
	view: function view$1(ref) {
		var attrs = ref.attrs;

		return (
			index('a.Nav-link', {
				href: ("/" + (attrs.page.replace(' ', '').toLowerCase())),
				oncreate: index.route.link,
				className: attrs.active === attrs.page ? 'active' : ''
			}, attrs.page)
		);
	}
};

function view$3(ref) {
	var attrs = ref.attrs;

	return (
		index('.Nav',
			index('.Container',
				pages.map(function (page) { return index(Link, { page: page, active: attrs.active }); })
			)
		)
	);
}

var Nav = {
	view: view$3
};

function view$2(ref) {
	var attrs = ref.attrs;
	var children = ref.children;

	return (
		index('div',
			index('.Display',
				index('.Container',
					index('h1', 'Mithril.js examples')
				)
			),
			index(Nav, { active: attrs.id }),
			index('.Content',
				index('.Container', children)
			)
		)
	);
}

var Page = {
	view: view$2
};

function oninit$1(ref) {
	var state = ref.state;

	state.activeIndex = index.prop(0);
}

function view$4(ref) {
	var attrs = ref.attrs;
	var state = ref.state;

	return (
		index('.Tabs.drop20',
			index('.TabBar',
				attrs.tabs.map(function (tab, i) { return index('.Tab', {
						key: i,
						className: state.activeIndex() === i ? 'active' : '',
						onclick: function () { return state.activeIndex(i); }
					}, attrs.tabs[i].id); }
				)
			),
			index('pre.TabContent',
				index('code', index.trust(attrs.tabs[state.activeIndex()].code))
			)
		)
	);
}

var Tabs = {
	oninit: oninit$1,
	view: view$4
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var prism = createCommonjsModule(function (module) {
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					// Check for existence for IE8
					return o.map && o.map(function(v) { return _.util.clone(v); });
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || document.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	tokenize: function(text, grammar, language) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				pattern = pattern.pattern || pattern;

				for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    delNum = 1;

					// Greedy patterns can override/remove up to two previously matched tokens
					if (!match && greedy && i != strarr.length - 1) {
						// Reconstruct the original text using the next two tokens
						var nextToken = strarr[i + 1].matchedStr || strarr[i + 1],
						    combStr = str + nextToken;

						if (i < strarr.length - 2) {
							combStr += strarr[i + 2].matchedStr || strarr[i + 2];
						}

						// Try the pattern again on the reconstructed text
						pattern.lastIndex = 0;
						match = pattern.exec(combStr);
						if (!match) {
							continue;
						}

						var from = match.index + (lookbehind ? match[1].length : 0);
						// To be a valid candidate, the new match has to start inside of str
						if (from >= str.length) {
							continue;
						}
						var to = match.index + match[0].length,
						    len = str.length + nextToken.length;

						// Number of tokens to delete and replace with the new match
						delNum = 3;

						if (to <= len) {
							if (strarr[i + 1].greedy) {
								continue;
							}
							delNum = 2;
							combStr = combStr.slice(0, len);
						}
						str = combStr;
					}

					if (!match) {
						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.matchedStr = matchedStr || null;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = '';

	for (var name in env.attributes) {
		attributes += (attributes ? ' ' : '') + name + '="' + (env.attributes[name] || '') + '"';
	}

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}
 	// In worker
	_self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code,
		    immediateClose = message.immediateClose;

		_self.postMessage(_.highlight(code, _.languages[lang], lang));
		if (immediateClose) {
			_self.close();
		}
	}, false);

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			requestAnimationFrame(_.highlightAll, 0);
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof commonjsGlobal !== 'undefined') {
	commonjsGlobal.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=.$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});
	
	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		if(Array.prototype.forEach) { // Check to prevent error in IE8
			Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				var src = pre.getAttribute('data-src');

				var language, parent = pre;
				var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}

				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}

				var code = document.createElement('code');
				code.className = 'language-' + language;

				pre.textContent = '';

				code.textContent = 'Loading…';

				pre.appendChild(code);

				var xhr = new XMLHttpRequest();

				xhr.open('GET', src, true);

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;

							Prism.highlightElement(code);
						}
						else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						}
						else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();
});

function codeString(str) {
	return prism.highlight(str, prism.languages.javascript);
}

var es5 = codeString(
"var HelloButton = {\n\tview: function() {\n\t\treturn m('button', 'Hello world!');\n\t}\n};");

var es6 = codeString(
"const HelloButton = {\n\tview() {\n\t\treturn m('button', 'Hello world!');\n\t}\n};");

var jsx = codeString(
"const HelloButton = {\n\tview() {\n\t\treturn <button>Hello world!</button>;\n\t}\n};");

var code = [
	{ id: 'es5', code: es5 },
	{ id: 'es6', code: es6 },
	{ id: 'jsx', code: jsx }
];

var Component = {
	view: function view() {
		return index('button', 'Hello world!');
	}
};

var es5$1 = codeString(
"var HelloButton = {\n\tview: function(vnode) {\n\t\treturn m('button', 'Hello ' + vnode.attrs.title);\n\t}\n};\n\nvar Component = {\n\tview: function() {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm(HelloButton, { title: 'world'})\n\t\t\t\tm(HelloButton, { title: 'everyone'})\n\t\t\t\tm(HelloButton, { title: 'darkness my old friend'})\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$1 = codeString(
"const HelloButton = {\n\tview({ attrs }) {\n\t\treturn m('button', `Hello ${attrs.title}`);\n\t}\n};\n\nconst Component = {\n\tview() {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm(HelloButton, { title: 'world'})\n\t\t\t\tm(HelloButton, { title: 'everyone'})\n\t\t\t\tm(HelloButton, { title: 'darkness my old friend'})\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$1 = codeString(
"const HelloButton = {\n\tview({ attrs }) {\n\t\treturn <button>Hello {attrs.title}</button>;\n\t}\n};\n\nconst Component = {\n\tview() {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<HelloButton title='world'/>\n\t\t\t\t<HelloButton title='everyone'/>\n\t\t\t\t<HelloButton title='darkness my old friend'/>\n\t\t\t</div>\n\t\t);\n\t}\n};");

var code$1 = [
	{ id: 'es5', code: es5$1 },
	{ id: 'es6', code: es6$1 },
	{ id: 'jsx', code: jsx$1 }
];

var HelloButton = {
	view: function view(ref) {
		var attrs = ref.attrs;

		return index('button', ("Hello " + (attrs.title)));
	}
};

var Component$1 = {
	view: function view$1() {
		return (
			index('div',
				index(HelloButton, { title: 'world'}),
				index(HelloButton, { title: 'everyone'}),
				index(HelloButton, { title: 'darkness my old friend'})
			)
		);
	}
};

var es5$2 = codeString(
"const HelloButton = {\n\tview: function(vnode) {\n\t\treturn m('button', 'Hello ' + vnode.attrs.title);\n\t}\n};\n\nvar Component = {\n\toninit: function(vnode) {\n\t\tvnode.state.inputValue = ''; // initial state\n\t},\n\tview: function(vnode) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('input[type=text]', {\n\t\t\t\t\tvalue: vnode.state.inputValue, // read from state\n\t\t\t\t\toninput: function(event) {\n\t\t\t\t\t\tvnode.state.inputValue = event.target.value;\n\t\t\t\t\t}\n\t\t\t\t}),\n\t\t\t\tm(HelloButton, {\n\t\t\t\t\ttitle: vnode.state.inputValue\n\t\t\t\t})\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$2 = codeString(
"const HelloButton = {\n\tview({ attrs }) {\n\t\treturn m('button', `Hello ${attrs.title}`);\n\t}\n};\n\nconst Component = {\n\toninit({ state }) {\n\t\tstate.inputValue = ''; // initial state\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('input[type=text]', {\n\t\t\t\t\tvalue: state.inputValue, // read from state\n\t\t\t\t\toninput(event) {\n\t\t\t\t\t\tstate.inputValue = event.target.value;\n\t\t\t\t\t}\n\t\t\t\t}),\n\t\t\t\tm(HelloButton, { title: state.inputValue })\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$2 = codeString(
"const HelloButton = {\n\tview({ attrs }) {\n\t\treturn <button>Hello {attrs.title}</button>;\n\t}\n};\n\nconst Component = {\n\toninit({ state }) {\n\t\tstate.inputValue = ''; // initial state\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<input\n\t\t\t\t\ttype='text'\n\t\t\t\t\tvalue={state.inputValue}\n\t\t\t\t\toninput={\n\t\t\t\t\t\t(event) => { state.inputValue = event.target.value }\n\t\t\t\t\t}/>\n\t\t\t\t<HelloButton title={state.inputValue}/>\n\t\t\t</div>\n\t\t);\n\t}\n};");

var code$2 = [
	{ id: 'es5', code: es5$2 },
	{ id: 'es6', code: es6$2 },
	{ id: 'jsx', code: jsx$2 }
];

var HelloButton$1 = {
	view: function view(ref) {
		var attrs = ref.attrs;

		return index('button', ("Hello " + (attrs.title)));
	}
};

var Component$2 = {
	oninit: function oninit(ref) {
		var state = ref.state;

		state.inputValue = ''; // initial state
	},
	view: function view$1(ref) {
		var state = ref.state;

		return (
			index('div',
				index('input[type=text]', {
					value: state.inputValue, // read the value from state
					oninput: function oninput(event) {
						state.inputValue = event.target.value;
					}
				}),
				index(HelloButton$1, { title: state.inputValue })
			)
		);
	}
};

var es5$3 = codeString(
"var HelloWorldButton = {\n\tview: function(vnode) {\n\t\treturn m('button', 'Hello ' + vnode.attrs.title);\n\t}\n};\n\nvar Component = {\n\toninit: function(vnode) {\n\t\tvnode.state.inputValue = m.prop('');\n\t},\n\tview: function(vnode) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('input[type=text]', {\n\t\t\t\t\tvalue: vnode.state.inputValue(),\n\t\t\t\t\toninput: m.withAttr('value', vnode.state.inputValue)\n\t\t\t\t}),\n\t\t\t\tm(HelloWorldButton, {\n\t\t\t\t\ttitle: vnode.state.inputValue()\n\t\t\t\t})\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$3 = codeString(
"const HelloWorldButton = {\n\tview({ attrs }) {\n\t\treturn m('button', `Hello ${attrs.title}`);\n\t}\n};\n\nconst Component = {\n\toninit({ state }) {\n\t\tstate.inputValue = m.prop('');\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('input[type=text]', {\n\t\t\t\t\tvalue: state.inputValue(),\n\t\t\t\t\toninput: m.withAttr('value', state.inputValue)\n\t\t\t\t}),\n\t\t\t\tm(HelloWorldButton, { title: state.inputValue() })\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$3 = codeString(
"const HelloWorldButton = {\n\tview({ attrs }) {\n\t\treturn <button>Hello {attrs.title}</button>;\n\t}\n};\n\nconst Component = {\n\toninit({ state }) {\n\t\tstate.inputValue = m.prop('');\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<input\n\t\t\t\t\ttype='text'\n\t\t\t\t\tvalue={state.inputValue()}\n\t\t\t\t\toninput={m.withAttr('value', state.inputValue)}/>\n\t\t\t\t<HelloWorldButton title={state.inputValue()}/>\n\t\t\t</div>\n\t\t);\n\t}\n}");

var code$3 = [
	{ id: 'es5', code: es5$3 },
	{ id: 'es6', code: es6$3 },
	{ id: 'jsx', code: jsx$3 }
];

var HelloWorldButton = {
	view: function view(ref) {
		var attrs = ref.attrs;

		return index('button', ("Hello " + (attrs.title)));
	}
};

var Component$3 = {
	oninit: function oninit(ref) {
		var state = ref.state;

		state.inputValue = index.prop('');
	},
	view: function view$1(ref) {
		var state = ref.state;

		return (
			index('div',
				index('input[type=text]', {
					value: state.inputValue(),
					oninput: index.withAttr('value', state.inputValue)
				}),
				index(HelloWorldButton, { title: state.inputValue() })
			)
		);
	}
};

function view$1$1() {
	return (
		index(Page, { id: 'Getting started' },
			index('.Section',
				index('h2', 'Overview'),
				index('p', 'Mithril is a client-side MVC framework. You can read more about it at the ',
					index('a[href=http://mithril.js.org]', 'official website'), '. ',
					'This is an unofficial guide and collection of examples using the upcoming ',
					index('a[href=https://github.com/lhorie/mithril.js/tree/rewrite/docs]', '1.0 rewrite'),
					' of Mithril.js.'
				)
			),
			index('.Section',
				index('h2', 'Basic components'),
				index('p',
					'Every component is at minimum an object with a ',
					index('code.inline', 'view'),
					' method that returns a mithril virtual dom node.'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component))
					)
				),
				index('p',
					'The first argument to ',
					index('code.inline', 'm'),
					' is the element (as a css selector-like string) or component that should be rendered, and the optional last argument(s)',
					' are the children of that component.'
				),
				index('p',
					'Components can pass properties down to their children by passing in an object as the second argument in the call to ',
					index('code.inline', 'm'),
					'. Those properties become available to the component through the ',
					index('code.inline', 'attrs'),
					' object in the mithril virtual dom node.'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$1 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$1))
					)
				),
				index('p',
					'In addition to the ',
					index('code.inline', 'view'),
					' method, Mithril components have a variety of ',
					index('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/lifecycle-methods.renderToStaticMarkup]', 'lifecycle hooks'),
					'. Using the ',
					index('code.inline', 'oninit'),
					' lifecycle hook, which runs once immediately before rendering the component, ',
					' we can set the initial state. At this point it is worth noting that the ',
					index('code.inline', 'vnode'),
					' object that is passed to the ',
					index('code.inline', 'view'),
					' method contains, in addition to ',
					index('code.inline', 'attrs'),
					', a ',
					index('code.inline', 'state'),
					' object that can be used to store the state of that specific component.'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$2 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$2))
					)
				),
				index('p',
					'Mithril provides two utilities ',
					index('code.inline', 'm.withAttr'),
					' and ',
					index('code.inline', 'm.prop'),
					' that help simplify this process.'
				),
				index('p',
					index('code.inline', index('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/prop.md]', 'm.prop')),
					' is, at its simplest, a getter-setter function, while ',
					index('code.inline', index('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/withAttr.md]', 'm.withAttr')),
					' creates an event handler that uses a specified dom element property as the argument to a provided callback. ',
					'We can use them both to simplify the previous code. All together, this is the final version of this example:'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$3 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$3))
					)
				)
			)
		)
	);
}

var GettingStarted = {
	view: view$1$1
};

var es5$4 = codeString(
"var Stopwatch = {\n\toninit: function(vnode) {\n\t\tvnode.state.seconds = 0;\n\t\tvnode.state.count = () => {\n\t\t\tvnode.state.seconds++;\n\t\t\tm.redraw();\n\t\t};\n\t\tvnode.state.interval = setInterval(vnode.state.count, 1000);\n\t},\n\tonremove: function(vnode) {\n\t\tclearInterval(vnode.state.interval);\n\t},\n\tview: function(vnode) {\n\t\treturn m('span', 'Timer: ' + vnode.state.seconds);\n\t}\n};");

var es6$4 = codeString(
"const Stopwatch = {\n\toninit({ state }) {\n\t\tstate.seconds = 0;\n\t\tstate.count = () => {\n\t\t\tstate.seconds++;\n\t\t\tm.redraw();\n\t\t};\n\t\tstate.interval = setInterval(state.count, 1000);\n\t},\n\tonremove({ state }) {\n\t\tclearInterval(state.interval);\n\t},\n\tview({ state }) {\n\t\treturn m('span', `Timer: ${state.seconds}`);\n\t}\n};");

var jsx$4 = codeString(
"const Stopwatch = {\n\toninit({ state }) {\n\t\tstate.seconds = 0;\n\t\tstate.count = () => {\n\t\t\tstate.seconds++;\n\t\t\tm.redraw();\n\t\t};\n\t\tstate.interval = setInterval(state.count, 1000);\n\t},\n\tonremove({ state }) {\n\t\tclearInterval(state.interval);\n\t},\n\tview({ state }) {\n\t\treturn <span>Timer: {state.seconds}</span>;\n\t}\n};");

var code$4 = [
	{ id: 'es5', code: es5$4 },
	{ id: 'es6', code: es6$4 },
	{ id: 'jsx', code: jsx$4 }
];

var Component$4 = {
	oninit: function oninit(ref) {
		var state = ref.state;

		state.seconds = 0;
		state.count = function () {
			state.seconds++;
			index.redraw();
		};
		state.interval = setInterval(state.count, 1000);
	},
	onremove: function onremove(ref) {
		var state = ref.state;

		clearInterval(state.interval);
	},
	view: function view(ref) {
		var state = ref.state;

		return index('span', ("Timer: " + (state.seconds)));
	}
};

var es5$5 = codeString(
"var Stopwatch = {\n\toninit: function(vnode) {\n\t\tvnode.state.seconds = 0;\n\t\tvnode.state.isPaused = false;\n\t\tvnode.state.reset = function() {\n\t\t\tvnode.state.seconds = 0;\n\t\t};\n\t\tvnode.state.toggle = function() {\n\t\t\tvnode.state.isPaused = !vnode.state.isPaused;\n\t\t\tclearInterval(vnode.state.interval);\n\t\t\tif (!vnode.state.isPaused) {\n\t\t\t\tvnode.state.interval =\n\t\t\t\t\tsetInterval(vnode.state.count, 1000);\n\t\t\t}\n\t\t};\n\t\tvnode.state.count = function() {\n\t\t\tvnode.state.seconds++;\n\t\t\tm.redraw();\n\t\t};\n\t\tvnode.state.interval =\n\t\t\tsetInterval(vnode.state.count, 1000);\n\t},\n\tonremove: function(vnode) {\n\t\tclearInterval(vnode.state.interval);\n\t},\n\tview: function(vnode) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('span', 'Timer: ' + vnode.state.seconds),\n\t\t\t\tm('button', { onclick: vnode.state.reset }, 'Reset'),\n\t\t\t\tm('button', {\n\t\t\t\t\tonclick: vnode.state.toggle\n\t\t\t\t}, state.isPaused ? 'Start' : 'Pause')\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$5 = codeString(
"const Stopwatch = {\n\toninit({ state }) {\n\t\tstate.seconds = 0;\n\t\tstate.isPaused = false;\n\t\tstate.reset = () => { state.seconds = 0; };\n\t\tstate.toggle = () => {\n\t\t\tstate.isPaused = !state.isPaused;\n\t\t\tclearInterval(state.interval);\n\t\t\tif (!state.isPaused) {\n\t\t\t\tstate.interval = setInterval(state.count, 1000);\n\t\t\t}\n\t\t};\n\t\tstate.count = () => {\n\t\t\tstate.seconds++;\n\t\t\tm.redraw();\n\t\t};\n\t\tstate.interval = setInterval(state.count, 1000);\n\t},\n\tonremove({ state }) {\n\t\tclearInterval(state.interval);\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('span', `Timer: ${state.seconds}`),\n\t\t\t\tm('button', { onclick: state.reset }, 'Reset'),\n\t\t\t\tm('button', {\n\t\t\t\t\tonclick: state.toggle\n\t\t\t\t}, state.isPaused ? 'Start' : 'Pause')\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$5 = codeString(
"const Stopwatch = {\n\toninit({ state }) {\n\t\tstate.seconds = 0;\n\t\tstate.isPaused = false;\n\t\tstate.reset = () => { state.seconds = 0; };\n\t\tstate.toggle = () => {\n\t\t\tstate.isPaused = !state.isPaused;\n\t\t\tclearInterval(state.interval);\n\t\t\tif (!state.isPaused) {\n\t\t\t\tstate.interval = setInterval(state.count, 1000);\n\t\t\t}\n\t\t};\n\t\tstate.count = () => {\n\t\t\tstate.seconds++;\n\t\t\tm.redraw();\n\t\t};\n\t\tstate.interval = setInterval(state.count, 1000);\n\t},\n\tonremove({ state }) {\n\t\tclearInterval(state.interval);\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<span>Timer: {state.seconds}</span>\n\t\t\t\t<button onclick={state.reset}>Reset</button>\n\t\t\t\t<button onclick={state.toggle}>\n\t\t\t\t\t{state.isPaused ? 'Start' : 'Pause'}\n\t\t\t\t</button>\n\t\t\t)\n\t\t);\n\t}\n};");

var code$5 = [
	{ id: 'es5', code: es5$5 },
	{ id: 'es6', code: es6$5 },
	{ id: 'jsx', code: jsx$5 }
];

var Component$5 = {
	oninit: function oninit(ref) {
		var state = ref.state;

		state.seconds = 0;
		state.isPaused = false;
		state.reset = function () { state.seconds = 0; };
		state.toggle = function () {
			state.isPaused = !state.isPaused;
			clearInterval(state.interval);
			if (!state.isPaused) {
				state.interval = setInterval(state.count, 1000);
			}
		};
		state.count = function () {
			state.seconds++;
			index.redraw();
		};
		state.interval = setInterval(state.count, 1000);
	},
	onremove: function onremove(ref) {
		var state = ref.state;

		clearInterval(state.interval);
	},
	view: function view(ref) {
		var state = ref.state;

		return (
			index('div',
				index('span', ("Timer: " + (state.seconds))),
				index('button', { onclick: state.reset }, 'Reset'),
				index('button', { onclick: state.toggle }, state.isPaused ? 'Start' : 'Pause')
			)
		);
	}
};

var es5$6 = codeString(
"var Rotator = {\n\toninit: function(vnode) {\n\t\tvnode.state.list = ['One', 'Two', 'Three', 'Four'];\n\t\tvnode.state.rotate = function() {\n\t\t\tvnode.state.list.push(vnode.state.list.shift());\n\t\t};\n\t},\n\tview: function(vnode) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('ul',\n\t\t\t\t\tstate.list.map(function(item, i) {\n\t\t\t\t\t\treturn m('li', { key: i }, item)\n\t\t\t\t\t}\n\t\t\t\t),\n\t\t\t\tm('button', { onclick: state.rotate }, 'Rotate')\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$6 = codeString(
"const Rotator = {\n\toninit({ state }) {\n\t\tstate.list = ['One', 'Two', 'Three', 'Four'];\n\t\tstate.rotate = () => state.list.push(state.list.shift());\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('ul',\n\t\t\t\t\tstate.list.map((item, i) =>\n\t\t\t\t\t\tm('li', { key: i }, item)\n\t\t\t\t\t)\n\t\t\t\t),\n\t\t\t\tm('button', { onclick: state.rotate }, 'Rotate')\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$6 = codeString(
"const Rotator = {\n\toninit({ state }) {\n\t\tstate.list = ['One', 'Two', 'Three', 'Four'];\n\t\tstate.rotate = () => state.list.push(state.list.shift());\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<ul>\n\t\t\t\t\t{\n\t\t\t\t\t\tstate.list.map((item, i) =>\n\t\t\t\t\t\t\t<li key={i}>{item}</li>\n\t\t\t\t\t\t)\n\t\t\t\t\t}\n\t\t\t\t</ul>\n\t\t\t\t<button onclick={state.rotate}>Rotate</button>\n\t\t\t</div>\n\t\t);\n\t}\n};");

var code$6 = [
	{ id: 'es5', code: es5$6 },
	{ id: 'es6', code: es6$6 },
	{ id: 'jsx', code: jsx$6 }
];

var Component$6 = {
	oninit: function oninit(ref) {
		var state = ref.state;

		state.list = ['One', 'Two', 'Three', 'Four'];
		state.rotate = function () { return state.list.push(state.list.shift()); };
	},
	view: function view(ref) {
		var state = ref.state;

		return (
			index('div',
				index('ul',
					state.list.map(function (item, i) { return index('li', { key: i }, item); }
					)
				),
				index('button', { onclick: state.rotate }, 'Rotate')
			)
		);
	}
};

var es5$7 = codeString(
"var PasswordInput = {\n\toninit: function(vnode) {\n\t\tvnode.state.visible = m.prop(false);\n\t\tvnode.state.value = m.prop('');\n\t\tvnode.state.toggle = function() {\n\t\t\tvnode.state.visible(!vnode.state.visible());\n\t\t};\n\t},\n\tview: function(vnode) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('input', {\n\t\t\t\t\ttype: vnode.state.visible() ? 'text' : 'password',\n\t\t\t\t\tplaceholder: vnode.state.visible() ?\n\t\t\t\t\t\t'password' : '••••••••',\n\t\t\t\t\tvalue: vnode.state.value(),\n\t\t\t\t\toninput: m.withAttr('value', vnode.state.value)\n\t\t\t\t}),\n\t\t\t\tm('button', {\n\t\t\t\t\tonclick: vnode.state.toggle\n\t\t\t\t}, vnode.state.visible() ? 'Hide' : 'Show')\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$7 = codeString(
"const PasswordInput = {\n\toninit({ state }) {\n\t\tstate.visible = m.prop(false);\n\t\tstate.value = m.prop('');\n\t\tstate.toggle = () => state.visible(!state.visible());\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('input', {\n\t\t\t\t\ttype: state.visible() ? 'text' : 'password',\n\t\t\t\t\tplaceholder: state.visible() ? 'password' : '••••••••',\n\t\t\t\t\tvalue: state.value(),\n\t\t\t\t\toninput: m.withAttr('value', state.value)\n\t\t\t\t}),\n\t\t\t\tm('button', {\n\t\t\t\t\tonclick: state.toggle\n\t\t\t\t}, state.visible() ? 'Hide' : 'Show')\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$7 = codeString(
"const PasswordInput = {\n\toninit({ state }) {\n\t\tstate.visible = m.prop(false);\n\t\tstate.value = m.prop('');\n\t\tstate.toggle = () => state.visible(!state.visible());\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<input\n\t\t\t\t\ttype={state.visible() ? 'text' : 'password'}\n\t\t\t\t\tplaceholder={state.visible() ? 'password' : '••••••••'}\n\t\t\t\t\tvalue={state.value()}\n\t\t\t\t\toninput={m.withAttr('value', state.value)}/>\n\t\t\t\t<button onclick={state.toggle}>\n\t\t\t\t\t{state.visible() ? 'Hide' : 'Show'}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t);\n\t}\n};");

var code$7 = [
	{ id: 'es5', code: es5$7 },
	{ id: 'es6', code: es6$7 },
	{ id: 'jsx', code: jsx$7 }
];

var Component$7 = {
	oninit: function oninit(ref) {
		var state = ref.state;

		state.visible = index.prop(false);
		state.value = index.prop('');
		state.toggle = function () { return state.visible(!state.visible()); };
	},
	view: function view(ref) {
		var state = ref.state;

		return (
			index('div',
				index('input', {
					type: state.visible() ? 'text' : 'password',
					placeholder: state.visible() ? 'password' : '••••••••',
					value: state.value(),
					oninput: index.withAttr('value', state.value)
				}),
				index('button', {
					onclick: state.toggle
				}, state.visible() ? 'Hide' : 'Show')
			)
		);
	}
};

var es5$8 = codeString(
"function setHeight(domNode) {\n\tdomNode.style.height = ''; // reset before recalculating\n\tdomNode.style.height = domNode.scrollHeight + 'px';\n}\n\nvar Textarea = {\n\toninit: function(vnode) {\n\t\tvnode.state.value = m.prop();\n\t},\n\toncreate: function(vnode) {\n\t\tvnode.state.value.map(function() {\n\t\t\tsetHeight(vnode.dom);\n\t\t)};\n\t},\n\tview: function(vnode) {\n\t\treturn m('textarea', {\n\t\t\tvalue: vnode.state.value(),\n\t\t\toninput: m.withAttr('value', vnode.state.value)\n\t\t});\n\t}\n};");

var es6$8 = codeString(
"function setHeight(domNode) {\n\tdomNode.style.height = ''; // reset before recalculating\n\tdomNode.style.height = `${domNode.scrollHeight}px`;\n}\n\nconst Textarea = {\n\toninit({ state }) {\n\t\tstate.value = m.prop();\n\t},\n\toncreate({ dom, state }) {\n\t\tstate.value.map(() => setHeight(dom));\n\t},\n\tview({ state }) {\n\t\treturn m('textarea', {\n\t\t\tvalue: state.value(),\n\t\t\toninput: m.withAttr('value', state.value)\n\t\t});\n\t}\n};");

var jsx$8 = codeString(
"function setHeight(domNode) {\n\tdomNode.style.height = ''; // reset before recalculating\n\tdomNode.style.height = `${domNode.scrollHeight}px`;\n}\n\nconst Textarea = {\n\toninit({ state }) {\n\t\tstate.value = m.prop();\n\t},\n\toncreate({ dom, state }) {\n\t\tstate.value.map(() => setHeight(dom));\n\t},\n\tview({ state }) {\n\t\treturn <textarea\n\t\t\tvalue={state.value()}\n\t\t\toninput={m.withAttr('value', state.value)}/>;\n\t}\n};");

var code$8 = [
	{ id: 'es5', code: es5$8 },
	{ id: 'es6', code: es6$8 },
	{ id: 'jsx', code: jsx$8 }
];

function setHeight(domNode) {
	domNode.style.height = ''; // reset before recalculating
	domNode.style.height = (domNode.scrollHeight) + "px";
}

var Component$8 = {
	oninit: function oninit(ref) {
		var state = ref.state;

		state.value = index.prop();
	},
	oncreate: function oncreate(ref) {
		var dom = ref.dom;
		var state = ref.state;

		state.value.map(function () { return setHeight(dom); });
	},
	view: function view(ref) {
		var state = ref.state;

		return index('textarea', {
			value: state.value(),
			oninput: index.withAttr('value', state.value)
		});
	}
};

var es5$9 = codeString(
"var tabContent1 = [\n\t{ id: 'One', content: 'First tab' },\n\t{ id: 'Two', content: 'Second tab' },\n\t{ id: 'Three', content: 'Third tab' }\n];\n\nvar tabContent2 = [\n\t{ id: 'Lorem', content: 'Lorem ipsum...' },\n\t{ id: 'Ipsum', content: 'Duis aute...' }\n];\n\nvar Tabs = {\n\toninit: function(vnode) {\n\t\tvnode.state.activeTab = m.prop(0);\n\t},\n\tview: function(vnode) {\n\t\tvar active = vnode.state.activeTab();\n\t\treturn (\n\t\t\tm('.Tabs',\n\t\t\t\tm('.TabBar',\n\t\t\t\t\tvnode.attrs.tabs.map(function(tab, i) {\n\t\t\t\t\t\treturn m('.Tab', {\n\t\t\t\t\t\t\tkey: i,\n\t\t\t\t\t\t\tclassName: i === active ? 'active' : '',\n\t\t\t\t\t\t\tonclick: function() {\n\t\t\t\t\t\t\t\tvnode.state.activeTab(i);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}, tab.id)\n\t\t\t\t\t})\n\t\t\t\t),\n\t\t\t\tm('.TabContent', vnode.attrs.tabs[active].content)\n\t\t\t)\n\t\t);\n\t}\n};\n\nvar Component = {\n\tview: function() {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm(Tabs, { tabs: tabContent1 }),\n\t\t\t\tm('br'),\n\t\t\t\tm(Tabs, { tabs: tabContent2 })\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$9 = codeString(
"const tabContent1 = [\n\t{ id: 'One', content: 'First tab' },\n\t{ id: 'Two', content: 'Second tab' },\n\t{ id: 'Three', content: 'Third tab' }\n];\n\nconst tabContent2 = [\n\t{ id: 'Lorem', content: 'Lorem ipsum...' },\n\t{ id: 'Ipsum', content: 'Duis aute...' }\n];\n\nconst Tabs = {\n\toninit({ state }) {\n\t\tstate.activeTab = m.prop(0);\n\t},\n\tview({ attrs, state }) {\n\t\treturn (\n\t\t\tm('.Tabs',\n\t\t\t\tm('.TabBar',\n\t\t\t\t\tattrs.tabs.map((tab, i) =>\n\t\t\t\t\t\tm('.Tab', {\n\t\t\t\t\t\t\tkey: i,\n\t\t\t\t\t\t\tclassName: state.activeTab() === i ? 'active' : '',\n\t\t\t\t\t\t\tonclick() { state.activeTab(i); }\n\t\t\t\t\t\t}, tab.id)\n\t\t\t\t\t)\n\t\t\t\t),\n\t\t\t\tm('.TabContent', attrs.tabs[state.activeTab()].content)\n\t\t\t)\n\t\t);\n\t}\n};\n\nconst Component = {\n\tview() {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm(Tabs, { tabs: tabContent1 }),\n\t\t\t\tm('br'),\n\t\t\t\tm(Tabs, { tabs: tabContent2 })\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$9 = codeString(
"const tabContent1 = [\n\t{ id: 'One', content: 'First tab' },\n\t{ id: 'Two', content: 'Second tab' },\n\t{ id: 'Three', content: 'Third tab' }\n];\n\nconst tabContent2 = [\n\t{ id: 'Lorem', content: 'Lorem ipsum...' },\n\t{ id: 'Ipsum', content: 'Duis aute...' }\n];\n\nconst Tabs = {\n\toninit({ state }) {\n\t\tstate.activeTab = m.prop(0);\n\t},\n\tview({ attrs, state }) {\n\t\tconst active = state.activeTab();\n\t\treturn (\n\t\t\t<div className='Tabs'>\n\t\t\t\t<div className='TabBar'>\n\t\t\t\t\t{\n\t\t\t\t\t\tattrs.tabs.map((tab, i) =>\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tkey={i}\n\t\t\t\t\t\t\t\tclassName={`Tab ${active === i ? 'active' : ''}`}\n\t\t\t\t\t\t\t\tonclick={() => state.activeTab(i) }>\n\t\t\t\t\t\t\t\t{tab.id}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t)\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div className='TabContent'>\n\t\t\t\t\t{attrs.tabs[state.activeTab()].content}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t);\n\t}\n};\n\nconst Component = {\n\tview() {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<Tabs tabs={tabContent1}/>\n\t\t\t\t<br/>\n\t\t\t\t<Tabs tabs={tabContent2}/>\n\t\t\t</div>\n\t\t);\n\t}\n};");

var code$9 = [
	{ id: 'es5', code: es5$9 },
	{ id: 'es6', code: es6$9 },
	{ id: 'jsx', code: jsx$9 }
];

var tabContent1 = [
	{ id: 'One', content: 'First tab' },
	{ id: 'Two', content: 'Second tab' },
	{ id: 'Three', content: 'Third tab' }
];

var tabContent2 = [
	{ id: 'Lorem', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' },
	{ id: 'Ipsum', content: 'Duis aute irure dolor in reprehenderit in voluptate velit' }
];

var Tabs$2 = {
	oninit: function oninit(ref) {
		var state = ref.state;

		state.activeTab = index.prop(0);
	},
	view: function view(ref) {
		var attrs = ref.attrs;
		var state = ref.state;

		return (
			index('.Tabs',
				index('.TabBar',
					attrs.tabs.map(function (tab, i) { return index('.Tab', {
							key: i,
							className: state.activeTab() === i ? 'active' : '',
							onclick: function onclick() { state.activeTab(i); }
						}, tab.id); }
					)
				),
				index('.TabContent', attrs.tabs[state.activeTab()].content)
			)
		);
	}
};

var Component$9 = {
	view: function view$1() {
		return (
			index('div',
				index(Tabs$2, { tabs: tabContent1 }),
				index('br'),
				index(Tabs$2, { tabs: tabContent2 })
			)
		);
	}
};

function view$5() {
	return (
		index(Page, { id: 'Components' },
			index('.Section',
				index('h2', 'Stopwatch'),
				index('p',
					'In the ',
					index('a[href=/]', { oncreate: index.route.link }, 'Getting started'),
					' example there was no need to manually tell mithril to update the view when ',
					'the contents of the input changed, because mithril automatically redraws after event handlers ',
					'are called. In this example there are no events that trigger an update, so we tell mithril to update via ',
					index('code.inline', 'm.redraw'),
					'.'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$4 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$4))
					)
				),
				index('p',
					'Adding a reset button is as simple as creating the button element in the ',
					index('code.inline', 'view'),
					' function and setting its ',
					index('code.inline', 'onclick'),
					' handler to a function that changes the count to 0. Similarly, the Start/Pause toggle',
					' is just a button that either clears or starts a new counter.'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$5 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$5))
					)
				)
			),
			index('.Section',
				index('h2', 'List rotator'),
				index('p',
					'When rendering a list of data, it is a good idea to supply Mithril with a ',
					index('code.inline', 'key'),
					' attribute for each element in that list. ',
					index('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/keys.md]', 'Keys'),
					' help Mithril maintain references to each element and should be unique for each item in the list.'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$6 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$6))
					)
				)
			),
			index('.Section',
				index('h2', 'Password input'),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$7 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$7))
					)
				)
			),
			index('.Section',
				index('h2', 'Autogrow textarea'),
				index('p',
					'In some cases it is necessary to interact directly with the rendered dom node, not ',
					'just mithril virtual dom nodes. For those cases, certain lifecycle methods (including ',
					index('code.inline', 'oncreate'),
					') provide access to the actual node through the ',
					index('code.inline', 'dom'),
					' property. This example uses it to set the height of the textarea.'
				),
				index('p',
					'This example also relies on the fact that, in addition to being a getter-setter, ',
					'any variable set to ',
					index('code.inline', 'm.prop()'),
					' can be observed for changes. Whenever the value is updated, its ',
					index('code.inline', 'map'),
					' function calls its callback with the new value. (In this case, we just ignore the ',
					' new value since the height is set regardless of the specific contents).'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$8 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$8))
					)
				)
			),
			index('.Section',
				index('h2', 'Tabs'),
				index('p',
					'The only state that tabs need to keep internally is the index of the active tab. The example components ',
					'store this state in each instance of the tabs. The implementation of the tabs on this site can be viewed ',
					index('a[href=https://github.com/sebastiansandqvist/mithril-examples/blob/master/src/views/Tabs.js?ts=2]', 'on github'),
					'.'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$9 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$9))
					)
				)
			)
		)
	);
}

var Components = {
	view: view$5
};

var es5$10 = codeString(
"var TodoList = {\n\tview: function(vnode) {\n\t\treturn (\n\t\t\tm('ul',\n\t\t\t\tvnode.attrs.items.map(function(item, i) {\n\t\t\t\t\treturn m('li', { key: i }, item);\n\t\t\t\t})\n\t\t\t)\n\t\t);\n\t}\n};\n\nvar TodoApp = {\n\toninit: function(vnode) {\n\t\tvnode.state.items = [];\n\t\tvnode.state.text = m.prop('');\n\t\tvnode.state.handleSubmit = function(event) {\n\t\t\tevent.preventDefault();\n\t\t\tvnode.state.items.push(vnode.state.text());\n\t\t\tvnode.state.text('');\n\t\t};\n\t},\n\tview: function(vnode) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('h3', 'To-do'),\n\t\t\t\tm(TodoList, { items: vnode.state.items }),\n\t\t\t\tm('form', { onsubmit: vnode.state.handleSubmit },\n\t\t\t\t\tm('input[type=text]', {\n\t\t\t\t\t\toninput: m.withAttr('value', vnode.state.text),\n\t\t\t\t\t\tvalue: vnode.state.text()\n\t\t\t\t\t}),\n\t\t\t\t\tm('button', {\n\t\t\t\t\t\ttype: 'submit'\n\t\t\t\t\t}, `Add #${vnode.state.items.length + 1}`)\n\t\t\t\t)\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$10 = codeString(
"const TodoList = {\n\tview({ attrs }) {\n\t\treturn (\n\t\t\tm('ul',\n\t\t\t\tattrs.items.map((item, i) =>\n\t\t\t\t\tm('li', { key: i }, item)\n\t\t\t\t)\n\t\t\t)\n\t\t);\n\t}\n};\n\nconst TodoApp = {\n\toninit({ state }) {\n\t\tstate.items = [];\n\t\tstate.text = m.prop('');\n\t\tstate.handleSubmit = function(event) {\n\t\t\tevent.preventDefault();\n\t\t\tstate.items.push(state.text());\n\t\t\tstate.text('');\n\t\t};\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('h3', 'To-do'),\n\t\t\t\tm(TodoList, { items: state.items }),\n\t\t\t\tm('form', { onsubmit: state.handleSubmit },\n\t\t\t\t\tm('input[type=text]', {\n\t\t\t\t\t\toninput: m.withAttr('value', state.text),\n\t\t\t\t\t\tvalue: state.text()\n\t\t\t\t\t}),\n\t\t\t\t\tm('button', {\n\t\t\t\t\t\ttype: 'submit'\n\t\t\t\t\t}, `Add #${state.items.length + 1}`)\n\t\t\t\t)\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$10 = codeString(
"const TodoList = {\n\tview({ attrs }) {\n\t\treturn (\n\t\t\t<ul>\n\t\t\t\t{\n\t\t\t\t\tattrs.items.map((item, i) => <li key={i}>{item}</li>)\n\t\t\t\t}\n\t\t\t</ul>\n\t\t);\n\t}\n};\n\nconst TodoApp = {\n\toninit({ state }) {\n\t\tstate.items = [];\n\t\tstate.text = m.prop('');\n\t\tstate.handleSubmit = function(event) {\n\t\t\tevent.preventDefault();\n\t\t\tstate.items.push(state.text());\n\t\t\tstate.text('');\n\t\t};\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<h3>To-do</h3>\n\t\t\t\t<TodoList items={state.items}/>\n\t\t\t\t<form onsubmit={state.handleSubmit}>\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype='text'\n\t\t\t\t\t\toninput={m.withAttr('value', state.text)}/>\n\t\t\t\t\t<button type='submit'>\n\t\t\t\t\t\tAdd #{state.items.length + 1}\n\t\t\t\t\t</button>\n\t\t\t\t</form>\n\t\t\t</div>\n\t\t);\n\t}\n};");

var code$10 = [
	{ id: 'es5', code: es5$10 },
	{ id: 'es6', code: es6$10 },
	{ id: 'jsx', code: jsx$10 }
];

var TodoList = {
	view: function view(ref) {
		var attrs = ref.attrs;

		return (
			index('ul',
				attrs.items.map(function (item, i) { return index('li', { key: i }, item); }
				)
			)
		);
	}
};

var Component$10 = {
	oninit: function oninit(ref) {
		var state = ref.state;

		state.items = [];
		state.text = index.prop('');
		state.handleSubmit = function(event) {
			event.preventDefault();
			state.items.push(state.text());
			state.text('');
		};
	},
	view: function view$1(ref) {
		var state = ref.state;

		return (
			index('div',
				index('h3', 'To-do'),
				index(TodoList, { items: state.items }),
				index('form', { onsubmit: state.handleSubmit },
					index('input[type=text]', {
						oninput: index.withAttr('value', state.text),
						value: state.text()
					}),
					index('button', { type: 'submit' }, ("Add #" + (state.items.length + 1)))
				)
			)
		);
	}
};

var es5$11 = codeString(
"var ListView = {\n\tview: function(vnode) {\n\t\treturn (\n\t\t\tm('ul',\n\t\t\t\t\tvnode.attrs.items ?\n\t\t\t\t\t\tvnode.attrs.items.map(function(book, i) {\n\t\t\t\t\t\t\treturn m('li', { key: i },\n\t\t\t\t\t\t\t\tm('span', book.name, ' $', book.price),\n\t\t\t\t\t\t\t\tm('button.right', {\n\t\t\t\t\t\t\t\t\tonclick: function() {\n\t\t\t\t\t\t\t\t\t\tvnode.attrs.action(book);\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}, vnode.attrs.actionLabel)\n\t\t\t\t\t\t\t)\n\t\t\t\t\t}) : m('div', 'Loading...')\n\t\t\t)\n\t\t);\n\t}\n};\n\nvar BookShop = {\n\toninit: function(vnode) {\n\n\t\t// fetch array of book objects from server of form:\n\t\t// { name: 'The Iliad', price: 12 }\n\t\tvnode.state.books = m.request({\n\t\t\tmethod: 'GET',\n\t\t\turl: 'https://mithril-examples.firebaseio.com/books.json'\n\t\t});\n\n\t\tvnode.state.cart = m.prop([]);\n\t\tvnode.state.text = m.prop('');\n\n\t\t// once books have loaded, filter by title and prevent\n\t\t// items in cart from showing up in the shop\n\t\tvnode.state.shop = m.prop.combine(function(text, books, cart) {\n\t\t\treturn books().filter(function(book) {\n\t\t\t\treturn book.name.toLowerCase()\n\t\t\t\t\t.indexOf(text().toLowerCase()) > -1 &&\n\t\t\t\t\t\tcart().indexOf(book) === -1;\n\t\t\t});\n\t\t}, [vnode.state.text, vnode.state.books, vnode.state.cart]);\n\n\t\t// when the cart updates, state.total = price of books in cart\n\t\tvnode.state.total = vnode.state.cart.map(function(cart) {\n\t\t\treturn cart.reduce(function(prev, next) {\n\t\t\t\treturn prev + next.price;\n\t\t\t}, 0);\n\t\t});\n\n\t\tvnode.state.addToCart = function(book) {\n\t\t\tvnode.state.cart(vnode.state.cart().concat(book));\n\t\t};\n\n\t\tvnode.state.removeFromCart = function(book) {\n\t\t\tvnode.state.cart(\n\t\t\t\tvnode.state.cart().filter((item) => item !== book)\n\t\t\t);\n\t\t};\n\n\t},\n\tview: function(vnode) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('h3', 'Book Shop'),\n\t\t\t\tm('input[type=text]', {\n\t\t\t\t\tplaceholder: 'Filter',\n\t\t\t\t\tvalue: vnode.state.text(),\n\t\t\t\t\toninput: m.withAttr('value', vnode.state.text)\n\t\t\t\t}),\n\t\t\t\tm(ListView, {\n\t\t\t\t\titems: vnode.state.shop(),\n\t\t\t\t\taction: vnode.state.addToCart,\n\t\t\t\t\tactionLabel: 'Add'\n\t\t\t\t}),\n\t\t\t\tm('hr'),\n\t\t\t\tm('h3', 'Cart'),\n\t\t\t\tm(ListView, {\n\t\t\t\t\titems: vnode.state.cart(),\n\t\t\t\t\taction: vnode.state.removeFromCart,\n\t\t\t\t\tactionLabel: 'Remove'\n\t\t\t\t}),\n\t\t\t\tm('strong', 'Total: '),\n\t\t\t\tm('span', '$', vnode.state.total())\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$11 = codeString(
"const ListView = {\n\tview({ attrs }) {\n\t\treturn (\n\t\t\tm('ul',\n\t\t\t\t\tattrs.items ? attrs.items.map((book, i) =>\n\t\t\t\t\t\tm('li', { key: i },\n\t\t\t\t\t\t\tm('span', book.name, ' $', book.price),\n\t\t\t\t\t\t\tm('button.right', {\n\t\t\t\t\t\t\t\tonclick() {\n\t\t\t\t\t\t\t\t\tattrs.action(book);\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}, attrs.actionLabel)\n\t\t\t\t\t\t)\n\t\t\t\t\t) : m('div', 'Loading...')\n\n\t\t\t)\n\t\t);\n\t}\n};\n\nconst BookShop = {\n\toninit({ state }) {\n\n\t\t// fetch array of book objects from server of form:\n\t\t// { name: 'The Iliad', price: 12 }\n\t\tstate.books = m.request({\n\t\t\tmethod: 'GET',\n\t\t\turl: 'https://mithril-examples.firebaseio.com/books.json'\n\t\t});\n\n\t\tstate.cart = m.prop([]);\n\t\tstate.text = m.prop('');\n\n\t\t// once books have loaded, filter by title and prevent\n\t\t// items in cart from showing up in the shop\n\t\tstate.shop = m.prop.combine(function(text, books, cart) {\n\t\t\treturn books().filter(function(book) {\n\t\t\t\treturn book.name.toLowerCase().indexOf(text().toLowerCase()) > -1 &&\n\t\t\t\t\tcart().indexOf(book) === -1;\n\t\t\t});\n\t\t}, [state.text, state.books, state.cart]);\n\n\t\t// when the cart updates, state.total = price of books in cart\n\t\tstate.total = state.cart.map(function(cart) {\n\t\t\treturn cart.reduce((prev, next) => prev + next.price, 0);\n\t\t});\n\n\t\tstate.addToCart = function(book) {\n\t\t\tstate.cart(state.cart().concat(book));\n\t\t};\n\n\t\tstate.removeFromCart = function(book) {\n\t\t\tstate.cart(\n\t\t\t\tstate.cart().filter((item) => item !== book)\n\t\t\t);\n\t\t};\n\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('h3', 'Book Shop'),\n\t\t\t\tm('input[type=text]', {\n\t\t\t\t\tplaceholder: 'Filter',\n\t\t\t\t\tvalue: state.text(),\n\t\t\t\t\toninput: m.withAttr('value', state.text)\n\t\t\t\t}),\n\t\t\t\tm(ListView, {\n\t\t\t\t\titems: state.shop(),\n\t\t\t\t\taction: state.addToCart,\n\t\t\t\t\tactionLabel: 'Add'\n\t\t\t\t}),\n\t\t\t\tm('hr'),\n\t\t\t\tm('h3', 'Cart'),\n\t\t\t\tm(ListView, {\n\t\t\t\t\titems: state.cart(),\n\t\t\t\t\taction: state.removeFromCart,\n\t\t\t\t\tactionLabel: 'Remove'\n\t\t\t\t}),\n\t\t\t\tm('strong', 'Total: '),\n\t\t\t\tm('span', '$', state.total())\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$11 = codeString(
"const ListView = {\n\tview({ attrs }) {\n\t\treturn (\n\t\t\t<ul>\n\t\t\t\t{\n\t\t\t\t\tattrs.items ? attrs.items.map((book, i) =>\n\t\t\t\t\t\t<li key={i}>\n\t\t\t\t\t\t\t<span>{book.name} ${book.price}</span>\n\t\t\t\t\t\t\t<button className='right' onclick={() => attrs.action(book)}>\n\t\t\t\t\t\t\t\t{attrs.actionLabel}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t) : <div>Loading...</div>\n\t\t\t\t}\n\t\t\t</ul>\n\t\t);\n\t}\n};\n\nconst BookShop = {\n\toninit({ state }) {\n\n\t\t// fetch array of book objects from server of form:\n\t\t// { name: 'The Iliad', price: 12 }\n\t\tstate.books = m.request({\n\t\t\tmethod: 'GET',\n\t\t\turl: 'https://mithril-examples.firebaseio.com/books.json'\n\t\t});\n\n\t\tstate.cart = m.prop([]);\n\t\tstate.text = m.prop('');\n\n\t\t// once books have loaded, filter by title and prevent\n\t\t// items in cart from showing up in the shop\n\t\tstate.shop = m.prop.combine(function(text, books, cart) {\n\t\t\treturn books().filter(function(book) {\n\t\t\t\treturn book.name.toLowerCase().indexOf(text().toLowerCase()) > -1 &&\n\t\t\t\t\tcart().indexOf(book) === -1;\n\t\t\t});\n\t\t}, [state.text, state.books, state.cart]);\n\n\t\t// when the cart updates, state.total = price of books in cart\n\t\tstate.total = state.cart.map(function(cart) {\n\t\t\treturn cart.reduce((prev, next) => prev + next.price, 0);\n\t\t});\n\n\t\tstate.addToCart = function(book) {\n\t\t\tstate.cart(state.cart().concat(book));\n\t\t};\n\n\t\tstate.removeFromCart = function(book) {\n\t\t\tstate.cart(\n\t\t\t\tstate.cart().filter((item) => item !== book)\n\t\t\t);\n\t\t};\n\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<h3>Book shop</h3>\n\t\t\t\t<input\n\t\t\t\t\ttype='text'\n\t\t\t\t\tplaceholder='filter'\n\t\t\t\t\tvalue={state.text()}\n\t\t\t\t\toninput={m.withAttr('value', state.text)}/>\n\t\t\t\t<ListView\n\t\t\t\t\titems={state.shop()}\n\t\t\t\t\taction={state.addToCart}\n\t\t\t\t\tactionLabel='Add'/>\n\t\t\t\t<hr/>\n\t\t\t\t<h3>Cart</h3>\n\t\t\t\t<ListView\n\t\t\t\t\titems={state.cart()}\n\t\t\t\t\taction={state.removeFromCart}\n\t\t\t\t\tactionLabel='Remove'/>\n\t\t\t\t<strong>Total: </strong>\n\t\t\t\t<span>${state.total()}</span>\n\t\t\t</div>\n\t\t);\n\t}\n};");

var code$11 = [
	{ id: 'es5', code: es5$11 },
	{ id: 'es6', code: es6$11 },
	{ id: 'jsx', code: jsx$11 }
];

var ListView = {
	view: function view(ref) {
		var attrs = ref.attrs;

		return (
			index('ul',
					attrs.items ? attrs.items.map(function (book, i) { return index('li', { key: i },
							index('span', book.name, ' $', book.price),
							index('button.right', {
								onclick: function onclick() {
									attrs.action(book);
								}
							}, attrs.actionLabel)
						); }
					) : index('div', 'Loading...')

			)
		);
	}
};

var Component$11 = {
	oninit: function oninit(ref) {
		var state = ref.state;


		// fetch array of book objects from server of form:
		// { name: 'The Iliad', price: 12 }
		state.books = index.request({
			method: 'GET',
			url: 'https://mithril-examples.firebaseio.com/books.json'
		});

		state.cart = index.prop([]);
		state.text = index.prop('');

		// once books have loaded, filter by title and prevent
		// items in cart from showing up in the shop
		state.shop = index.prop.combine(function(text, books, cart) {
			return books().filter(function(book) {
				return book.name.toLowerCase().indexOf(text().toLowerCase()) > -1 &&
					cart().indexOf(book) === -1;
			});
		}, [state.text, state.books, state.cart]);

		// when the cart updates, state.total = price of books in cart
		state.total = state.cart.map(function(cart) {
			return cart.reduce(function (prev, next) { return prev + next.price; }, 0);
		});

		state.addToCart = function(book) {
			state.cart(state.cart().concat(book));
		};

		state.removeFromCart = function(book) {
			state.cart(
				state.cart().filter(function (item) { return item !== book; })
			);
		};

	},
	view: function view$1(ref) {
		var state = ref.state;

		return (
			index('div',
				index('h3', 'Book Shop'),
				index('input[type=text]', {
					placeholder: 'Filter',
					value: state.text(),
					oninput: index.withAttr('value', state.text)
				}),
				index(ListView, {
					items: state.shop(),
					action: state.addToCart,
					actionLabel: 'Add'
				}),
				index('hr'),
				index('h3', 'Cart'),
				index(ListView, {
					items: state.cart(),
					action: state.removeFromCart,
					actionLabel: 'Remove'
				}),
				index('strong', 'Total: '),
				index('span', '$', state.total())
			)
		);
	}
};

var es5$12 = codeString(
"function mapAsciiToBraille(character) {\n\n\tvar map = {\n\t\ta: '⠁',\n\t\tb: '⠃',\n\t\tc: '⠉',\n\t\td: '⠙',\n\t\te: '⠑',\n\t\tf: '⠋',\n\t\tg: '⠛',\n\t\th: '⠓',\n\t\ti: '⠊',\n\t\tj: '⠚',\n\t\tk: '⠅',\n\t\tl: '⠇',\n\t\tm: '⠍',\n\t\tn: '⠝',\n\t\to: '⠕',\n\t\tp: '⠏',\n\t\tq: '⠟',\n\t\tr: '⠗',\n\t\ts: '⠎',\n\t\tt: '⠞',\n\t\tu: '⠥',\n\t\tv: '⠧',\n\t\tw: '⠺',\n\t\tx: '⠭',\n\t\ty: '⠽',\n\t\tz: '⠵',\n\t\t0: '⠼⠚',\n\t\t1: '⠼⠁',\n\t\t2: '⠼⠃',\n\t\t3: '⠼⠉',\n\t\t4: '⠼⠙',\n\t\t5: '⠼⠑',\n\t\t6: '⠼⠋',\n\t\t7: '⠼⠛',\n\t\t8: '⠼⠓',\n\t\t9: '⠼⠊'\n\t};\n\n\treturn map[character] || character;\n\n}\n\nvar BrailleTranslator = {\n\toninit: function(vnode) {\n\t\tvnode.state.input = m.prop('');\n\t\tvnode.state.output = vnode.state.input.map(function(text) {\n\t\t\treturn text\n\t\t\t\t.toLowerCase()\n\t\t\t\t.split('')\n\t\t\t\t.map(mapAsciiToBraille)\n\t\t\t\t.join('');\n\t\t});\n\t},\n\tview: function(vnode) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('div', 'Enter ascii text:'),\n\t\t\t\tm('input[type=text]', {\n\t\t\t\t\tplaceholder: 'input',\n\t\t\t\t\tvalue: vnode.state.input(),\n\t\t\t\t\toninput: m.withAttr('value', vnode.state.input)\n\t\t\t\t}),\n\t\t\t\tm('hr'),\n\t\t\t\tm('div', 'Braille:'),\n\t\t\t\tm('div', vnode.state.output())\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$12 = codeString(
"function mapAsciiToBraille(character) {\n\n\tconst map = {\n\t\ta: '⠁',\n\t\tb: '⠃',\n\t\tc: '⠉',\n\t\td: '⠙',\n\t\te: '⠑',\n\t\tf: '⠋',\n\t\tg: '⠛',\n\t\th: '⠓',\n\t\ti: '⠊',\n\t\tj: '⠚',\n\t\tk: '⠅',\n\t\tl: '⠇',\n\t\tm: '⠍',\n\t\tn: '⠝',\n\t\to: '⠕',\n\t\tp: '⠏',\n\t\tq: '⠟',\n\t\tr: '⠗',\n\t\ts: '⠎',\n\t\tt: '⠞',\n\t\tu: '⠥',\n\t\tv: '⠧',\n\t\tw: '⠺',\n\t\tx: '⠭',\n\t\ty: '⠽',\n\t\tz: '⠵',\n\t\t0: '⠼⠚',\n\t\t1: '⠼⠁',\n\t\t2: '⠼⠃',\n\t\t3: '⠼⠉',\n\t\t4: '⠼⠙',\n\t\t5: '⠼⠑',\n\t\t6: '⠼⠋',\n\t\t7: '⠼⠛',\n\t\t8: '⠼⠓',\n\t\t9: '⠼⠊'\n\t};\n\n\treturn map[character] || character;\n\n}\n\nconst BrailleTranslator = {\n\toninit({ state }) {\n\t\tstate.input = m.prop('');\n\t\tstate.output = state.input.map(function(text) {\n\t\t\treturn text\n\t\t\t\t.toLowerCase()\n\t\t\t\t.split('')\n\t\t\t\t.map(mapAsciiToBraille)\n\t\t\t\t.join('');\n\t\t});\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('div', 'Enter ascii text:'),\n\t\t\t\tm('input[type=text]', {\n\t\t\t\t\tplaceholder: 'input',\n\t\t\t\t\tvalue: state.input(),\n\t\t\t\t\toninput: m.withAttr('value', state.input)\n\t\t\t\t}),\n\t\t\t\tm('hr'),\n\t\t\t\tm('div', 'Braille:'),\n\t\t\t\tm('div', state.output())\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$12 = codeString(
"function mapAsciiToBraille(character) {\n\n\tconst map = {\n\t\ta: '⠁',\n\t\tb: '⠃',\n\t\tc: '⠉',\n\t\td: '⠙',\n\t\te: '⠑',\n\t\tf: '⠋',\n\t\tg: '⠛',\n\t\th: '⠓',\n\t\ti: '⠊',\n\t\tj: '⠚',\n\t\tk: '⠅',\n\t\tl: '⠇',\n\t\tm: '⠍',\n\t\tn: '⠝',\n\t\to: '⠕',\n\t\tp: '⠏',\n\t\tq: '⠟',\n\t\tr: '⠗',\n\t\ts: '⠎',\n\t\tt: '⠞',\n\t\tu: '⠥',\n\t\tv: '⠧',\n\t\tw: '⠺',\n\t\tx: '⠭',\n\t\ty: '⠽',\n\t\tz: '⠵',\n\t\t0: '⠼⠚',\n\t\t1: '⠼⠁',\n\t\t2: '⠼⠃',\n\t\t3: '⠼⠉',\n\t\t4: '⠼⠙',\n\t\t5: '⠼⠑',\n\t\t6: '⠼⠋',\n\t\t7: '⠼⠛',\n\t\t8: '⠼⠓',\n\t\t9: '⠼⠊'\n\t};\n\n\treturn map[character] || character;\n\n}\n\nconst BrailleTranslator = {\n\toninit({ state }) {\n\t\tstate.input = m.prop('');\n\t\tstate.output = state.input.map(function(text) {\n\t\t\treturn text\n\t\t\t\t.toLowerCase()\n\t\t\t\t.split('')\n\t\t\t\t.map(mapAsciiToBraille)\n\t\t\t\t.join('');\n\t\t});\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<div>Enter ascii text:</div>\n\t\t\t\t<input\n\t\t\t\t\ttype='text'\n\t\t\t\t\tvalue={state.input()}\n\t\t\t\t\toninput={m.withAttr('value', state.input)}/>\n\t\t\t\t<hr/>\n\t\t\t\t<div>Braille:</div>\n\t\t\t\t<div>{state.output()}</div>\n\t\t\t</div>\n\t\t);\n\t}\n};");

var code$12 = [
	{ id: 'es5', code: es5$12 },
	{ id: 'es6', code: es6$12 },
	{ id: 'jsx', code: jsx$12 }
];


function mapAsciiToBraille(character) {

	var map = {
		a: '⠁',
		b: '⠃',
		c: '⠉',
		d: '⠙',
		e: '⠑',
		f: '⠋',
		g: '⠛',
		h: '⠓',
		i: '⠊',
		j: '⠚',
		k: '⠅',
		l: '⠇',
		m: '⠍',
		n: '⠝',
		o: '⠕',
		p: '⠏',
		q: '⠟',
		r: '⠗',
		s: '⠎',
		t: '⠞',
		u: '⠥',
		v: '⠧',
		w: '⠺',
		x: '⠭',
		y: '⠽',
		z: '⠵',
		0: '⠼⠚',
		1: '⠼⠁',
		2: '⠼⠃',
		3: '⠼⠉',
		4: '⠼⠙',
		5: '⠼⠑',
		6: '⠼⠋',
		7: '⠼⠛',
		8: '⠼⠓',
		9: '⠼⠊'
	};

	return map[character] || character;

}

var Component$12 = {
	oninit: function oninit(ref) {
		var state = ref.state;

		state.input = index.prop('');
		state.output = state.input.map(function(text) {
			return text
				.toLowerCase()
				.split('')
				.map(mapAsciiToBraille)
				.join('');
		});
	},
	view: function view(ref) {
		var state = ref.state;

		return (
			index('div',
				index('div', 'Enter ascii text:'),
				index('input[type=text]', {
					placeholder: 'input',
					value: state.input(),
					oninput: index.withAttr('value', state.input)
				}),
				index('hr'),
				index('div', 'Braille:'),
				index('div', state.output())
			)
		);
	}
};

function view$6() {
	return (
		index(Page, { id: 'Applications' },
			index('.Section',
				index('h2', 'Todo list'),
				index('p',
					'This example is ported over from the React.js documentation in order to demonstrate ',
					'some of the differences between Mithril\'s syntax and React\'s.'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$10 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$10))
					)
				)
			),
			index('.Section',
				index('h2', 'Shopping cart'),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$11 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$11))
					)
				)
			),
			index('.Section',
				index('h2', 'Braille Translator'),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$12 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$12))
					)
				)
			)
		)
	);
}

var Applications = {
	view: view$6
};

var es5$13 = codeString(
"var BookView = {\n\toninit: function(vnode) {\n\t\tvnode.state.books = m.request({\n\t\t\tmethod: 'GET',\n\t\t\turl: 'https://mithril-examples.firebaseio.com/books.json',\n\t\t\tinitialValue: []\n\t\t});\n\t},\n\tview: function(vnode) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('h3', 'Books'),\n\t\t\t\tm('ul',\n\t\t\t\t\tvnode.state.books().map(function(book, i) {\n\t\t\t\t\t\treturn m('li', { key: i }, book.name);\n\t\t\t\t\t})\n\t\t\t\t)\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$13 = codeString(
"const BookView = {\n\toninit({ state }) {\n\t\tstate.books = m.request({\n\t\t\tmethod: 'GET',\n\t\t\turl: 'https://mithril-examples.firebaseio.com/books.json',\n\t\t\tinitialValue: []\n\t\t});\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('h3', 'Books'),\n\t\t\t\tm('ul',\n\t\t\t\t\tstate.books().map((book, i) =>\n\t\t\t\t\t\tm('li', { key: i }, book.name)\n\t\t\t\t\t)\n\t\t\t\t)\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$13 = codeString(
"const BookView = {\n\toninit({ state }) {\n\t\tstate.books = m.request({\n\t\t\tmethod: 'GET',\n\t\t\turl: 'https://mithril-examples.firebaseio.com/books.json',\n\t\t\tinitialValue: []\n\t\t});\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<h3>Books</h3>\n\t\t\t\t<ul>\n\t\t\t\t\t{\n\t\t\t\t\t\tstate.books().map((book, i) =>\n\t\t\t\t\t\t\t<li key={i}>{book.name}</li>\n\t\t\t\t\t\t)\n\t\t\t\t\t}\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t);\n\t}\n};");

var code$13 = [
	{ id: 'es5', code: es5$13 },
	{ id: 'es6', code: es6$13 },
	{ id: 'jsx', code: jsx$13 }
];

// Fetches an array of books objects of the form:
// { name: String, price: Number }
var Component$13 = {
	oninit: function oninit(ref) {
		var state = ref.state;

		state.books = index.request({
			method: 'GET',
			url: 'https://mithril-examples.firebaseio.com/books.json',
			initialValue: []
		});
	},
	view: function view(ref) {
		var state = ref.state;

		return (
			index('div',
				index('h3', 'Books'),
				index('ul',
					state.books().map(function (book, i) { return index('li', { key: i }, book.name); }
					)
				)
			)
		);
	}
};

var es5$14 = codeString(
"var BookView = {\n\toninit: function(vnode) {\n\t\tvnode.state.books = m.prop([]);\n\t\tfetch('https://mithril-examples.firebaseio.com/books.json')\n\t\t\t.then(function(response) {\n\t\t\t\treturn response.json();\n\t\t\t})\n\t\t\t.then(vnode.state.books)\n\t\t\t.then(function() {\n\t\t\t\tm.redraw();\n\t\t\t});\n\t},\n\tview: function(vnode) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('h3', 'Books'),\n\t\t\t\tm('ul',\n\t\t\t\t\tvnode.state.books().map(function(book, i) {\n\t\t\t\t\t\treturn m('li', { key: i }, book.name);\n\t\t\t\t\t})\n\t\t\t\t)\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$14 = codeString(
"const BookView = {\n\toninit({ state }) {\n\t\tstate.books = m.prop([]);\n\t\tfetch('https://mithril-examples.firebaseio.com/books.json')\n\t\t\t.then((response) => response.json())\n\t\t\t.then(state.books)\n\t\t\t.then(() => m.redraw());\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\tm('div',\n\t\t\t\tm('h3', 'Books'),\n\t\t\t\tm('ul',\n\t\t\t\t\tstate.books().map((book, i) =>\n\t\t\t\t\t\tm('li', { key: i }, book.name)\n\t\t\t\t\t)\n\t\t\t\t)\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$14 = codeString(
"const BookView = {\n\toninit({ state }) {\n\t\tstate.books = m.prop([]);\n\t\tfetch('https://mithril-examples.firebaseio.com/books.json')\n\t\t\t.then((response) => response.json())\n\t\t\t.then(state.books)\n\t\t\t.then(() => m.redraw());\n\t},\n\tview({ state }) {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<h3>Books</h3>\n\t\t\t\t<ul>\n\t\t\t\t\t{\n\t\t\t\t\t\tstate.books().map((book, i) =>\n\t\t\t\t\t\t\t<li key={i}>{book.name}</li>\n\t\t\t\t\t\t)\n\t\t\t\t\t}\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t);\n\t}\n};");

var code$14 = [
	{ id: 'es5', code: es5$14 },
	{ id: 'es6', code: es6$14 },
	{ id: 'jsx', code: jsx$14 }
];

var Component$14 = {
	oninit: function oninit(ref) {
		var state = ref.state;

		state.books = index.prop([]);
		fetch('https://mithril-examples.firebaseio.com/books.json')
			.then(function (response) { return response.json(); })
			.then(state.books)
			.then(function () { return index.redraw(); });
	},
	view: function view(ref) {
		var state = ref.state;

		return (
			index('div',
				index('h3', 'Books'),
				index('ul',
					state.books().map(function (book, i) { return index('li', { key: i }, book.name); }
					)
				)
			)
		);
	}
};

function view$7() {
	return (
		index(Page, { id: 'Requests' },
			index('.Section',
				index('h2', 'Render fetched list'),
				index('p',
					index('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/request.md]',
						index('code.inline', 'm.request')
					),
					' performs an AJAX request against a specified url and returns a ',
					index('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/prop.md]', 'stream'),
					' whose value becomes the data fetched from the server.'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$13 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$13))
					)
				)
			),
			index('.Section',
				index('h2', 'Equivalent using fetch api'),
				index('p',
					index('code.inline', 'm.request'),
					' is similar to the native fetch api, but adds automatic redrawing upon completion, ',
					'converts the response to JSON, and resolves to a stream. For comparison, the following ',
					'code is the equivalent of the first example, using the native fetch api instead.'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$14 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$14))
					)
				)
			)
		)
	);
}

var Requests = {
	view: view$7
};

var es5$15 = codeString(
"var RouteView = {\n\tview: function() {\n\t\treturn m('div', 'Current route: ', m.route.get());\n\t}\n};");

var es6$15 = codeString(
"const RouteView = {\n\tview() {\n\t\treturn m('div', 'Current route: ', m.route.get());\n\t}\n};");

var jsx$15 = codeString(
"const RouteView = {\n\tview() {\n\t\treturn <div>Current route: {m.route.get()}</div>;\n\t}\n};");

var code$15 = [
	{ id: 'es5', code: es5$15 },
	{ id: 'es6', code: es6$15 },
	{ id: 'jsx', code: jsx$15 }
];

var Component$15 = {
	view: function view() {
		return index('div', 'Current route: ', index.route.get());
	}
};

var es5$16 = codeString(
"var LinkView = {\n\tview: function() {\n\t\treturn (\n\t\t\tm('ul',\n\t\t\t\tm('li',\n\t\t\t\t\tm('a[href=/routing]', {\n\t\t\t\t\t\toncreate: m.route.link\n\t\t\t\t\t}, 'Routing page (root)')\n\t\t\t\t),\n\t\t\t\tm('li',\n\t\t\t\t\tm('a[href=/routing/foo]', {\n\t\t\t\t\t\toncreate: m.route.link\n\t\t\t\t\t}, '/routing/foo')\n\t\t\t\t),\n\t\t\t\tm('li',\n\t\t\t\t\tm('a[href=/routing/bar]', {\n\t\t\t\t\t\toncreate: m.route.link\n\t\t\t\t\t}, '/routing/bar')\n\t\t\t\t)\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$16 = codeString(
"const LinkView = {\n\tview() {\n\t\treturn (\n\t\t\tm('ul',\n\t\t\t\tm('li',\n\t\t\t\t\tm('a[href=/routing]', {\n\t\t\t\t\t\toncreate: m.route.link\n\t\t\t\t\t}, 'Routing page (root)')\n\t\t\t\t),\n\t\t\t\tm('li',\n\t\t\t\t\tm('a[href=/routing/foo]', {\n\t\t\t\t\t\toncreate: m.route.link\n\t\t\t\t\t}, '/routing/foo')\n\t\t\t\t),\n\t\t\t\tm('li',\n\t\t\t\t\tm('a[href=/routing/bar]', {\n\t\t\t\t\t\toncreate: m.route.link\n\t\t\t\t\t}, '/routing/bar')\n\t\t\t\t)\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$16 = codeString(
"const LinkView = {\n\tview() {\n\t\treturn (\n\t\t\t<ul>\n\t\t\t\t<li>\n\t\t\t\t\t<a href='/routing' oncreate={m.route.link}>\n\t\t\t\t\t\tRouting page (root)\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\t\t\t\t<li>\n\t\t\t\t\t<a href='/routing/foo' oncreate={m.route.link}>\n\t\t\t\t\t\t/routing/foo\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\t\t\t\t<li>\n\t\t\t\t\t<a href='/routing/bar' oncreate={m.route.link}>\n\t\t\t\t\t\t/routing/bar\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t);\n\t}\n};");

var code$16 = [
	{ id: 'es5', code: es5$16 },
	{ id: 'es6', code: es6$16 },
	{ id: 'jsx', code: jsx$16 }
];

var Component$16 = {
	view: function view() {
		return (
			index('ul',
				index('li',
					index('a[href=/routing]', {
						oncreate: index.route.link
					}, 'Routing page (root)')
				),
				index('li',
					index('a[href=/routing/foo]', {
						oncreate: index.route.link
					}, '/routing/foo')
				),
				index('li',
					index('a[href=/routing/bar]', {
						oncreate: index.route.link
					}, '/routing/bar')
				)
			)
		);
	}
};

var es5$17 = codeString(
"var ButtonView = {\n\tview: function() {\n\t\treturn (\n\t\t\tm('ul',\n\t\t\t\tm('li',\n\t\t\t\t\tm('button', {\n\t\t\t\t\t\tonclick: function() { m.route.set('/routing') }\n\t\t\t\t\t}, 'Routing page (root)')\n\t\t\t\t),\n\t\t\t\tm('li',\n\t\t\t\t\tm('button', {\n\t\t\t\t\t\tonclick: function() { m.route.set('/routing/foo') }\n\t\t\t\t\t}, '/routing/foo')\n\t\t\t\t),\n\t\t\t\tm('li',\n\t\t\t\t\tm('button', {\n\t\t\t\t\t\tonclick: function() { m.route.set('/routing/bar') }\n\t\t\t\t\t}, '/routing/bar')\n\t\t\t\t)\n\t\t\t)\n\t\t);\n\t}\n};");

var es6$17 = codeString(
"const ButtonView = {\n\tview() {\n\t\treturn (\n\t\t\tm('ul',\n\t\t\t\tm('li',\n\t\t\t\t\tm('button', {\n\t\t\t\t\t\tonclick: () => m.route.set('/routing')\n\t\t\t\t\t}, 'Routing page (root)')\n\t\t\t\t),\n\t\t\t\tm('li',\n\t\t\t\t\tm('button', {\n\t\t\t\t\t\tonclick: () => m.route.set('/routing/foo')\n\t\t\t\t\t}, '/routing/foo')\n\t\t\t\t),\n\t\t\t\tm('li',\n\t\t\t\t\tm('button', {\n\t\t\t\t\t\tonclick: () => m.route.set('/routing/bar')\n\t\t\t\t\t}, '/routing/bar')\n\t\t\t\t)\n\t\t\t)\n\t\t);\n\t}\n};");

var jsx$17 = codeString(
"const ButtonView = {\n\tview() {\n\t\treturn (\n\t\t\t<ul>\n\t\t\t\t<li>\n\t\t\t\t\t<button onclick={() => m.route.set('/routing')}>\n\t\t\t\t\t\tRouting page (root)\n\t\t\t\t\t</button>\n\t\t\t\t</li>\n\t\t\t\t<li>\n\t\t\t\t\t<button onclick={() => m.route.set('/routing/foo')}>\n\t\t\t\t\t\t/routing/foo\n\t\t\t\t\t</button>\n\t\t\t\t</li>\n\t\t\t\t<li>\n\t\t\t\t\t<button onclick={() => m.route.set('/routing/bar')}>\n\t\t\t\t\t\t/routing/bar\n\t\t\t\t\t</button>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t);\n\t}\n};");

var code$17 = [
	{ id: 'es5', code: es5$17 },
	{ id: 'es6', code: es6$17 },
	{ id: 'jsx', code: jsx$17 }
];

var Component$17 = {
	view: function view() {
		return (
			index('ul',
				index('li',
					index('button', {
						onclick: function () { return index.route.set('/routing'); }
					}, 'Routing page (root)')
				),
				index('li',
					index('button', {
						onclick: function () { return index.route.set('/routing/foo'); }
					}, '/routing/foo')
				),
				index('li',
					index('button', {
						onclick: function () { return index.route.set('/routing/bar'); }
					}, '/routing/bar')
				)
			)
		);
	}
};

function view$8(ref) {
	var attrs = ref.attrs;

	return (
		index(Page, { id: 'Routing' },
			index('.Section',
				index('h2', 'Getting the current route'),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$15 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$15))
					)
				)
			),
			index('.Section',
				index('h2', 'Setting the current route (with links)'),
				index('p',
					'When using links (',
					index('code.inline', 'a'),
					' elements), Mithril provides a method that prevents the default behavior of links ',
					'(which would refresh the page unnecessarily) and ensures that those links adhere to the ',
					'current routing mode, whether it\'s hash based, query string based, or pathname based. ',
					'For any links that do not route away from the current site, use ',
					index('code.inline', 'm.route.link'),
					' in that link\'s ',
					index('code.inline', 'oncreate'),
					' lifecycle method.'
				),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$16 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$16))
					)
				)
			),
			index('.Section',
				index('h2', 'Setting the current route programmatically'),
				index('.Demo',
					index('.Demo-left',
						index(Tabs, { tabs: code$17 })
					),
					index('.Demo-right',
						index('.Demo-result', index(Component$17))
					)
				)
			),
			index('.Section',
				index('h2', 'Further reading'),
				index('p',
					'Take a look at the ',
					index('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/route.md]', 'official router documentation'),
					' for more information on how routing works in Mithril. ',
					'The implementation of the router used for this website can be found ',
					index('a[href=https://github.com/sebastiansandqvist/mithril-examples/blob/master/src/index.js?ts=2]', 'on github'),
					'.'
				)
			)
		)
	);
}

var Routing = {
	view: view$8
};

function view$9() {
	return (
		index(Page, { id: 'm.prop' })
	);
}

var Prop = {
	view: view$9
};

var routes = {
	'/': GettingStarted,
	'/gettingstarted': GettingStarted,
	'/components': Components,
	'/applications': Applications,
	'/requests': Requests,
	'/routing': Routing,
	'/routing/:param': Routing,
	'/mprop': Prop
};

index.route.prefix('');
index.route(document.getElementById('app'), '/', routes);

}());
