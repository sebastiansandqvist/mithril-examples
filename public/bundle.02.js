(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var fetch$1 = createCommonjsModule(function (module) {
(function() {
  'use strict';

  // if __disableNativeFetch is set to true, the it will always polyfill fetch
  // with Ajax.
  if (!self.__disableNativeFetch && self.fetch) {
    return
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var list = this.map[name];
    if (!list) {
      list = [];
      this.map[name] = list;
    }
    list.push(value);
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)];
    return values ? values[0] : null
  };

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)];
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this);
      }, this);
    }, this);
  };

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob, options) {
    var reader = new FileReader();
    var contentType = options.headers.map['content-type'] ? options.headers.map['content-type'].toString() : '';
    var regex = /charset\=[0-9a-zA-Z\-\_]*;?/;
    var _charset = blob.type.match(regex) || contentType.match(regex);
    var args = [blob];

    if(_charset) {
      args.push(_charset[0].replace(/^charset\=/, '').replace(/;$/, ''));
    }

    reader.readAsText.apply(reader, args);
    return fileReaderReady(reader)
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function Body() {
    this.bodyUsed = false;


    this._initBody = function(body, options) {
      this._bodyInit = body;
      if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
        this._options = options;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (!body) {
        this._bodyText = '';
      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
        // Only support ArrayBuffers for POST method.
        // Receiving ArrayBuffers happens via Blobs, instead.
      } else {
        throw new Error('unsupported BodyInit type')
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      };

      this.text = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob, this._options)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      };
    } else {
      this.text = function() {
        var rejected = consumed(this);
        return rejected ? rejected : Promise.resolve(this._bodyText)
      };
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = input;
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body, options);
  }

  Request.prototype.clone = function() {
    return new Request(this)
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form
  }

  function headers(xhr) {
    var head = new Headers();
    var pairs = xhr.getAllResponseHeaders().trim().split('\n');
    pairs.forEach(function(header) {
      var split = header.trim().split(':');
      var key = split.shift().trim();
      var value = split.join(':').trim();
      head.append(key, value);
    });
    return head
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this._initBody(bodyInit, options);
    this.type = 'default';
    this.status = options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText;
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
    this.url = options.url || '';
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request;
      if (Request.prototype.isPrototypeOf(input) && !init) {
        request = input;
      } else {
        request = new Request(input, init);
      }

      var xhr = new XMLHttpRequest();

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return;
      }

      var __onLoadHandled = false;

      function onload() {
        if (xhr.readyState !== 4) {
          return
        }
        var status = (xhr.status === 1223) ? 204 : xhr.status;
        if (status < 100 || status > 599) {
          if (__onLoadHandled) { return; } else { __onLoadHandled = true; }
          reject(new TypeError('Network request failed'));
          return
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        };
        var body = 'response' in xhr ? xhr.response : xhr.responseText;

        if (__onLoadHandled) { return; } else { __onLoadHandled = true; }
        resolve(new Response(body, options));
      }
      xhr.onreadystatechange = onload;
      xhr.onload = onload;
      xhr.onerror = function() {
        if (__onLoadHandled) { return; } else { __onLoadHandled = true; }
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      // `withCredentials` should be setted after calling `.open` in IE10
      // http://stackoverflow.com/a/19667959/1219343
      try {
        if (request.credentials === 'include') {
          if ('withCredentials' in xhr) {
            xhr.withCredentials = true;
          } else {
            console && console.warn && console.warn('withCredentials is not supported, you can ignore this warning');
          }
        }
      } catch (e) {
        console && console.warn && console.warn('set withCredentials error:' + e);
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  };
  self.fetch.polyfill = true;

  // Support CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = self.fetch;
  }
})();
});

var mithril = createCommonjsModule(function (module) {
new function() {

function Vnode(tag, key, attrs0, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: {}, events: undefined, instance: undefined, skip: false}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) { return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined) }
	if (node != null && typeof node !== "object") { return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined) }
	return node
};
Vnode.normalizeChildren = function normalizeChildren(children) {
	for (var i = 0; i < children.length; i++) {
		children[i] = Vnode.normalize(children[i]);
	}
	return children
};
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
var selectorCache = {};
function hyperscript(selector) {
	var arguments$1 = arguments;

	if (selector == null || typeof selector !== "string" && typeof selector.view !== "function") {
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
				if (match[4] === "class") { classes.push(attrValue); }
				else { attributes[match[4]] = attrValue || true; }
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
			if (Array.isArray(children) && children.length == 1 && children[0] != null && children[0].tag === "#") { text = children[0].children; }
			else { childList = children; }
			return Vnode(tag || "div", attrs.key, hasAttrs ? attrs : undefined, childList, text, undefined)
		};
	}
	var attrs, children, childrenIndex;
	if (arguments[1] == null || typeof arguments[1] === "object" && arguments[1].tag === undefined && !Array.isArray(arguments[1])) {
		attrs = arguments[1];
		childrenIndex = 2;
	}
	else { childrenIndex = 1; }
	if (arguments.length === childrenIndex + 1) {
		children = Array.isArray(arguments[childrenIndex]) ? arguments[childrenIndex] : [arguments[childrenIndex]];
	}
	else {
		children = [];
		for (var i = childrenIndex; i < arguments.length; i++) { children.push(arguments$1[i]); }
	}
	if (typeof selector === "string") { return selectorCache[selector](attrs || {}, Vnode.normalizeChildren(children)) }
	return Vnode(selector, attrs && attrs.key, attrs || {}, Vnode.normalizeChildren(children), undefined, undefined)
}
hyperscript.trust = function(html) {
	if (html == null) { html = ""; }
	return Vnode("<", undefined, undefined, html, undefined, undefined)
};
hyperscript.fragment = function(attrs1, children) {
	return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
};
var m = hyperscript;
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) { throw new Error("Promise must be called with `new`") }
	if (typeof executor !== "function") { throw new TypeError("executor must be a function") }
	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false);
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors};
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout;
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then;
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) { throw new TypeError("Promise can't be resolved w/ itself") }
					executeOnce(then.bind(value));
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) { console.error("Possible unhandled promise rejection:", value); }
						for (var i = 0; i < list.length; i++) { list[i](value); }
						resolvers.length = 0, rejectors.length = 0;
						instance.state = shouldAbsorb;
						instance.retry = function() {execute(value);};
					});
				}
			}
			catch (e) {
				rejectCurrent(e);
			}
		}
	}
	function executeOnce(then) {
		var runs = 0;
		function run(fn) {
			return function(value) {
				if (runs++ > 0) { return }
				fn(value);
			}
		}
		var onerror = run(rejectCurrent);
		try {then(run(resolveCurrent), onerror);} catch (e) {onerror(e);}
	}
	executeOnce(executor);
};
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance;
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") { next(value); }
			else { try {resolveNext(callback(value));} catch (e) {if (rejectNext) { rejectNext(e); }} }
		});
		if (typeof instance.retry === "function" && state === instance.state) { instance.retry(); }
	}
	var resolveNext, rejectNext;
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject;});
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false);
	return promise
};
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
};
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) { return value }
	return new PromisePolyfill(function(resolve) {resolve(value);})
};
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value);})
};
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = [];
		if (list.length === 0) { resolve([]); }
		else { for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++;
					values[i] = value;
					if (count === total) { resolve(values); }
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject);
				}
				else { consume(list[i]); }
			})(i);
		} }
	})
};
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject);
		}
	})
};
if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") { window.Promise = PromisePolyfill; }
	var PromisePolyfill = window.Promise;
} else if (typeof commonjsGlobal !== "undefined") {
	if (typeof commonjsGlobal.Promise === "undefined") { commonjsGlobal.Promise = PromisePolyfill; }
	var PromisePolyfill = commonjsGlobal.Promise;
} else {
}
var buildQueryString = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") { return "" }
	var args = [];
	for (var key0 in object) {
		destructure(key0, object[key0]);
	}
	return args.join("&")
	function destructure(key0, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key0 + "[" + i + "]", value[i]);
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key0 + "[" + i + "]", value[i]);
			}
		}
		else { args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : "")); }
	}
};
var _8 = function($window, Promise) {
	var callbackCount = 0;
	var oncompletion;
	function setCompletionCallback(callback) {oncompletion = callback;}
	function finalizer() {
		var count = 0;
		function complete() {if (--count === 0 && typeof oncompletion === "function") { oncompletion(); }}
		return function finalize(promise0) {
			var then0 = promise0.then;
			promise0.then = function() {
				count++;
				var next = then0.apply(promise0, arguments);
				next.then(complete, function(e) {
					complete();
					if (count === 0) { throw e }
				});
				return finalize(next)
			};
			return promise0
		}
	}
	function normalize(args, extra) {
		if (typeof args === "string") {
			var url = args;
			args = extra || {};
			if (args.url == null) { args.url = url; }
		}
		return args
	}
	function request(args, extra) {
		var finalize = finalizer();
		args = normalize(args, extra);
		var promise0 = new Promise(function(resolve, reject) {
			if (args.method == null) { args.method = "GET"; }
			args.method = args.method.toUpperCase();
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
			if (args.withCredentials) { xhr.withCredentials = args.withCredentials; }
			for (var key in args.headers) { if ({}.hasOwnProperty.call(args.headers, key)) {
				xhr.setRequestHeader(key, args.headers[key]);
			} }
			if (typeof args.config === "function") { xhr = args.config(xhr, args) || xhr; }
			xhr.onreadystatechange = function() {
				// Don't throw errors on xhr.abort(). XMLHttpRequests ends up in a state of
				// xhr.status == 0 and xhr.readyState == 4 if aborted after open, but before completion.
				if (xhr.status && xhr.readyState === 4) {
					try {
						var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args));
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
							resolve(cast(args.type, response));
						}
						else {
							var error = new Error(xhr.responseText);
							for (var key in response) { error[key] = response[key]; }
							reject(error);
						}
					}
					catch (e) {
						reject(e);
					}
				}
			};
			if (useBody && (args.data != null)) { xhr.send(args.data); }
			else { xhr.send(); }
		});
		return args.background === true ? promise0 : finalize(promise0)
	}
	function jsonp(args, extra) {
		var finalize = finalizer();
		args = normalize(args, extra);
		var promise0 = new Promise(function(resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++;
			var script = $window.document.createElement("script");
			$window[callbackName] = function(data) {
				script.parentNode.removeChild(script);
				resolve(cast(args.type, data));
				delete $window[callbackName];
			};
			script.onerror = function() {
				script.parentNode.removeChild(script);
				reject(new Error("JSONP request failed"));
				delete $window[callbackName];
			};
			if (args.data == null) { args.data = {}; }
			args.url = interpolate(args.url, args.data);
			args.data[args.callbackKey || "callback"] = callbackName;
			script.src = assemble(args.url, args.data);
			$window.document.documentElement.appendChild(script);
		});
		return args.background === true? promise0 : finalize(promise0)
	}
	function interpolate(url, data) {
		if (data == null) { return url }
		var tokens = url.match(/:[^\/]+/gi) || [];
		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i].slice(1);
			if (data[key] != null) {
				url = url.replace(tokens[i], data[key]);
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
	function cast(type0, data) {
		if (typeof type0 === "function") {
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					data[i] = new type0(data[i]);
				}
			}
			else { return new type0(data) }
		}
		return data
	}
	return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
};
var requestService = _8(window, PromisePolyfill);
var coreRenderer = function($window) {
	var $doc = $window.document;
	var $emptyFragment = $doc.createDocumentFragment();
	var onevent;
	function setEventCallback(callback) {return onevent = callback}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i];
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling);
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag;
		if (vnode.attrs != null) { initLifecycle(vnode.attrs, vnode, hooks); }
		if (typeof tag === "string") {
			switch (tag) {
				case "#": return createText(parent, vnode, nextSibling)
				case "<": return createHTML(parent, vnode, nextSibling)
				case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
				default: return createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else { return createComponent(parent, vnode, hooks, ns, nextSibling) }
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children);
		insertNode(parent, vnode.dom, nextSibling);
		return vnode.dom
	}
	function createHTML(parent, vnode, nextSibling) {
		var match1 = vnode.children.match(/^\s*?<(\w+)/im) || [];
		var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div";
		var temp = $doc.createElement(parent1);
		temp.innerHTML = vnode.children;
		vnode.dom = temp.firstChild;
		vnode.domSize = temp.childNodes.length;
		var fragment = $doc.createDocumentFragment();
		var child;
		while (child = temp.firstChild) {
			fragment.appendChild(child);
		}
		insertNode(parent, fragment, nextSibling);
		return fragment
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment();
		if (vnode.children != null) {
			var children = vnode.children;
			createNodes(fragment, children, 0, children.length, hooks, null, ns);
		}
		vnode.dom = fragment.firstChild;
		vnode.domSize = fragment.childNodes.length;
		insertNode(parent, fragment, nextSibling);
		return fragment
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag;
		switch (vnode.tag) {
			case "svg": ns = "http://www.w3.org/2000/svg"; break
			case "math": ns = "http://www.w3.org/1998/Math/MathML"; break
		}
		var attrs2 = vnode.attrs;
		var is = attrs2 && attrs2.is;
		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag);
		vnode.dom = element;
		if (attrs2 != null) {
			setAttrs(vnode, attrs2, ns);
		}
		insertNode(parent, element, nextSibling);
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode);
		}
		else {
			if (vnode.text != null) {
				if (vnode.text !== "") { element.textContent = vnode.text; }
				else { vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]; }
			}
			if (vnode.children != null) {
				var children = vnode.children;
				createNodes(element, children, 0, children.length, hooks, null, ns);
				setLateAttrs(vnode);
			}
		}
		return element
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		vnode.state = Object.create(vnode.tag);
		var view = vnode.tag.view;
		if (view.reentrantLock != null) { return $emptyFragment }
		view.reentrantLock = true;
		initLifecycle(vnode.tag, vnode, hooks);
		vnode.instance = Vnode.normalize(view.call(vnode.state, vnode));
		view.reentrantLock = null;
		if (vnode.instance != null) {
			if (vnode.instance === vnode) { throw Error("A view cannot return the vnode it received as arguments") }
			var element = createNode(parent, vnode.instance, hooks, ns, nextSibling);
			vnode.dom = vnode.instance.dom;
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0;
			insertNode(parent, element, nextSibling);
			return element
		}
		else {
			vnode.domSize = 0;
			return $emptyFragment
		}
	}
	//update
	function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) { return }
		else if (old == null) { createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, undefined); }
		else if (vnodes == null) { removeNodes(old, 0, old.length, vnodes); }
		else {
			if (old.length === vnodes.length) {
				var isUnkeyed = false;
				for (var i = 0; i < vnodes.length; i++) {
					if (vnodes[i] != null && old[i] != null) {
						isUnkeyed = vnodes[i].key == null && old[i].key == null;
						break
					}
				}
				if (isUnkeyed) {
					for (var i = 0; i < old.length; i++) {
						if (old[i] === vnodes[i]) { continue }
						else if (old[i] == null && vnodes[i] != null) { createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling)); }
						else if (vnodes[i] == null) { removeNodes(old, i, i + 1, vnodes); }
						else { updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), false, ns); }
					}
					return
				}
			}
			recycling = recycling || isRecyclable(old, vnodes);
			if (recycling) { old = old.concat(old.pool); }
			
			var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map;
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldStart], v = vnodes[start];
				if (o === v && !recycling) { oldStart++, start++; }
				else if (o == null) { oldStart++; }
				else if (v == null) { start++; }
				else if (o.key === v.key) {
					oldStart++, start++;
					updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), recycling, ns);
					if (recycling && o.tag === v.tag) { insertNode(parent, toFragment(o), nextSibling); }
				}
				else {
					var o = old[oldEnd];
					if (o === v && !recycling) { oldEnd--, start++; }
					else if (o == null) { oldEnd--; }
					else if (v == null) { start++; }
					else if (o.key === v.key) {
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
				else if (o == null) { oldEnd--; }
				else if (v == null) { end--; }
				else if (o.key === v.key) {
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
							var dom = createNode(parent, v, hooks, undefined, nextSibling);
							nextSibling = dom;
						}
					}
					end--;
				}
				if (end < start) { break }
			}
			createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);
			removeNodes(old, oldStart, oldEnd + 1, vnodes);
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		var oldTag = old.tag, tag = vnode.tag;
		if (oldTag === tag) {
			vnode.state = old.state;
			vnode.events = old.events;
			if (shouldUpdate(vnode, old)) { return }
			if (vnode.attrs != null) {
				updateLifecycle(vnode.attrs, vnode, hooks, recycling);
			}
			if (typeof oldTag === "string") {
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, nextSibling); break
					case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, recycling, hooks, ns);
				}
			}
			else { updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns); }
		}
		else {
			removeNode(old, null);
			createNode(parent, vnode, hooks, ns, nextSibling);
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children;
		}
		vnode.dom = old.dom;
	}
	function updateHTML(parent, old, vnode, nextSibling) {
		if (old.children !== vnode.children) {
			toFragment(old);
			createHTML(parent, vnode, nextSibling);
		}
		else { vnode.dom = old.dom, vnode.domSize = old.domSize; }
	}
	function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns);
		var domSize = 0, children = vnode.children;
		vnode.dom = null;
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				if (child != null && child.dom != null) {
					if (vnode.dom == null) { vnode.dom = child.dom; }
					domSize += child.domSize || 1;
				}
			}
			if (domSize !== 1) { vnode.domSize = domSize; }
		}
	}
	function updateElement(old, vnode, recycling, hooks, ns) {
		var element = vnode.dom = old.dom;
		switch (vnode.tag) {
			case "svg": ns = "http://www.w3.org/2000/svg"; break
			case "math": ns = "http://www.w3.org/1998/Math/MathML"; break
		}
		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) { vnode.attrs = {}; }
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text; //FIXME handle0 multiple children
				vnode.text = undefined;
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns);
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode);
		}
		else if (old.text != null && vnode.text != null && vnode.text !== "") {
			if (old.text.toString() !== vnode.text.toString()) { old.dom.firstChild.nodeValue = vnode.text; }
		}
		else {
			if (old.text != null) { old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]; }
			if (vnode.text != null) { vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]; }
			updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns);
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		vnode.instance = Vnode.normalize(vnode.tag.view.call(vnode.state, vnode));
		updateLifecycle(vnode.tag, vnode, hooks, recycling);
		if (vnode.instance != null) {
			if (old.instance == null) { createNode(parent, vnode.instance, hooks, ns, nextSibling); }
			else { updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns); }
			vnode.dom = vnode.instance.dom;
			vnode.domSize = vnode.instance.domSize;
		}
		else if (old.instance != null) {
			removeNode(old.instance, null);
			vnode.dom = undefined;
			vnode.domSize = 0;
		}
		else {
			vnode.dom = old.dom;
			vnode.domSize = old.domSize;
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
			var vnode = vnodes[i];
			if (vnode != null) {
				var key2 = vnode.key;
				if (key2 != null) { map[key2] = i; }
			}
		}
		return map
	}
	function toFragment(vnode) {
		var count0 = vnode.domSize;
		if (count0 != null || vnode.dom == null) {
			var fragment = $doc.createDocumentFragment();
			if (count0 > 0) {
				var dom = vnode.dom;
				while (--count0) { fragment.appendChild(dom.nextSibling); }
				fragment.insertBefore(dom, fragment.firstChild);
			}
			return fragment
		}
		else { return vnode.dom }
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
	function setContentEditable(vnode) {
		var children = vnode.children;
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children;
			if (vnode.dom.innerHTML !== content) { vnode.dom.innerHTML = content; }
		}
		else if (vnode.text != null || children != null && children.length !== 0) { throw new Error("Child node of a contenteditable must be trusted") }
	}
	//remove
	function removeNodes(vnodes, start, end, context) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i];
			if (vnode != null) {
				if (vnode.skip) { vnode.skip = false; }
				else { removeNode(vnode, context); }
			}
		}
	}
	function removeNode(vnode, context) {
		var expected = 1, called = 0;
		if (vnode.attrs && vnode.attrs.onbeforeremove) {
			var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode);
			if (result != null && typeof result.then === "function") {
				expected++;
				result.then(continuation, continuation);
			}
		}
		if (typeof vnode.tag !== "string" && vnode.tag.onbeforeremove) {
			var result = vnode.tag.onbeforeremove.call(vnode.state, vnode);
			if (result != null && typeof result.then === "function") {
				expected++;
				result.then(continuation, continuation);
			}
		}
		continuation();
		function continuation() {
			if (++called === expected) {
				onremove(vnode);
				if (vnode.dom) {
					var count0 = vnode.domSize || 1;
					if (count0 > 1) {
						var dom = vnode.dom;
						while (--count0) {
							removeNodeFromDOM(dom.nextSibling);
						}
					}
					removeNodeFromDOM(vnode.dom);
					if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
						if (!context.pool) { context.pool = [vnode]; }
						else { context.pool.push(vnode); }
					}
				}
			}
		}
	}
	function removeNodeFromDOM(node) {
		var parent = node.parentNode;
		if (parent != null) { parent.removeChild(node); }
	}
	function onremove(vnode) {
		if (vnode.attrs && vnode.attrs.onremove) { vnode.attrs.onremove.call(vnode.state, vnode); }
		if (typeof vnode.tag !== "string" && vnode.tag.onremove) { vnode.tag.onremove.call(vnode.state, vnode); }
		if (vnode.instance != null) { onremove(vnode.instance); }
		else {
			var children = vnode.children;
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i];
					if (child != null) { onremove(child); }
				}
			}
		}
	}
	//attrs2
	function setAttrs(vnode, attrs2, ns) {
		for (var key2 in attrs2) {
			setAttr(vnode, key2, null, attrs2[key2], ns);
		}
	}
	function setAttr(vnode, key2, old, value, ns) {
		var element = vnode.dom;
		if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) { return }
		var nsLastIndex = key2.indexOf(":");
		if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
			element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value);
		}
		else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") { updateEvent(vnode, key2, value); }
		else if (key2 === "style") { updateStyle(element, old, value); }
		else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
			//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
			if (vnode.tag === "input" && key2 === "value" && vnode.dom.value === value && vnode.dom === $doc.activeElement) { return }
			//setting select[value] to same value while having select open blinks select dropdown in Chrome
			if (vnode.tag === "select" && key2 === "value" && vnode.dom.value === value && vnode.dom === $doc.activeElement) { return }
			//setting option[value] to same value while having select open blinks select dropdown in Chrome
			if (vnode.tag === "option" && key2 === "value" && vnode.dom.value === value) { return }
			element[key2] = value;
		}
		else {
			if (typeof value === "boolean") {
				if (value) { element.setAttribute(key2, ""); }
				else { element.removeAttribute(key2); }
			}
			else { element.setAttribute(key2 === "className" ? "class" : key2, value); }
		}
	}
	function setLateAttrs(vnode) {
		var attrs2 = vnode.attrs;
		if (vnode.tag === "select" && attrs2 != null) {
			if ("value" in attrs2) { setAttr(vnode, "value", null, attrs2.value, undefined); }
			if ("selectedIndex" in attrs2) { setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined); }
		}
	}
	function updateAttrs(vnode, old, attrs2, ns) {
		if (attrs2 != null) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, old && old[key2], attrs2[key2], ns);
			}
		}
		if (old != null) {
			for (var key2 in old) {
				if (attrs2 == null || !(key2 in attrs2)) {
					if (key2 === "className") { key2 = "class"; }
					if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) { updateEvent(vnode, key2, undefined); }
					else if (key2 !== "key") { vnode.dom.removeAttribute(key2); }
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function isAttribute(attr) {
		return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
	}
	function isCustomElement(vnode){
		return vnode.attrs.is || vnode.tag.indexOf("-") > -1
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
			for (var key2 in style) {
				element.style[key2] = style[key2];
			}
			if (old != null && typeof old !== "string") {
				for (var key2 in old) {
					if (!(key2 in style)) { element.style[key2] = ""; }
				}
			}
		}
	}
	//event
	function updateEvent(vnode, key2, value) {
		var element = vnode.dom;
		var callback = typeof onevent !== "function" ? value : function(e) {
			var result = value.call(element, e);
			onevent.call(element, e);
			return result
		};
		if (key2 in element) { element[key2] = typeof value === "function" ? callback : null; }
		else {
			var eventName = key2.slice(2);
			if (vnode.events === undefined) { vnode.events = {}; }
			if (vnode.events[key2] === callback) { return }
			if (vnode.events[key2] != null) { element.removeEventListener(eventName, vnode.events[key2], false); }
			if (typeof value === "function") {
				vnode.events[key2] = callback;
				element.addEventListener(eventName, vnode.events[key2], false);
			}
		}
	}
	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") { source.oninit.call(vnode.state, vnode); }
		if (typeof source.oncreate === "function") { hooks.push(source.oncreate.bind(vnode.state, vnode)); }
	}
	function updateLifecycle(source, vnode, hooks, recycling) {
		if (recycling) { initLifecycle(source, vnode, hooks); }
		else if (typeof source.onupdate === "function") { hooks.push(source.onupdate.bind(vnode.state, vnode)); }
	}
	function shouldUpdate(vnode, old) {
		var forceVnodeUpdate, forceComponentUpdate;
		if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") { forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old); }
		if (typeof vnode.tag !== "string" && typeof vnode.tag.onbeforeupdate === "function") { forceComponentUpdate = vnode.tag.onbeforeupdate.call(vnode.state, vnode, old); }
		if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
			vnode.dom = old.dom;
			vnode.domSize = old.domSize;
			vnode.instance = old.instance;
			return true
		}
		return false
	}
	function render(dom, vnodes) {
		if (!dom) { throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.") }
		var hooks = [];
		var active = $doc.activeElement;
		// First time0 rendering into a node clears it out
		if (dom.vnodes == null) { dom.textContent = ""; }
		if (!Array.isArray(vnodes)) { vnodes = [vnodes]; }
		updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, undefined);
		dom.vnodes = vnodes;
		for (var i = 0; i < hooks.length; i++) { hooks[i](); }
		if ($doc.activeElement !== active) { active.focus(); }
	}
	return {render: render, setEventCallback: setEventCallback}
};
function throttle(callback) {
	//60fps translates to 16.6ms, round it down since setTimeout requires int
	var time = 16;
	var last = 0, pending = null;
	var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout;
	return function() {
		var now = Date.now();
		if (last === 0 || now - last >= time) {
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
}
var _11 = function($window) {
	var renderService = coreRenderer($window);
	renderService.setEventCallback(function(e) {
		if (e.redraw !== false) { redraw(); }
	});
	var callbacks = [];
	function subscribe(key1, callback) {
		unsubscribe(key1);
		callbacks.push(key1, throttle(callback));
	}
	function unsubscribe(key1) {
		var index = callbacks.indexOf(key1);
		if (index > -1) { callbacks.splice(index, 2); }
	}
    function redraw() {
        for (var i = 1; i < callbacks.length; i += 2) {
            callbacks[i]();
        }
    }
	return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
};
var redrawService = _11(window);
requestService.setCompletionCallback(redrawService.redraw);
var _16 = function(redrawService0) {
	return function(root, component) {
		if (component === null) {
			redrawService0.render(root, []);
			redrawService0.unsubscribe(root);
			return
		}
		
		if (component.view == null) { throw new Error("m.mount(element, component) expects a component, not a vnode") }
		
		var run0 = function() {
			redrawService0.render(root, Vnode(component));
		};
		redrawService0.subscribe(root, run0);
		redrawService0.redraw();
	}
};
m.mount = _16(redrawService);
var Promise = PromisePolyfill;
var parseQueryString = function(string) {
	if (string === "" || string == null) { return {} }
	if (string.charAt(0) === "?") { string = string.slice(1); }
	var entries = string.split("&"), data0 = {}, counters = {};
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=");
		var key5 = decodeURIComponent(entry[0]);
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : "";
		if (value === "true") { value = true; }
		else if (value === "false") { value = false; }
		var levels = key5.split(/\]\[?|\[/);
		var cursor = data0;
		if (key5.indexOf("[") > -1) { levels.pop(); }
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1];
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10));
			var isValue = j === levels.length - 1;
			if (level === "") {
				var key5 = levels.slice(0, j).join();
				if (counters[key5] == null) { counters[key5] = 0; }
				level = counters[key5]++;
			}
			if (cursor[level] == null) {
				cursor[level] = isValue ? value : isNumber ? [] : {};
			}
			cursor = cursor[level];
		}
	}
	return data0
};
var coreRouter = function($window) {
	var supportsPushState = typeof $window.history.pushState === "function";
	var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout;
	function normalize1(fragment0) {
		var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent);
		if (fragment0 === "pathname" && data[0] !== "/") { data = "/" + data; }
		return data
	}
	var asyncId;
	function debounceAsync(callback0) {
		return function() {
			if (asyncId != null) { return }
			asyncId = callAsync0(function() {
				asyncId = null;
				callback0();
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
			for (var key4 in queryParams) { queryData[key4] = queryParams[key4]; }
		}
		if (hashIndex > -1) {
			var hashParams = parseQueryString(path.slice(hashIndex + 1));
			for (var key4 in hashParams) { hashData[key4] = hashParams[key4]; }
		}
		return path.slice(0, pathEnd)
	}
	var router = {prefix: "#!"};
	router.getPath = function() {
		var type2 = router.prefix.charAt(0);
		switch (type2) {
			case "#": return normalize1("hash").slice(router.prefix.length)
			case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
			default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
		}
	};
	router.setPath = function(path, data, options) {
		var queryData = {}, hashData = {};
		path = parsePath(path, queryData, hashData);
		if (data != null) {
			for (var key4 in data) { queryData[key4] = data[key4]; }
			path = path.replace(/:([^\/]+)/g, function(match2, token) {
				delete queryData[token];
				return data[token]
			});
		}
		var query = buildQueryString(queryData);
		if (query) { path += "?" + query; }
		var hash = buildQueryString(hashData);
		if (hash) { path += "#" + hash; }
		if (supportsPushState) {
			var state = options ? options.state : null;
			var title = options ? options.title : null;
			$window.onpopstate();
			if (options && options.replace) { $window.history.replaceState(state, title, router.prefix + path); }
			else { $window.history.pushState(state, title, router.prefix + path); }
		}
		else { $window.location.href = router.prefix + path; }
	};
	router.defineRoutes = function(routes, resolve, reject) {
		function resolveRoute() {
			var path = router.getPath();
			var params = {};
			var pathname = parsePath(path, params, params);
			var state = $window.history.state;
			if (state != null) {
				for (var k in state) { params[k] = state[k]; }
			}
			for (var route0 in routes) {
				var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");
				if (matcher.test(pathname)) {
					pathname.replace(matcher, function() {
						var keys = route0.match(/:[^\/]+/g) || [];
						var values = [].slice.call(arguments, 1, -2);
						for (var i = 0; i < keys.length; i++) {
							params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i]);
						}
						resolve(routes[route0], params, path, route0);
					});
					return
				}
			}
			reject(path, params);
		}
		if (supportsPushState) { $window.onpopstate = debounceAsync(resolveRoute); }
		else if (router.prefix.charAt(0) === "#") { $window.onhashchange = resolveRoute; }
		resolveRoute();
	};
	return router
};
var _20 = function($window, redrawService0) {
	var routeService = coreRouter($window);
	var identity = function(v) {return v};
	var render1, component, attrs3, currentPath, lastUpdate;
	var route = function(root, defaultRoute, routes) {
		if (root == null) { throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined") }
		var run1 = function() {
			if (render1 != null) { redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3))); }
		};
		var bail = function(path) {
			if (path !== defaultRoute) { routeService.setPath(defaultRoute, null, {replace: true}); }
			else { throw new Error("Could not resolve default route " + defaultRoute) }
		};
		routeService.defineRoutes(routes, function(payload, params, path) {
			var update = lastUpdate = function(routeResolver, comp) {
				if (update !== lastUpdate) { return }
				component = comp != null && typeof comp.view === "function" ? comp : "div", attrs3 = params, currentPath = path, lastUpdate = null;
				render1 = (routeResolver.render || identity).bind(routeResolver);
				run1();
			};
			if (payload.view) { update({}, payload); }
			else {
				if (payload.onmatch) {
					Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
						update(payload, resolved);
					}, bail);
				}
				else { update(payload, "div"); }
			}
		}, bail);
		redrawService0.subscribe(root, run1);
	};
	route.set = function(path, data, options) {
		if (lastUpdate != null) { options = {replace: true}; }
		lastUpdate = null;
		routeService.setPath(path, data, options);
	};
	route.get = function() {return currentPath};
	route.prefix = function(prefix0) {routeService.prefix = prefix0;};
	route.link = function(vnode1) {
		vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href);
		vnode1.dom.onclick = function(e) {
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) { return }
			e.preventDefault();
			e.redraw = false;
			var href = this.getAttribute("href");
			if (href.indexOf(routeService.prefix) === 0) { href = href.slice(routeService.prefix.length); }
			route.set(href, undefined, undefined);
		};
	};
	route.param = function(key3) {
		if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") { return attrs3[key3] }
		return attrs3
	};
	return route
};
m.route = _20(window, redrawService);
m.withAttr = function(attrName, callback1, context) {
	return function(e) {
		callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName));
	}
};
var _28 = coreRenderer(window);
m.render = _28.render;
m.redraw = redrawService.redraw;
m.request = requestService.request;
m.jsonp = requestService.jsonp;
m.parseQueryString = parseQueryString;
m.buildQueryString = buildQueryString;
m.version = "1.0.1";
m.vnode = Vnode;
if (typeof module !== "undefined") { module["exports"] = m; }
else { window.m = m; }
};
});

function getType(x) {
	var currentType = Object.prototype.toString.call(x).slice(8, -1).toLowerCase();
	if (currentType === 'array' && x.length > 0) {
		return '[array of ' + getType(x[0]) + 's]';
	}
	return currentType;
}

function typeStringFromArray(arr) {
	if (arr.length === 1) {
		return arr[0].type;
	}
	return arr.map(function(typeCheckFn) {
		return typeCheckFn.type;
	}).join(' || ');
}

function T(schema) {

	return function(props, label) {

		var loop = function ( key ) {

			if (schema.hasOwnProperty(key)) {

				var rules = Array.isArray(schema[key]) ? schema[key] : [schema[key]];
				var success = rules.reduce(function(prev, rule) {
					return prev || rule(props[key]);
				}, false);

				if (!success) {

					// recursive call will report errors in next round of checks
					if (typeStringFromArray(rules).indexOf('interface') > -1) {
						return;
					}

					var errorMessage =
						'Failed type check in ' + (label || 'unknown object') + '\n' +
						'Expected prop \'' + key + '\' of type ' + typeStringFromArray(rules) + '\n' +
						'You provided \'' + key + '\' of type ' + getType(props[key]);

					console.error(errorMessage);
					return { v: errorMessage };
				}
			
			}

		};

		for (var key in schema) {
			var returned = loop( key );

			if ( returned ) return returned.v;
		}

		for (var key$1 in props) {
			if (props.hasOwnProperty(key$1) && !schema.hasOwnProperty(key$1)) {
				var errorMessage$1 = 'Did not expect to find prop \'' + key$1 + '\' in ' + label;
				console.error(errorMessage$1);
				return errorMessage$1;
			}
		}

		return null;

	};

}

T.fn = T['function'] = function(x) {
	return typeof x === 'function';
};

T.fn.type = 'function';

T.str = T.string = function(x) {
	return typeof x === 'string';
};

T.str.type = 'string';

T.num = T.number = function(x) {
	return typeof x === 'number';
};

T.num.type = 'number';

T.date = function(x) {
	return getType(x) === 'date';
};

T.date.type = 'date';

T.NULL = T['null'] = function(x) {
	return getType(x) === 'null';
};

T.NULL.type = 'null';

T.nil = function(x) {
	return typeof x === 'undefined' || getType(x) === 'null';
};

T.nil.type = 'nil';

T.obj = T.object = function(x) {
	return getType(x) === 'object';
};

T.obj.type = 'object';

T.arr = T.array = function(x) {
	return Array.isArray(x);
};

T.arr.type = 'array';

T.arrayOf = function(propType) {

	var arrayOfType = function(x) {

		if (!Array.isArray(x)) {
			return false;
		}

		for (var i = 0; i < x.length; i++) {
			if (!propType(x[i])) {
				return false;
			}
		}

		return true;

	};

	arrayOfType.type = '[array of ' + propType.type + 's]';

	return arrayOfType;

};

T['int'] = T.integer = function(x) {
	return typeof x === 'number' && isFinite(x) && Math.floor(x) === x;
};


T.integer.type = 'integer';

T.optional = T.undefined = function(x) {
	return typeof x === 'undefined';
};

T.optional.type = 'undefined';

T.bool = T['boolean'] = function(x) {
	return typeof x === 'boolean';
};

T.bool.type = 'boolean';

T.any = function() {
	return true;
};

T.any.type = 'any';

// recursive
T.schema = T['interface'] = function(schema) {
	var schemaType = function(prop) {
		return !T(schema)(prop, 'nested interface'); // returns null if success, so invert as boolean
	};
	schemaType.type = 'interface';
	return schemaType;
};

var index$1 = T;

var pages = [
	'Getting started',
	'Components',
	'Requests',
	'Applications',
	'Routing'
	// 'Streams'
];

var linkType = index$1({
	page: index$1.string,
	active: index$1.string
});

var Link = {
	view: function view$1(ref) {
		var attrs = ref.attrs;


		if (window.__DEV__) {
			linkType(attrs, 'Link');
		}

		return (
			mithril('a.Nav-link', {
				href: ("/" + (attrs.page.replace(' ', '').toLowerCase())),
				oncreate: mithril.route.link,
				className: attrs.active === attrs.page ? 'active' : ''
			}, attrs.page)
		);
	}
};

var navType = index$1({ active: index$1.string });

function view$3(ref) {
	var attrs = ref.attrs;


	if (window.__DEV__) {
		navType(attrs, 'Nav');
	}

	return (
		mithril('.Nav',
			mithril('.Container',
				pages.map(function (page) { return mithril(Link, { page: page, active: attrs.active }); })
			)
		)
	);
}

var Nav = {
	view: view$3
};

var pageType = index$1({ id: index$1.string });

function view$2(ref) {
	var attrs = ref.attrs;
	var children = ref.children;


	if (window.__DEV__) {
		pageType(attrs, 'Page');
	}

	return (
		mithril('div',
			mithril('.Display',
				mithril('.Container',
					mithril('h1', 'Mithril.js examples')
				)
			),
			mithril(Nav, { active: attrs.id }),
			mithril('.Content',
				mithril('.Container', children)
			)
		)
	);
}

var Page = {
	view: view$2
};

var stream$2 = createCommonjsModule(function (module) {
"use strict";

var guid = 0, HALT = {};
function createStream() {
	function stream() {
		if (arguments.length > 0 && arguments[0] !== HALT) { updateStream(stream, arguments[0]); }
		return stream._state.value
	}
	initStream(stream);

	if (arguments.length > 0 && arguments[0] !== HALT) { updateStream(stream, arguments[0]); }

	return stream
}
function initStream(stream) {
	stream.constructor = createStream;
	stream._state = {id: guid++, value: undefined, state: 0, derive: undefined, recover: undefined, deps: {}, parents: [], endStream: undefined};
	stream.map = stream["fantasy-land/map"] = map, stream["fantasy-land/ap"] = ap, stream["fantasy-land/of"] = createStream;
	stream.valueOf = valueOf, stream.toJSON = toJSON, stream.toString = valueOf;

	Object.defineProperties(stream, {
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
function updateStream(stream, value) {
	updateState(stream, value);
	for (var id in stream._state.deps) { updateDependency(stream._state.deps[id], false); }
	finalize(stream);
}
function updateState(stream, value) {
	stream._state.value = value;
	stream._state.changed = true;
	if (stream._state.state !== 2) { stream._state.state = 1; }
}
function updateDependency(stream, mustSync) {
	var state = stream._state, parents = state.parents;
	if (parents.length > 0 && parents.every(active) && (mustSync || parents.some(changed))) {
		var value = stream._state.derive();
		if (value === HALT) { return false }
		updateState(stream, value);
	}
}
function finalize(stream) {
	stream._state.changed = false;
	for (var id in stream._state.deps) { stream._state.deps[id]._state.changed = false; }
}

function combine(fn, streams) {
	if (!streams.every(valid)) { throw new Error("Ensure that each item passed to m.prop.combine/m.prop.merge is a stream") }
	return initDependency(createStream(), streams, function() {
		return fn.apply(this, streams.concat([streams.filter(changed)]))
	})
}

function initDependency(dep, streams, derive) {
	var state = dep._state;
	state.derive = derive;
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
function ap(stream) {return combine(function(s1, s2) {return s1()(s2())}, [stream, this])}
function valueOf() {return this._state.value}
function toJSON() {return this._state.value != null && typeof this._state.value.toJSON === "function" ? this._state.value.toJSON() : this._state.value}

function valid(stream) {return stream._state }
function active(stream) {return stream._state.state === 1}
function changed(stream) {return stream._state.changed}
function notEnded(stream) {return stream._state.state !== 2}

function merge(streams) {
	return combine(function() {
		return streams.map(function(s) {return s()})
	}, streams)
}
createStream["fantasy-land/of"] = createStream;
createStream.merge = merge;
createStream.combine = combine;
createStream.HALT = HALT;

if (typeof module !== "undefined") { module["exports"] = createStream; }
else { window.stream = createStream; }
});

var stream = stream$2;

var tabType = index$1({
	fiddle: [index$1.string, index$1.optional],
	tabs: index$1.arrayOf(index$1.schema({
		id: index$1.string,
		code: index$1.string
	}))
});

function oninit$1(ref) {
	var state = ref.state;

	state.activeIndex = stream(0);
}

function view$4(ref) {
	var attrs = ref.attrs;
	var state = ref.state;


	if (window.__DEV__) {
		tabType(attrs, 'Tabs');
	}

	var fiddleButton = attrs.fiddle ? (
		mithril('a.FiddleLink', { href: ("https://jsfiddle.net/" + (attrs.fiddle) + "/") }, 'jsFiddle')
	) : null;

	return (
		mithril('.Tabs.drop20',
			mithril('.TabBar',
				mithril('div',
					attrs.tabs.map(function (tab, i) { return mithril('.Tab', {
							key: tab.id,
							className: state.activeIndex() === i ? 'active' : '',
							onclick: function () { return state.activeIndex(i); }
						}, tab.id); }
					)
				),
				fiddleButton
			),
			mithril('pre.TabContent',
				mithril('code', mithril.trust(attrs.tabs[state.activeIndex()].code))
			)
		)
	);
}

var Tabs = {
	oninit: oninit$1,
	view: view$4
};

function generateCode(fullString) {
	var output = [];
	var codeRegex = /(`(.*?)`)/gm;
	var split = fullString.split(codeRegex);
	var isCodeRaw = false;
	var isCode = false;
	for (var i = 0; i < split.length; i++) {
		isCodeRaw = codeRegex.test(split[i]);
		isCode = codeRegex.test(split[i - 1] || '');
		if (isCode) {
			output.push(mithril('code.inline', split[i]));
		}
		else if (!isCodeRaw) {
			output.push(mithril('span', split[i]));
		}
	}
	return output;
}

function generateLink(title, fullString) {
	var parenRegex = /\(([^)]+)\)/;
	var url = fullString.match(parenRegex)[1];
	if (url[0] === '/') {
		return mithril('a', { href: url, oncreate: mithril.route.link }, title);
	}
	return mithril('a', { href: url }, title);
}

function markup(str) {
	var codeRegex = /`(.*?)`/gm;
	var linkRegex = /(\[(.*?)\]\(.*?\))/gm;
	var output = [];
	var rawContents = str.split(linkRegex);
	var hasCode = false;
	var isLinkRaw = false;
	var isLink = false;
	for (var i = 0; i < rawContents.length; i++) {
		hasCode = codeRegex.test(rawContents[i]);
		isLinkRaw = linkRegex.test(rawContents[i]);
		isLink = linkRegex.test(rawContents[i - 1] || '');
		if (hasCode) {
			output.push(generateCode(rawContents[i]));
		}
		else if (isLink) {
			output.push(generateLink(rawContents[i], rawContents[i - 1])); // previous item is context with url
		}
		else if (!isLinkRaw) {
			output.push(rawContents[i]);
		}
	}
	return output;
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

codeString.css = function(str) {
	return prism.highlight(str, prism.languages.css);
};

var es5 = codeString(
"var HelloButton = {\n  view: function() {\n    return m('button', 'Hello world!');\n  }\n};");

var es6 = codeString(
"const HelloButton = {\n  view() {\n    return m('button', 'Hello world!');\n  }\n};");

var jsx = codeString(
"const HelloButton = {\n  view() {\n    return <button>Hello world!</button>;\n  }\n};");

var code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

var Component = {
  view: function view() {
    return mithril('button', 'Hello world!');
  }
};

var es5$1 = codeString(
"var HelloButton = {\n  view: function(vnode) {\n    return m('button', 'Hello ' + vnode.attrs.title);\n  }\n};\n\nvar Component = {\n  view: function() {\n    return (\n      m('div',\n        m(HelloButton, { title: 'world' }),\n        m(HelloButton, { title: 'everyone' }),\n        m(HelloButton, { title: 'darkness my old friend' })\n      )\n    );\n  }\n};");

var es6$1 = codeString(
"const HelloButton = {\n  view({ attrs }) {\n    return m('button', `Hello ${attrs.title}`);\n  }\n};\n\nconst Component = {\n  view() {\n    return (\n      m('div',\n        m(HelloButton, { title: 'world' }),\n        m(HelloButton, { title: 'everyone' }),\n        m(HelloButton, { title: 'darkness my old friend' })\n      )\n    );\n  }\n};");

var jsx$1 = codeString(
"const HelloButton = {\n  view({ attrs }) {\n    return <button>Hello {attrs.title}</button>;\n  }\n};\n\nconst Component = {\n  view() {\n    return (\n      <div>\n        <HelloButton title='world'/>\n        <HelloButton title='everyone'/>\n        <HelloButton title='darkness my old friend'/>\n      </div>\n    );\n  }\n};");

var code$1 = [
  { id: 'es5', code: es5$1 },
  { id: 'es6', code: es6$1 },
  { id: 'jsx', code: jsx$1 }
];

var HelloButton = {
  view: function view(ref) {
    var attrs = ref.attrs;

    return mithril('button', ("Hello " + (attrs.title)));
  }
};

var Component$1 = {
  view: function view$1() {
    return (
      mithril('div',
        mithril(HelloButton, { title: 'world'}),
        mithril(HelloButton, { title: 'everyone'}),
        mithril(HelloButton, { title: 'darkness my old friend'})
      )
    );
  }
};

var es5$2 = codeString(
"const HelloButton = {\n  view: function(vnode) {\n    return m('button', 'Hello ' + vnode.attrs.title);\n  }\n};\n\nvar Component = {\n  oninit: function(vnode) {\n    vnode.state.inputValue = ''; // initial state\n  },\n  view: function(vnode) {\n    return (\n      m('div',\n        m('input[type=text]', {\n          value: vnode.state.inputValue, // read from state\n          oninput: function(event) {\n            vnode.state.inputValue = event.target.value;\n          }\n        }),\n        m(HelloButton, {\n          title: vnode.state.inputValue\n        })\n      )\n    );\n  }\n};");

var es6$2 = codeString(
"const HelloButton = {\n  view({ attrs }) {\n    return m('button', `Hello ${attrs.title}`);\n  }\n};\n\nconst Component = {\n  oninit({ state }) {\n    state.inputValue = ''; // initial state\n  },\n  view({ state }) {\n    return (\n      m('div',\n        m('input[type=text]', {\n          value: state.inputValue, // read from state\n          oninput(event) {\n            state.inputValue = event.target.value;\n          }\n        }),\n        m(HelloButton, { title: state.inputValue })\n      )\n    );\n  }\n};");

var jsx$2 = codeString(
"const HelloButton = {\n  view({ attrs }) {\n    return <button>Hello {attrs.title}</button>;\n  }\n};\n\nconst Component = {\n  oninit({ state }) {\n    state.inputValue = ''; // initial state\n  },\n  view({ state }) {\n    return (\n      <div>\n        <input\n          type='text'\n          value={state.inputValue}\n          oninput={\n            (event) => { state.inputValue = event.target.value }\n          }/>\n        <HelloButton title={state.inputValue}/>\n      </div>\n    );\n  }\n};");

var code$2 = [
  { id: 'es5', code: es5$2 },
  { id: 'es6', code: es6$2 },
  { id: 'jsx', code: jsx$2 }
];

var HelloButton$1 = {
  view: function view(ref) {
    var attrs = ref.attrs;

    return mithril('button', ("Hello " + (attrs.title)));
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
      mithril('div',
        mithril('input[type=text]', {
          value: state.inputValue, // read the value from state
          oninput: function oninput(event) {
            state.inputValue = event.target.value;
          }
        }),
        mithril(HelloButton$1, { title: state.inputValue })
      )
    );
  }
};

var es5$3 = codeString(
"var stream = require('mithril/stream');\n\nvar HelloWorldButton = {\n  view: function(vnode) {\n    return m('button', 'Hello ' + vnode.attrs.title);\n  }\n};\n\nvar Component = {\n  oninit: function(vnode) {\n    vnode.state.inputValue = stream('');\n  },\n  view: function(vnode) {\n    return (\n      m('div',\n        m('input[type=text]', {\n          value: vnode.state.inputValue(),\n          oninput: m.withAttr('value', vnode.state.inputValue)\n        }),\n        m(HelloWorldButton, {\n          title: vnode.state.inputValue()\n        })\n      )\n    );\n  }\n};");

var es6$3 = codeString(
"import stream from 'mithril/stream';\n\nconst HelloWorldButton = {\n  view({ attrs }) {\n    return m('button', `Hello ${attrs.title}`);\n  }\n};\n\nconst Component = {\n  oninit({ state }) {\n    state.inputValue = stream('');\n  },\n  view({ state }) {\n    return (\n      m('div',\n        m('input[type=text]', {\n          value: state.inputValue(),\n          oninput: m.withAttr('value', state.inputValue)\n        }),\n        m(HelloWorldButton, { title: state.inputValue() })\n      )\n    );\n  }\n};");

var jsx$3 = codeString(
"import stream from 'mithril/stream';\n\nconst HelloWorldButton = {\n  view({ attrs }) {\n    return <button>Hello {attrs.title}</button>;\n  }\n};\n\nconst Component = {\n  oninit({ state }) {\n    state.inputValue = stream('');\n  },\n  view({ state }) {\n    return (\n      <div>\n        <input\n          type='text'\n          value={state.inputValue()}\n          oninput={m.withAttr('value', state.inputValue)}/>\n        <HelloWorldButton title={state.inputValue()}/>\n      </div>\n    );\n  }\n}");

var code$3 = [
  { id: 'es5', code: es5$3 },
  { id: 'es6', code: es6$3 },
  { id: 'jsx', code: jsx$3 }
];

var HelloWorldButton = {
  view: function view(ref) {
    var attrs = ref.attrs;

    return mithril('button', ("Hello " + (attrs.title)));
  }
};

var Component$3 = {
  oninit: function oninit(ref) {
    var state = ref.state;

    state.inputValue = stream('');
  },
  view: function view$1(ref) {
    var state = ref.state;

    return (
      mithril('div',
        mithril('input[type=text]', {
          value: state.inputValue(),
          oninput: mithril.withAttr('value', state.inputValue)
        }),
        mithril(HelloWorldButton, { title: state.inputValue() })
      )
    );
  }
};

var es5$4 = codeString(
"var stream = require('mithril/stream');\n\n// stateless functional component\nfunction HelloWorldButton(title) {\n  return m('button', 'Hello ' + title);\n}\n\n// stateless functional component\nfunction Input(valueStream) {\n  return m('input[type=text]', {\n    value: valueStream(),\n    oninput: m.withAttr('value', valueStream)\n  });\n}\n\n// stateful component\nvar Component = {\n  oninit: function(vnode) {\n    vnode.state.inputValue = stream('');\n  },\n  view: function(vnode) {\n    return (\n      m('div',\n        Input(vnode.state.inputValue),\n        HelloWorldButton(vnode.state.inputValue())\n      )\n    );\n  }\n};");

var es6$4 = codeString(
"import stream from 'mithril/stream';\n\n// stateless functional component\nfunction HelloWorldButton(title) {\n  return m('button', `Hello ${title}`);\n}\n\n// stateless functional component\nfunction Input(valueStream) {\n  return m('input[type=text]', {\n    value: valueStream(),\n    oninput: m.withAttr('value', valueStream)\n  });\n}\n\n// stateful component\nconst Component = {\n  oninit({ state }) {\n    state.inputValue = stream('');\n  },\n  view({ state }) {\n    return (\n      m('div',\n        Input(state.inputValue),\n        HelloWorldButton(state.inputValue())\n      )\n    );\n  }\n};");

var jsx$4 = codeString(
"import stream from 'mithril/stream';\n\n// stateless functional component\nfunction HelloWorldButton(title) {\n  return <button>Hello {title}</button>;\n}\n\n// stateless functional component\nfunction Input(valueStream) {\n  return (\n    <input\n      type=\"text\"\n      value={valueStream()}\n      oninput={m.withAttr('value', valueStream)}/>\n  );\n}\n\n// stateful component\nconst Component = {\n  oninit({ state }) {\n    state.inputValue = stream('');\n  },\n  view({ state }) {\n    return (\n      <div>\n        {Input(state.inputValue)}\n        {HelloWorldButton(state.inputValue())}\n      </div>\n    );\n  }\n};");

var code$4 = [
  { id: 'es5', code: es5$4 },
  { id: 'es6', code: es6$4 },
  { id: 'jsx', code: jsx$4 }
];

function HelloWorldButton$1(title) {
  return mithril('button', ("Hello " + title));
}

function Input(valueStream) {
  return mithril('input[type=text]', {
    value: valueStream(),
    oninput: mithril.withAttr('value', valueStream)
  });
}

var Component$4 = {
  oninit: function oninit(ref) {
    var state = ref.state;

    state.inputValue = stream('');
  },
  view: function view(ref) {
    var state = ref.state;

    return (
      mithril('div',
        Input(state.inputValue),
        HelloWorldButton$1(state.inputValue())
      )
    );
  }
};

function view$1$1() {
	return (
		mithril(Page, { id: 'Getting started' },
			mithril('.Section',
				mithril('h2', 'Overview'),
				mithril('p', 'Mithril is a client-side MVC framework. You can read more about it at the ',
					mithril('a[href=http://mithril.js.org]', 'official website'), '. ',
					'This is an unofficial guide and collection of examples using the ',
					mithril('a[href=https://github.com/lhorie/mithril.js/tree/rewrite/docs]', '1.0 version'),
					' of Mithril.js.'
				)
			),
			mithril('.Section',
				mithril('h2', 'Basic components'),
				mithril('p',
					'Every component is at minimum an object with a ',
					mithril('code.inline', 'view'),
					' method that returns a mithril virtual dom node.'
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code, fiddle: '69b1624v' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component))
					)
				),
				mithril('p',
					'The first argument to ',
					mithril('code.inline', 'm'),
					' is the element (as a css selector-like string) or component that should be rendered, and the optional last argument(s)',
					' are the children of that component.'
				),
				mithril('p',
					'Components can pass properties down to their children by passing in an object as the second argument in the call to ',
					mithril('code.inline', 'm'),
					'. Those properties become available to the component through the ',
					mithril('code.inline', 'attrs'),
					' object in the mithril virtual dom node.'
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$1, fiddle: 'amw7q2bv' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$1))
					)
				),
				mithril('p',
					'In addition to the ',
					mithril('code.inline', 'view'),
					' method, Mithril components have a variety of ',
					mithril('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/lifecycle-methods.renderToStaticMarkup]', 'lifecycle hooks'),
					'. Using the ',
					mithril('code.inline', 'oninit'),
					' lifecycle hook, which runs once immediately before rendering the component, ',
					' we can set the initial state. At this point it is worth noting that the ',
					mithril('code.inline', 'vnode'),
					' object that is passed to the ',
					mithril('code.inline', 'view'),
					' method contains, in addition to ',
					mithril('code.inline', 'attrs'),
					', a ',
					mithril('code.inline', 'state'),
					' object that can be used to store the state of that specific component.'
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$2, fiddle: 'ezh0f7sd' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$2))
					)
				),
				mithril('p',
					'Mithril provides two utilities ',
					mithril('code.inline', 'm.withAttr'),
					' and ',
					mithril('code.inline', 'stream'),
					' (not included by default with mithril) that help simplify this process.'
				),
				mithril('p',
					'A ',
					mithril('code.inline', mithril('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/stream.md]', 'stream')),
					' is, at its simplest, a getter-setter function, while ',
					mithril('code.inline', mithril('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/withAttr.md]', 'm.withAttr')),
					' creates an event handler that uses a specified dom element property as the argument to a provided callback. ',
					'We can use them both to simplify the previous code. All together, this is the final version of this example:'
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$3, fiddle: 'morgz8m0' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$3))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'Stateless functional components'),
				mithril('p',
					'With mithril, it is also possible to create components in a more functional style. ',
					'The following is another acceptable way to write mithril components:'
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$4 })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$4))
					)
				)
			)
		)
	);
}

var GettingStarted = {
	view: view$1$1
};

var es5$5 = codeString(
"var Stopwatch = {\n  oninit: function(vnode) {\n    vnode.state.seconds = 0;\n    vnode.state.count = function() {\n      vnode.state.seconds++;\n      m.redraw();\n    };\n    vnode.state.interval = setInterval(vnode.state.count, 1000);\n  },\n  onremove: function(vnode) {\n    clearInterval(vnode.state.interval);\n  },\n  view: function(vnode) {\n    return m('span', 'Timer: ' + vnode.state.seconds);\n  }\n};");

var es6$5 = codeString(
"const Stopwatch = {\n  oninit({ state }) {\n    state.seconds = 0;\n    state.count = () => {\n      state.seconds++;\n      m.redraw();\n    };\n    state.interval = setInterval(state.count, 1000);\n  },\n  onremove({ state }) {\n    clearInterval(state.interval);\n  },\n  view({ state }) {\n    return m('span', `Timer: ${state.seconds}`);\n  }\n};");

var jsx$5 = codeString(
"const Stopwatch = {\n  oninit({ state }) {\n    state.seconds = 0;\n    state.count = () => {\n      state.seconds++;\n      m.redraw();\n    };\n    state.interval = setInterval(state.count, 1000);\n  },\n  onremove({ state }) {\n    clearInterval(state.interval);\n  },\n  view({ state }) {\n    return <span>Timer: {state.seconds}</span>;\n  }\n};");

var code$5 = [
  { id: 'es5', code: es5$5 },
  { id: 'es6', code: es6$5 },
  { id: 'jsx', code: jsx$5 }
];

var Component$5 = {
  oninit: function oninit(ref) {
    var state = ref.state;

    state.seconds = 0;
    state.count = function () {
      state.seconds++;
      mithril.redraw();
    };
    state.interval = setInterval(state.count, 1000);
  },
  onremove: function onremove(ref) {
    var state = ref.state;

    clearInterval(state.interval);
  },
  view: function view(ref) {
    var state = ref.state;

    return mithril('span', ("Timer: " + (state.seconds)));
  }
};

var es5$6 = codeString(
"var Stopwatch = {\n  oninit: function(vnode) {\n    vnode.state.seconds = 0;\n    vnode.state.isPaused = false;\n    vnode.state.reset = function() {\n      vnode.state.seconds = 0;\n    };\n    vnode.state.toggle = function() {\n      vnode.state.isPaused = !vnode.state.isPaused;\n      clearInterval(vnode.state.interval);\n      if (!vnode.state.isPaused) {\n        vnode.state.interval =\n          setInterval(vnode.state.count, 1000);\n      }\n    };\n    vnode.state.count = function() {\n      vnode.state.seconds++;\n      m.redraw();\n    };\n    vnode.state.interval =\n      setInterval(vnode.state.count, 1000);\n  },\n  onremove: function(vnode) {\n    clearInterval(vnode.state.interval);\n  },\n  view: function(vnode) {\n    return (\n      m('div',\n        m('span', 'Timer: ' + vnode.state.seconds),\n        m('button', { onclick: vnode.state.reset }, 'Reset'),\n        m('button', {\n          onclick: vnode.state.toggle\n        }, state.isPaused ? 'Start' : 'Pause')\n      )\n    );\n  }\n};");

var es6$6 = codeString(
"const Stopwatch = {\n  oninit({ state }) {\n    state.seconds = 0;\n    state.isPaused = false;\n    state.reset = () => { state.seconds = 0; };\n    state.toggle = () => {\n      state.isPaused = !state.isPaused;\n      clearInterval(state.interval);\n      if (!state.isPaused) {\n        state.interval = setInterval(state.count, 1000);\n      }\n    };\n    state.count = () => {\n      state.seconds++;\n      m.redraw();\n    };\n    state.interval = setInterval(state.count, 1000);\n  },\n  onremove({ state }) {\n    clearInterval(state.interval);\n  },\n  view({ state }) {\n    return (\n      m('div',\n        m('span', `Timer: ${state.seconds}`),\n        m('button', { onclick: state.reset }, 'Reset'),\n        m('button', {\n          onclick: state.toggle\n        }, state.isPaused ? 'Start' : 'Pause')\n      )\n    );\n  }\n};");

var jsx$6 = codeString(
"const Stopwatch = {\n  oninit({ state }) {\n    state.seconds = 0;\n    state.isPaused = false;\n    state.reset = () => { state.seconds = 0; };\n    state.toggle = () => {\n      state.isPaused = !state.isPaused;\n      clearInterval(state.interval);\n      if (!state.isPaused) {\n        state.interval = setInterval(state.count, 1000);\n      }\n    };\n    state.count = () => {\n      state.seconds++;\n      m.redraw();\n    };\n    state.interval = setInterval(state.count, 1000);\n  },\n  onremove({ state }) {\n    clearInterval(state.interval);\n  },\n  view({ state }) {\n    return (\n      <div>\n        <span>Timer: {state.seconds}</span>\n        <button onclick={state.reset}>Reset</button>\n        <button onclick={state.toggle}>\n          {state.isPaused ? 'Start' : 'Pause'}\n        </button>\n      )\n    );\n  }\n};");

var code$6 = [
  { id: 'es5', code: es5$6 },
  { id: 'es6', code: es6$6 },
  { id: 'jsx', code: jsx$6 }
];

var Component$6 = {
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
      mithril.redraw();
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
      mithril('div',
        mithril('span', ("Timer: " + (state.seconds))),
        mithril('button', { onclick: state.reset }, 'Reset'),
        mithril('button', { onclick: state.toggle }, state.isPaused ? 'Start' : 'Pause')
      )
    );
  }
};

var es5$7 = codeString(
"var Rotator = {\n  oninit: function(vnode) {\n    vnode.state.list = ['One', 'Two', 'Three', 'Four'];\n    vnode.state.rotate = function() {\n      vnode.state.list.push(vnode.state.list.shift());\n    };\n  },\n  view: function(vnode) {\n    return (\n      m('div',\n        m('ul',\n          state.list.map(function(item) {\n            return m('li', { key: item }, item)\n          }\n        ),\n        m('button', { onclick: state.rotate }, 'Rotate')\n      )\n    );\n  }\n};");

var es6$7 = codeString(
"const Rotator = {\n  oninit({ state }) {\n    state.list = ['One', 'Two', 'Three', 'Four'];\n    state.rotate = () => state.list.push(state.list.shift());\n  },\n  view({ state }) {\n    return (\n      m('div',\n        m('ul',\n          state.list.map((item) =>\n            m('li', { key: item }, item)\n          )\n        ),\n        m('button', { onclick: state.rotate }, 'Rotate')\n      )\n    );\n  }\n};");

var jsx$7 = codeString(
"const Rotator = {\n  oninit({ state }) {\n    state.list = ['One', 'Two', 'Three', 'Four'];\n    state.rotate = () => state.list.push(state.list.shift());\n  },\n  view({ state }) {\n    return (\n      <div>\n        <ul>\n          {\n            state.list.map((item) =>\n              <li key={item}>{item}</li>\n            )\n          }\n        </ul>\n        <button onclick={state.rotate}>Rotate</button>\n      </div>\n    );\n  }\n};");

var code$7 = [
  { id: 'es5', code: es5$7 },
  { id: 'es6', code: es6$7 },
  { id: 'jsx', code: jsx$7 }
];

var Component$7 = {
  oninit: function oninit(ref) {
    var state = ref.state;

    state.list = ['One', 'Two', 'Three', 'Four'];
    state.rotate = function () { return state.list.push(state.list.shift()); };
  },
  view: function view(ref) {
    var state = ref.state;

    return (
      mithril('div',
        mithril('ul',
          state.list.map(function (item) { return mithril('li', { key: item }, item); }
          )
        ),
        mithril('button', { onclick: state.rotate }, 'Rotate')
      )
    );
  }
};

var es5$8 = codeString(
"var stream = require('mithril/stream');\n\nvar PasswordInput = {\n  oninit: function(vnode) {\n    vnode.state.visible = stream(false);\n    vnode.state.value = stream('');\n    vnode.state.toggle = function() {\n      vnode.state.visible(!vnode.state.visible());\n    };\n  },\n  view: function(vnode) {\n    return (\n      m('div',\n        m('input', {\n          type: vnode.state.visible() ? 'text' : 'password',\n          placeholder: vnode.state.visible() ?\n            'password' : '••••••••',\n          value: vnode.state.value(),\n          oninput: m.withAttr('value', vnode.state.value)\n        }),\n        m('button', {\n          onclick: vnode.state.toggle\n        }, vnode.state.visible() ? 'Hide' : 'Show')\n      )\n    );\n  }\n};");

var es6$8 = codeString(
"import stream from 'mithril/stream';\n\nconst PasswordInput = {\n  oninit({ state }) {\n    state.visible = stream(false);\n    state.value = stream('');\n    state.toggle = () => state.visible(!state.visible());\n  },\n  view({ state }) {\n    return (\n      m('div',\n        m('input', {\n          type: state.visible() ? 'text' : 'password',\n          placeholder: state.visible() ? 'password' : '••••••••',\n          value: state.value(),\n          oninput: m.withAttr('value', state.value)\n        }),\n        m('button', {\n          onclick: state.toggle\n        }, state.visible() ? 'Hide' : 'Show')\n      )\n    );\n  }\n};");

var jsx$8 = codeString(
"import stream from 'mithril/stream';\n\nconst PasswordInput = {\n  oninit({ state }) {\n    state.visible = stream(false);\n    state.value = stream('');\n    state.toggle = () => state.visible(!state.visible());\n  },\n  view({ state }) {\n    return (\n      <div>\n        <input\n          type={state.visible() ? 'text' : 'password'}\n          placeholder={state.visible() ? 'password' : '••••••••'}\n          value={state.value()}\n          oninput={m.withAttr('value', state.value)}/>\n        <button onclick={state.toggle}>\n          {state.visible() ? 'Hide' : 'Show'}\n        </button>\n      </div>\n    );\n  }\n};");

var code$8 = [
  { id: 'es5', code: es5$8 },
  { id: 'es6', code: es6$8 },
  { id: 'jsx', code: jsx$8 }
];

var Component$8 = {
  oninit: function oninit(ref) {
    var state = ref.state;

    state.visible = stream(false);
    state.value = stream('');
    state.toggle = function () { return state.visible(!state.visible()); };
  },
  view: function view(ref) {
    var state = ref.state;

    return (
      mithril('div',
        mithril('input', {
          type: state.visible() ? 'text' : 'password',
          placeholder: state.visible() ? 'password' : '••••••••',
          value: state.value(),
          oninput: mithril.withAttr('value', state.value)
        }),
        mithril('button', {
          onclick: state.toggle
        }, state.visible() ? 'Hide' : 'Show')
      )
    );
  }
};

var es5$9 = codeString(
"var stream = require('mithril/stream');\n\nfunction setHeight(domNode) {\n  domNode.style.height = ''; // reset before recalculating\n  domNode.style.height = domNode.scrollHeight + 'px';\n}\n\nvar Textarea = {\n  oninit: function(vnode) {\n    vnode.state.value = stream();\n  },\n  oncreate: function(vnode) {\n    vnode.state.value.run(function() {\n      setHeight(vnode.dom);\n    )};\n  },\n  view: function(vnode) {\n    return m('textarea', {\n      value: vnode.state.value(),\n      oninput: m.withAttr('value', vnode.state.value)\n    });\n  }\n};");

var es6$9 = codeString(
"import stream from 'mithril/stream';\n\nfunction setHeight(domNode) {\n  domNode.style.height = ''; // reset before recalculating\n  domNode.style.height = `${domNode.scrollHeight}px`;\n}\n\nconst Textarea = {\n  oninit({ state }) {\n    state.value = stream();\n  },\n  oncreate({ dom, state }) {\n    state.value.run(() => setHeight(dom));\n  },\n  view({ state }) {\n    return m('textarea', {\n      value: state.value(),\n      oninput: m.withAttr('value', state.value)\n    });\n  }\n};");

var jsx$9 = codeString(
"import stream from 'mithril/stream';\n\nfunction setHeight(domNode) {\n  domNode.style.height = ''; // reset before recalculating\n  domNode.style.height = `${domNode.scrollHeight}px`;\n}\n\nconst Textarea = {\n  oninit({ state }) {\n    state.value = stream();\n  },\n  oncreate({ dom, state }) {\n    state.value.run(() => setHeight(dom));\n  },\n  view({ state }) {\n    return <textarea\n      value={state.value()}\n      oninput={m.withAttr('value', state.value)}/>;\n  }\n};");

var code$9 = [
  { id: 'es5', code: es5$9 },
  { id: 'es6', code: es6$9 },
  { id: 'jsx', code: jsx$9 }
];

function setHeight(domNode) {
  domNode.style.height = ''; // reset before recalculating
  domNode.style.height = (domNode.scrollHeight) + "px";
}

var Component$9 = {
  oninit: function oninit(ref) {
    var state = ref.state;

    state.value = stream();
  },
  oncreate: function oncreate(ref) {
    var dom = ref.dom;
    var state = ref.state;

    state.value.map(function () { return setHeight(dom); });
  },
  view: function view(ref) {
    var state = ref.state;

    return mithril('textarea', {
      value: state.value(),
      oninput: mithril.withAttr('value', state.value)
    });
  }
};

var es5$10 = codeString(
"var stream = require('mithril/stream');\n\nvar tabContent1 = [\n  { id: 'One', content: 'First tab' },\n  { id: 'Two', content: 'Second tab' },\n  { id: 'Three', content: 'Third tab' }\n];\n\nvar tabContent2 = [\n  { id: 'Lorem', content: 'Lorem ipsum...' },\n  { id: 'Ipsum', content: 'Duis aute...' }\n];\n\nvar Tabs = {\n  oninit: function(vnode) {\n    vnode.state.activeTab = stream(0);\n  },\n  view: function(vnode) {\n    var active = vnode.state.activeTab();\n    return (\n      m('.Tabs',\n        m('.TabBar',\n          vnode.attrs.tabs.map(function(tab, i) {\n            return m('.Tab', {\n              key: tab.id,\n              className: i === active ? 'active' : '',\n              onclick: function() {\n                vnode.state.activeTab(i);\n              }\n            }, tab.id)\n          })\n        ),\n        m('.TabContent', vnode.attrs.tabs[active].content)\n      )\n    );\n  }\n};\n\nvar Component = {\n  view: function() {\n    return (\n      m('div',\n        m(Tabs, { tabs: tabContent1 }),\n        m('br'),\n        m(Tabs, { tabs: tabContent2 })\n      )\n    );\n  }\n};");

var es6$10 = codeString(
"import stream from 'mithril/stream';\n\nconst tabContent1 = [\n  { id: 'One', content: 'First tab' },\n  { id: 'Two', content: 'Second tab' },\n  { id: 'Three', content: 'Third tab' }\n];\n\nconst tabContent2 = [\n  { id: 'Lorem', content: 'Lorem ipsum...' },\n  { id: 'Ipsum', content: 'Duis aute...' }\n];\n\nconst Tabs = {\n  oninit({ state }) {\n    state.activeTab = stream(0);\n  },\n  view({ attrs, state }) {\n    return (\n      m('.Tabs',\n        m('.TabBar',\n          attrs.tabs.map((tab, i) =>\n            m('.Tab', {\n              key: tab.id,\n              className: state.activeTab() === i ? 'active' : '',\n              onclick() { state.activeTab(i); }\n            }, tab.id)\n          )\n        ),\n        m('.TabContent', attrs.tabs[state.activeTab()].content)\n      )\n    );\n  }\n};\n\nconst Component = {\n  view() {\n    return (\n      m('div',\n        m(Tabs, { tabs: tabContent1 }),\n        m('br'),\n        m(Tabs, { tabs: tabContent2 })\n      )\n    );\n  }\n};");

var jsx$10 = codeString(
"import stream from 'mithril/stream';\n\nconst tabContent1 = [\n  { id: 'One', content: 'First tab' },\n  { id: 'Two', content: 'Second tab' },\n  { id: 'Three', content: 'Third tab' }\n];\n\nconst tabContent2 = [\n  { id: 'Lorem', content: 'Lorem ipsum...' },\n  { id: 'Ipsum', content: 'Duis aute...' }\n];\n\nconst Tabs = {\n  oninit({ state }) {\n    state.activeTab = stream(0);\n  },\n  view({ attrs, state }) {\n    const active = state.activeTab();\n    return (\n      <div className='Tabs'>\n        <div className='TabBar'>\n          {\n            attrs.tabs.map((tab, i) =>\n              <div\n                key={tab.id}\n                className={`Tab ${active === i ? 'active' : ''}`}\n                onclick={() => state.activeTab(i) }>\n                {tab.id}\n              </div>\n            )\n          }\n        </div>\n        <div className='TabContent'>\n          {attrs.tabs[state.activeTab()].content}\n        </div>\n      </div>\n    );\n  }\n};\n\nconst Component = {\n  view() {\n    return (\n      <div>\n        <Tabs tabs={tabContent1}/>\n        <br/>\n        <Tabs tabs={tabContent2}/>\n      </div>\n    );\n  }\n};");

var code$10 = [
  { id: 'es5', code: es5$10 },
  { id: 'es6', code: es6$10 },
  { id: 'jsx', code: jsx$10 }
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

    state.activeTab = stream(0);
  },
  view: function view(ref) {
    var attrs = ref.attrs;
    var state = ref.state;

    return (
      mithril('.Tabs',
        mithril('.TabBar',
          attrs.tabs.map(function (tab, i) { return mithril('.Tab', {
              key: i,
              className: state.activeTab() === i ? 'active' : '',
              onclick: function onclick() { state.activeTab(i); }
            }, tab.id); }
          )
        ),
        mithril('.TabContent', attrs.tabs[state.activeTab()].content)
      )
    );
  }
};

var Component$10 = {
  view: function view$1() {
    return (
      mithril('div',
        mithril(Tabs$2, { tabs: tabContent1 }),
        mithril('br'),
        mithril(Tabs$2, { tabs: tabContent2 })
      )
    );
  }
};

var es5$11 = codeString(
"// define the Tooltip component\nvar Tooltip = {\n  view: function(vnode) {\n    return (\n      m('.Tooltip-wrap',\n        vnode.children,\n        m('.Tooltip', vnode.attrs.value)\n      )\n    );\n  }\n};\n\n// elsewhere, use the Tooltip component\nvar Component = {\n  view: function() {\n    return (\n      m('div',\n        m(Tooltip, { value: 'Foo' },\n          m('button', 'Hover over this button')\n        ),\n        m(Tooltip, { value: 'Bar' },\n          m('span', 'or hover here')\n        )\n      )\n    );\n  }\n};");

var es6$11 = codeString(
"// define the Tooltip component\nconst Tooltip = {\n  view({ attrs, children }) {\n    return (\n      m('.Tooltip-wrap',\n        children,\n        m('.Tooltip', attrs.value)\n      )\n    );\n  }\n};\n\n// elsewhere, use the Tooltip component\nconst Component = {\n  view() {\n    return (\n      m('div',\n        m(Tooltip, { value: 'Foo' },\n          m('button', 'Hover over this button')\n        ),\n        m(Tooltip, { value: 'Bar' },\n          m('span', 'or hover here')\n        )\n      )\n    );\n  }\n};");

var jsx$11 = codeString(
"// define the Tooltip component\nconst Tooltip = {\n  view({ attrs, children }) {\n    return (\n      <div className='Tooltip-wrap'>\n        {children}\n        <div className='Tooltip'>{attrs.value}</div>\n      </div>\n    );\n  }\n};\n\n// elsewhere, use the Tooltip component\nconst Component = {\n  view() {\n    return (\n      <div>\n        <Tooltip value='Foo'>\n          <button>Hover over this button</button>\n        </Tooltip>\n        <Tooltip value='Bar'>\n          <span>or hover here</span>\n        </Tooltip>\n      </div>\n    );\n  }\n};");

var css = codeString.css(
".Tooltip-wrap {\n  display: inline-block;\n  position: relative;\n  transform: translateZ(0);\n}\n\n.Tooltip-wrap:hover .Tooltip {\n  opacity: 1;\n  transform: translateX(-50%) translateY(5px);\n  transition: all .3s ease .5s;\n  visibility: visible;\n}\n\n.Tooltip {\n  background: rgba(0, 0, 0, .8);\n  border-radius: 2px;\n  bottom: -30px;\n  color: white;\n  font-size: 12px;\n  left: 50%;\n  opacity: 0;\n  padding: 5px 10px;\n  position: absolute;\n  transform: translateX(-50%) translateY(0);\n  transition: all .2s ease;\n  user-select: none;\n  visibility: hidden;\n  white-space: nowrap;\n}");

var code$11 = [
  { id: 'es5', code: es5$11 },
  { id: 'es6', code: es6$11 },
  { id: 'jsx', code: jsx$11 },
  { id: 'css', code: css }
];


var Tooltip = {
  view: function view(ref) {
    var attrs = ref.attrs;
    var children = ref.children;

    return (
      mithril('.Tooltip-wrap',
        children,
        mithril('.Tooltip', attrs.value)
      )
    );
  }
};

var Component$11 = {
  view: function view$1() {
    return (
      mithril('div',
        mithril(Tooltip, { value: 'Foo' },
          mithril('button', 'Hover over this button')
        ),
        mithril(Tooltip, { value: 'Bar' },
          mithril('span', 'or hover here')
        )
      )
    );
  }
};

function view$5() {
	return (
		mithril(Page, { id: 'Components' },
			mithril('.Section',
				mithril('h2', 'Stopwatch'),
				mithril('p',
					markup(
						'In the [Getting started](/) example there was no need to manually tell mithril to update the view when ' +
						'the contents of the input changed, because mithril automatically redraws after event handlers are ' +
						'called. In this example there are no events that trigger an update, so we tell mithril to update via ' +
						'`m.redraw`.'
					)
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$5, fiddle: 'ckap5y2g' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$5))
					)
				),
				mithril('p',
					markup(
						'Adding a reset button is as simple as creating the button element in the `view` function and setting ' +
						'its `onclick` handler to a function that changes the count to 0. Similarly, the Start/Pause toggle ' +
						'is just a button that either clears or starts a new counter.'
					)
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$6, fiddle: 'nkuc6rbk' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$6))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'List rotator'),
				mithril('p',
					markup(
						'When rendering a list of data, it is a good idea to supply Mithril with a `key` attribute for each ' +
						'element in that list. [Keys](https://github.com/lhorie/mithril.js/blob/rewrite/docs/keys.md) help maintain ' +
						'references to each element and should be unique for each item in the list.'
					)
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$7, fiddle: '5ek60qfs' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$7))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'Password input'),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$8, fiddle: '256kx8sy' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$8))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'Autogrow textarea'),
				mithril('p',
					markup(
						'In some cases it is necessary to interact directly with the rendered dom node, not ' +
						'just mithril virtual dom nodes. For those cases, certain lifecycle methods (including ' +
						'`oncreate`) provide access to the actual node through the `dom` property. This example ' +
						'uses it to set the height of the textarea.'
					)
				),
				mithril('p',
					markup(
						'This example also relies on the fact that, in addition to being a getter-setter, ' +
						'any variable set to `stream()`  can be observed for changes. Whenever the value is ' +
						'updated, its `run` function calls its callback with the new value. (In this case, ' +
						'we just ignore the new value since the height is set regardless of the specific contents).'
					)
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$9, fiddle: 'n9rLg94u' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$9))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'Tabs'),
				mithril('p',
					markup(
						'The only state that tabs need to keep internally is the index of the active tab. ' +
						'The example components store this state in each instance of the tabs. The implementation ' +
						'of the tabs on this site can be viewed [on github](https://github.com/sebastiansandqvist/mithril-examples/blob/master/src/views/Tabs.js?ts=2).'
					)
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$10, fiddle: 'h2vftbr8' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$10))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'Tooltips'),
				mithril('p',
					markup(
						'There are a lot of ways to implement tooltips. This implementation relies more on CSS than javascript, ' +
						'but mithril makes it easy to reuse the component. The code that defines the tooltip component just wraps ' +
						'arbitrary child components in the correct CSS class names, and allows the value of the tooltip to be ' +
						'dynamically set using `attrs.value`.'
					)
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$11, fiddle: '181vwbL8' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$11))
					)
				)
			)
		)
	);
}

var Components = {
	view: view$5
};

var es5$12 = codeString(
"var stream = require('mithril/stream');\n\nvar TodoList = {\n  view: function(vnode) {\n    return (\n      m('ul',\n        vnode.attrs.items.map(function(item, i) {\n          return m('li', { key: i }, item);\n        })\n      )\n    );\n  }\n};\n\nvar TodoApp = {\n  oninit: function(vnode) {\n    vnode.state.items = [];\n    vnode.state.text = stream('');\n    vnode.state.handleSubmit = function(event) {\n      event.preventDefault();\n      vnode.state.items.push(vnode.state.text());\n      vnode.state.text('');\n    };\n  },\n  view: function(vnode) {\n    return (\n      m('div',\n        m('h3', 'To-do'),\n        m(TodoList, { items: vnode.state.items }),\n        m('form', { onsubmit: vnode.state.handleSubmit },\n          m('input[type=text]', {\n            oninput: m.withAttr('value', vnode.state.text),\n            value: vnode.state.text()\n          }),\n          m('button', {\n            type: 'submit'\n          }, `Add #${vnode.state.items.length + 1}`)\n        )\n      )\n    );\n  }\n};");

var es6$12 = codeString(
"import stream from 'mithril/stream';\n\nconst TodoList = {\n  view({ attrs }) {\n    return (\n      m('ul',\n        attrs.items.map((item, i) =>\n          m('li', { key: i }, item)\n        )\n      )\n    );\n  }\n};\n\nconst TodoApp = {\n  oninit({ state }) {\n    state.items = [];\n    state.text = stream('');\n    state.handleSubmit = function(event) {\n      event.preventDefault();\n      state.items.push(state.text());\n      state.text('');\n    };\n  },\n  view({ state }) {\n    return (\n      m('div',\n        m('h3', 'To-do'),\n        m(TodoList, { items: state.items }),\n        m('form', { onsubmit: state.handleSubmit },\n          m('input[type=text]', {\n            oninput: m.withAttr('value', state.text),\n            value: state.text()\n          }),\n          m('button', {\n            type: 'submit'\n          }, `Add #${state.items.length + 1}`)\n        )\n      )\n    );\n  }\n};");

var jsx$12 = codeString(
"import stream from 'mithril/stream';\n\nconst TodoList = {\n  view({ attrs }) {\n    return (\n      <ul>\n        {\n          attrs.items.map((item, i) => <li key={i}>{item}</li>)\n        }\n      </ul>\n    );\n  }\n};\n\nconst TodoApp = {\n  oninit({ state }) {\n    state.items = [];\n    state.text = stream('');\n    state.handleSubmit = function(event) {\n      event.preventDefault();\n      state.items.push(state.text());\n      state.text('');\n    };\n  },\n  view({ state }) {\n    return (\n      <div>\n        <h3>To-do</h3>\n        <TodoList items={state.items}/>\n        <form onsubmit={state.handleSubmit}>\n          <input\n            type='text'\n            oninput={m.withAttr('value', state.text)}/>\n          <button type='submit'>\n            Add #{state.items.length + 1}\n          </button>\n        </form>\n      </div>\n    );\n  }\n};");

var code$12 = [
  { id: 'es5', code: es5$12 },
  { id: 'es6', code: es6$12 },
  { id: 'jsx', code: jsx$12 }
];

var TodoList = {
  view: function view(ref) {
    var attrs = ref.attrs;

    return (
      mithril('ul',
        attrs.items.map(function (item, i) { return mithril('li', { key: i }, item); }
        )
      )
    );
  }
};

var Component$12 = {
  oninit: function oninit(ref) {
    var state = ref.state;

    state.items = [];
    state.text = stream('');
    state.handleSubmit = function(event) {
      event.preventDefault();
      state.items.push(state.text());
      state.text('');
    };
  },
  view: function view$1(ref) {
    var state = ref.state;

    return (
      mithril('div',
        mithril('h3', 'To-do'),
        mithril(TodoList, { items: state.items }),
        mithril('form', { onsubmit: state.handleSubmit },
          mithril('input[type=text]', {
            oninput: mithril.withAttr('value', state.text),
            value: state.text()
          }),
          mithril('button', { type: 'submit' }, ("Add #" + (state.items.length + 1)))
        )
      )
    );
  }
};

var es5$13 = codeString(
"var stream = require('mithril/stream');\n\nvar ListView = {\n  view: function(vnode) {\n    return (\n      m('ul',\n          vnode.attrs.items ?\n            vnode.attrs.items.map(function(book, i) {\n              return m('li', { key: i },\n                m('span', book.name, ' $', book.price),\n                m('button.right', {\n                  onclick: function() {\n                    vnode.attrs.action(book);\n                  }\n                }, vnode.attrs.actionLabel)\n              )\n          }) : m('div', 'Loading...')\n      )\n    );\n  }\n};\n\nvar BookShop = {\n  oninit: function(vnode) {\n\n    // fetch array of book objects from server of form:\n    // { name: 'The Iliad', price: 12 }\n    vnode.state.books = stream();\n    m.request({\n      method: 'GET',\n      url: 'https://mithril-examples.firebaseio.com/books.json'\n    }).then(vnode.state.books);\n\n    vnode.state.cart = stream([]);\n    vnode.state.text = stream('');\n\n    // once books have loaded, filter by title and prevent\n    // items in cart from showing up in the shop\n    vnode.state.shop = stream.combine(function(text, books, cart) {\n      return books().filter(function(book) {\n        return book.name.toLowerCase()\n          .indexOf(text().toLowerCase()) > -1 &&\n            cart().indexOf(book) === -1;\n      });\n    }, [vnode.state.text, vnode.state.books, vnode.state.cart]);\n\n    // when the cart updates, state.total = price of books in cart\n    vnode.state.total = vnode.state.cart.map(function(cart) {\n      return cart.reduce(function(prev, next) {\n        return prev + next.price;\n      }, 0);\n    });\n\n    vnode.state.addToCart = function(book) {\n      vnode.state.cart(vnode.state.cart().concat(book));\n    };\n\n    vnode.state.removeFromCart = function(book) {\n      vnode.state.cart(\n        vnode.state.cart().filter((item) => item !== book)\n      );\n    };\n\n  },\n  view: function(vnode) {\n    return (\n      m('div',\n        m('h3', 'Book Shop'),\n        m('input[type=text]', {\n          placeholder: 'Filter',\n          value: vnode.state.text(),\n          oninput: m.withAttr('value', vnode.state.text)\n        }),\n        m(ListView, {\n          items: vnode.state.shop(),\n          action: vnode.state.addToCart,\n          actionLabel: 'Add'\n        }),\n        m('hr'),\n        m('h3', 'Cart'),\n        m(ListView, {\n          items: vnode.state.cart(),\n          action: vnode.state.removeFromCart,\n          actionLabel: 'Remove'\n        }),\n        m('strong', 'Total: '),\n        m('span', '$', vnode.state.total())\n      )\n    );\n  }\n};");

var es6$13 = codeString(
"import stream from 'mithril/stream';\n\nconst ListView = {\n  view({ attrs }) {\n    return (\n      m('ul',\n          attrs.items ? attrs.items.map((book, i) =>\n            m('li', { key: i },\n              m('span', book.name, ' $', book.price),\n              m('button.right', {\n                onclick() {\n                  attrs.action(book);\n                }\n              }, attrs.actionLabel)\n            )\n          ) : m('div', 'Loading...')\n\n      )\n    );\n  }\n};\n\nconst BookShop = {\n  oninit({ state }) {\n\n    // fetch array of book objects from server of form:\n    // { name: 'The Iliad', price: 12 }\n    state.books = stream();\n    m.request({\n      method: 'GET',\n      url: 'https://mithril-examples.firebaseio.com/books.json'\n    }).then(state.books);\n\n    state.cart = stream([]);\n    state.text = stream('');\n\n    // once books have loaded, filter by title and prevent\n    // items in cart from showing up in the shop\n    state.shop = stream.combine((text, books, cart) =>\n      books().filter((book) =>\n        book.name.toLowerCase().indexOf(text().toLowerCase()) > -1 &&\n          cart().indexOf(book) === -1\n      ), [state.text, state.books, state.cart]\n    );\n\n    // when the cart updates, state.total = price of books in cart\n    state.total = state.cart.map(function(cart) {\n      return cart.reduce((prev, next) => prev + next.price, 0);\n    });\n\n    state.addToCart = function(book) {\n      state.cart(state.cart().concat(book));\n    };\n\n    state.removeFromCart = function(book) {\n      state.cart(\n        state.cart().filter((item) => item !== book)\n      );\n    };\n\n  },\n  view({ state }) {\n    return (\n      m('div',\n        m('h3', 'Book Shop'),\n        m('input[type=text]', {\n          placeholder: 'Filter',\n          value: state.text(),\n          oninput: m.withAttr('value', state.text)\n        }),\n        m(ListView, {\n          items: state.shop(),\n          action: state.addToCart,\n          actionLabel: 'Add'\n        }),\n        m('hr'),\n        m('h3', 'Cart'),\n        m(ListView, {\n          items: state.cart(),\n          action: state.removeFromCart,\n          actionLabel: 'Remove'\n        }),\n        m('strong', 'Total: '),\n        m('span', '$', state.total())\n      )\n    );\n  }\n};");

var jsx$13 = codeString(
"import stream from 'mithril/stream';\n\nconst ListView = {\n  view({ attrs }) {\n    return (\n      <ul>\n        {\n          attrs.items ? attrs.items.map((book, i) =>\n            <li key={i}>\n              <span>{book.name} ${book.price}</span>\n              <button className='right' onclick={() => attrs.action(book)}>\n                {attrs.actionLabel}\n              </button>\n            </li>\n          ) : <div>Loading...</div>\n        }\n      </ul>\n    );\n  }\n};\n\nconst BookShop = {\n  oninit({ state }) {\n\n    // fetch array of book objects from server of form:\n    // { name: 'The Iliad', price: 12 }\n    state.books = stream();\n    m.request({\n      method: 'GET',\n      url: 'https://mithril-examples.firebaseio.com/books.json'\n    }).then(state.books);\n\n    state.cart = stream([]);\n    state.text = stream('');\n\n    // once books have loaded, filter by title and prevent\n    // items in cart from showing up in the shop\n    state.shop = stream.combine((text, books, cart) =>\n      books().filter((book) =>\n        book.name.toLowerCase().indexOf(text().toLowerCase()) > -1 &&\n          cart().indexOf(book) === -1\n      ), [state.text, state.books, state.cart]\n    );\n\n    // when the cart updates, state.total = price of books in cart\n    state.total = state.cart.map(function(cart) {\n      return cart.reduce((prev, next) => prev + next.price, 0);\n    });\n\n    state.addToCart = function(book) {\n      state.cart(state.cart().concat(book));\n    };\n\n    state.removeFromCart = function(book) {\n      state.cart(\n        state.cart().filter((item) => item !== book)\n      );\n    };\n\n  },\n  view({ state }) {\n    return (\n      <div>\n        <h3>Book shop</h3>\n        <input\n          type='text'\n          placeholder='filter'\n          value={state.text()}\n          oninput={m.withAttr('value', state.text)}/>\n        <ListView\n          items={state.shop()}\n          action={state.addToCart}\n          actionLabel='Add'/>\n        <hr/>\n        <h3>Cart</h3>\n        <ListView\n          items={state.cart()}\n          action={state.removeFromCart}\n          actionLabel='Remove'/>\n        <strong>Total: </strong>\n        <span>${state.total()}</span>\n      </div>\n    );\n  }\n};");

var code$13 = [
  { id: 'es5', code: es5$13 },
  { id: 'es6', code: es6$13 },
  { id: 'jsx', code: jsx$13 }
];

var ListView = {
  view: function view(ref) {
    var attrs = ref.attrs;

    return (
      mithril('ul',
          attrs.items ? attrs.items.map(function (book, i) { return mithril('li', { key: i },
              mithril('span', book.name, ' $', book.price),
              mithril('button.right', {
                onclick: function onclick() {
                  attrs.action(book);
                }
              }, attrs.actionLabel)
            ); }
          ) : mithril('div', 'Loading...')

      )
    );
  }
};

var Component$13 = {
  oninit: function oninit(ref) {
    var state = ref.state;


    // fetch array of book objects from server of form:
    // { name: 'The Iliad', price: 12 }
    state.books = stream();
    mithril.request({
      method: 'GET',
      url: 'https://mithril-examples.firebaseio.com/books.json'
    }).then(state.books);

    state.cart = stream([]);
    state.text = stream('');

    // once books have loaded, filter by title and prevent
    // items in cart from showing up in the shop
    state.shop = stream.combine(function (text, books, cart) { return books().filter(function (book) { return book.name.toLowerCase().indexOf(text().toLowerCase()) > -1 &&
          cart().indexOf(book) === -1; }
      ); }, [state.text, state.books, state.cart]
    );

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
      mithril('div',
        mithril('h3', 'Book Shop'),
        mithril('input[type=text]', {
          placeholder: 'Filter',
          value: state.text(),
          oninput: mithril.withAttr('value', state.text)
        }),
        mithril(ListView, {
          items: state.shop(),
          action: state.addToCart,
          actionLabel: 'Add'
        }),
        mithril('hr'),
        mithril('h3', 'Cart'),
        mithril(ListView, {
          items: state.cart(),
          action: state.removeFromCart,
          actionLabel: 'Remove'
        }),
        mithril('strong', 'Total: '),
        mithril('span', '$', state.total())
      )
    );
  }
};

var es5$14 = codeString(
"var stream = require('mithril/stream');\n\nfunction mapAsciiToBraille(character) {\n\n  var map = {\n    a: '⠁',\n    b: '⠃',\n    c: '⠉',\n    d: '⠙',\n    e: '⠑',\n    f: '⠋',\n    g: '⠛',\n    h: '⠓',\n    i: '⠊',\n    j: '⠚',\n    k: '⠅',\n    l: '⠇',\n    m: '⠍',\n    n: '⠝',\n    o: '⠕',\n    p: '⠏',\n    q: '⠟',\n    r: '⠗',\n    s: '⠎',\n    t: '⠞',\n    u: '⠥',\n    v: '⠧',\n    w: '⠺',\n    x: '⠭',\n    y: '⠽',\n    z: '⠵',\n    0: '⠼⠚',\n    1: '⠼⠁',\n    2: '⠼⠃',\n    3: '⠼⠉',\n    4: '⠼⠙',\n    5: '⠼⠑',\n    6: '⠼⠋',\n    7: '⠼⠛',\n    8: '⠼⠓',\n    9: '⠼⠊'\n  };\n\n  return map[character] || character;\n\n}\n\nvar BrailleTranslator = {\n  oninit: function(vnode) {\n    vnode.state.input = stream('');\n    vnode.state.output = vnode.state.input.map(function(text) {\n      return text\n        .toLowerCase()\n        .split('')\n        .map(mapAsciiToBraille)\n        .join('');\n    });\n  },\n  view: function(vnode) {\n    return (\n      m('div',\n        m('div', 'Enter ascii text:'),\n        m('input[type=text]', {\n          placeholder: 'input',\n          value: vnode.state.input(),\n          oninput: m.withAttr('value', vnode.state.input)\n        }),\n        m('hr'),\n        m('div', 'Braille:'),\n        m('div', vnode.state.output())\n      )\n    );\n  }\n};");

var es6$14 = codeString(
"import stream from 'mithril/stream';\n\nfunction mapAsciiToBraille(character) {\n\n  const map = {\n    a: '⠁',\n    b: '⠃',\n    c: '⠉',\n    d: '⠙',\n    e: '⠑',\n    f: '⠋',\n    g: '⠛',\n    h: '⠓',\n    i: '⠊',\n    j: '⠚',\n    k: '⠅',\n    l: '⠇',\n    m: '⠍',\n    n: '⠝',\n    o: '⠕',\n    p: '⠏',\n    q: '⠟',\n    r: '⠗',\n    s: '⠎',\n    t: '⠞',\n    u: '⠥',\n    v: '⠧',\n    w: '⠺',\n    x: '⠭',\n    y: '⠽',\n    z: '⠵',\n    0: '⠼⠚',\n    1: '⠼⠁',\n    2: '⠼⠃',\n    3: '⠼⠉',\n    4: '⠼⠙',\n    5: '⠼⠑',\n    6: '⠼⠋',\n    7: '⠼⠛',\n    8: '⠼⠓',\n    9: '⠼⠊'\n  };\n\n  return map[character] || character;\n\n}\n\nconst BrailleTranslator = {\n  oninit({ state }) {\n    state.input = stream('');\n    state.output = state.input.map(function(text) {\n      return text\n        .toLowerCase()\n        .split('')\n        .map(mapAsciiToBraille)\n        .join('');\n    });\n  },\n  view({ state }) {\n    return (\n      m('div',\n        m('div', 'Enter ascii text:'),\n        m('input[type=text]', {\n          placeholder: 'input',\n          value: state.input(),\n          oninput: m.withAttr('value', state.input)\n        }),\n        m('hr'),\n        m('div', 'Braille:'),\n        m('div', state.output())\n      )\n    );\n  }\n};");

var jsx$14 = codeString(
"import stream from 'mithril/stream';\n\nfunction mapAsciiToBraille(character) {\n\n  const map = {\n    a: '⠁',\n    b: '⠃',\n    c: '⠉',\n    d: '⠙',\n    e: '⠑',\n    f: '⠋',\n    g: '⠛',\n    h: '⠓',\n    i: '⠊',\n    j: '⠚',\n    k: '⠅',\n    l: '⠇',\n    m: '⠍',\n    n: '⠝',\n    o: '⠕',\n    p: '⠏',\n    q: '⠟',\n    r: '⠗',\n    s: '⠎',\n    t: '⠞',\n    u: '⠥',\n    v: '⠧',\n    w: '⠺',\n    x: '⠭',\n    y: '⠽',\n    z: '⠵',\n    0: '⠼⠚',\n    1: '⠼⠁',\n    2: '⠼⠃',\n    3: '⠼⠉',\n    4: '⠼⠙',\n    5: '⠼⠑',\n    6: '⠼⠋',\n    7: '⠼⠛',\n    8: '⠼⠓',\n    9: '⠼⠊'\n  };\n\n  return map[character] || character;\n\n}\n\nconst BrailleTranslator = {\n  oninit({ state }) {\n    state.input = stream('');\n    state.output = state.input.map(function(text) {\n      return text\n        .toLowerCase()\n        .split('')\n        .map(mapAsciiToBraille)\n        .join('');\n    });\n  },\n  view({ state }) {\n    return (\n      <div>\n        <div>Enter ascii text:</div>\n        <input\n          type='text'\n          value={state.input()}\n          oninput={m.withAttr('value', state.input)}/>\n        <hr/>\n        <div>Braille:</div>\n        <div>{state.output()}</div>\n      </div>\n    );\n  }\n};");

var code$14 = [
  { id: 'es5', code: es5$14 },
  { id: 'es6', code: es6$14 },
  { id: 'jsx', code: jsx$14 }
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

var Component$14 = {
  oninit: function oninit(ref) {
    var state = ref.state;

    state.input = stream('');
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
      mithril('div',
        mithril('div', 'Enter ascii text:'),
        mithril('input[type=text]', {
          placeholder: 'input',
          value: state.input(),
          oninput: mithril.withAttr('value', state.input)
        }),
        mithril('hr'),
        mithril('div', 'Braille:'),
        mithril('div', state.output())
      )
    );
  }
};

var marked = createCommonjsModule(function (module, exports) {
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var this$1 = this;

  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this$1.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this$1.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this$1.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this$1.tokens.push({
        type: 'code',
        text: !this$1.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this$1.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this$1.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this$1.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this$1.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this$1.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this$1.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this$1.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this$1.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this$1.token(cap, top, true);

      this$1.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this$1.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this$1.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this$1.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this$1.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this$1.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) { loose = next; }
        }

        this$1.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this$1.token(item, false, bq);

        this$1.tokens.push({
          type: 'list_item_end'
        });
      }

      this$1.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this$1.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: this$1.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this$1.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this$1.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this$1.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this$1.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this$1.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this$1.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this$1.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var this$1 = this;

  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this$1.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this$1.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this$1.mangle(cap[1].substring(7))
          : this$1.mangle(cap[1]);
        href = this$1.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this$1.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this$1.inLink && (cap = this$1.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this$1.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this$1.rules.tag.exec(src)) {
      if (!this$1.inLink && /^<a /i.test(cap[0])) {
        this$1.inLink = true;
      } else if (this$1.inLink && /^<\/a>/i.test(cap[0])) {
        this$1.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this$1.options.sanitize
        ? this$1.options.sanitizer
          ? this$1.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this$1.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.inLink = true;
      out += this$1.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this$1.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this$1.rules.reflink.exec(src))
        || (cap = this$1.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this$1.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this$1.inLink = true;
      out += this$1.outputLink(cap, link);
      this$1.inLink = false;
      continue;
    }

    // strong
    if (cap = this$1.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.strong(this$1.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this$1.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.em(this$1.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this$1.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this$1.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this$1.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.del(this$1.output(cap[1]));
      continue;
    }

    // text
    if (cap = this$1.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.text(escape(this$1.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) { return text; }
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) { return text; }
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  var this$1 = this;

  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this$1.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var this$1 = this;

  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this$1.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  var this$1 = this;

  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this$1.token.align[i] };
        cell += this$1.renderer.tablecell(
          this$1.inline.output(this$1.token.header[i]),
          { header: true, align: this$1.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this$1.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this$1.renderer.tablecell(
            this$1.inline.output(row[j]),
            { header: false, align: this$1.token.align[j] }
          );
        }

        body += this$1.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this$1.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this$1.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this$1.token.type === 'text'
          ? this$1.parseText()
          : this$1.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this$1.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities 
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') { return ':'; }
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) { return new RegExp(regex, opt); }
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var arguments$1 = arguments;

  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments$1[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) { return done(); }

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) { return done(err); }
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) { opt = merge({}, marked.defaults, opt); }
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : commonjsGlobal);
}());
});

var es5$15 = codeString(
"var stream = require('mithril/stream');\n\nvar MarkdownEditor = {\n  oninit: function(vnode) {\n    vnode.state.value = stream('Type some *markdown* here!');\n    vnode.state.markdown = vnode.state.value.map(marked);\n  },\n  view: function(vnode) {\n    return (\n      m('div',\n        m('h3', 'Input'),\n        m('textarea.fullWidth', {\n          oninput: m.withAttr('value', vnode.state.value),\n          value: vnode.state.value()\n        }),\n        m('h3', 'Output'),\n        m('div', m.trust(vnode.state.markdown()))\n      )\n    );\n  }\n};");

var es6$15 = codeString(
"import stream from 'mithril/stream';\n\nconst MarkdownEditor = {\n  oninit({ state }) {\n    state.value = stream('Type some *markdown* here!');\n    state.markdown = state.value.map(marked);\n  },\n  view({ state }) {\n    return (\n      m('div',\n        m('h3', 'Input'),\n        m('textarea.fullWidth', {\n          oninput: m.withAttr('value', state.value),\n          value: state.value()\n        }),\n        m('h3', 'Output'),\n        m('div', m.trust(state.markdown()))\n      )\n    );\n  }\n};");

var jsx$15 = codeString(
"import stream from 'mithril/stream';\n\nconst MarkdownEditor = {\n  oninit({ state }) {\n    state.value = stream('Type some *markdown* here!');\n    state.markdown = state.value.map(marked);\n  },\n  view({ state }) {\n    return (\n      <div>\n        <h3>Input</h3>\n        <textarea\n          className='fullWidth'\n          oninput={m.withAttr('value', state.value)}\n          value{state.value()}/>\n        <h3>Output</h3>\n        <div>{m.trust(state.markdown())}</div>\n      </div>\n    );\n  }\n};");

var code$15 = [
  { id: 'es5', code: es5$15 },
  { id: 'es6', code: es6$15 },
  { id: 'jsx', code: jsx$15 }
];

var Component$15 = {
  oninit: function oninit(ref) {
    var state = ref.state;

    state.value = stream('Type some *markdown* here!');
    state.markdown = state.value.map(marked);
  },
  view: function view(ref) {
    var state = ref.state;

    return (
      mithril('div',
        mithril('h3', 'Input'),
        mithril('textarea.fullWidth', {
          oninput: mithril.withAttr('value', state.value),
          value: state.value()
        }),
        mithril('h3', 'Output'),
        mithril('div', mithril.trust(state.markdown()))
      )
    );
  }
};

function view$6() {
	return (
		mithril(Page, { id: 'Applications' },
			mithril('.Section',
				mithril('h2', 'Todo list'),
				mithril('p',
					'This example is ported over from the React.js documentation in order to demonstrate ',
					'some of the differences between Mithril\'s syntax and React\'s.'
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$12, fiddle: 'vqqfvjb6' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$12))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'Shopping cart'),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$13, fiddle: 'mbyqewny' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$13))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'Braille Translator'),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$14, fiddle: '53xrgmxq' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$14))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'Markdown editor'),
				mithril('p',
					markup(
						'Like the to-do example, this example that closely mirrors a demo application on the react.js site. ' +
						'We are using the [marked](https://github.com/chjj/marked) library to transform the ' +
						'input string into a raw html string. In the view, `m.trust` is used to bypass the ' +
						'input sanitation provided by default with mithril.'
					)
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$15, fiddle: 'ozjtms1q' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$15))
					)
				)
			)
		)
	);
}

var Applications = {
	view: view$6
};

var es5$16 = codeString(
"var stream = require('mithril/stream');\n\nvar BookView = {\n  oninit: function(vnode) {\n    vnode.state.books = stream([]);\n    m.request({\n      method: 'GET',\n      url: 'https://mithril-examples.firebaseio.com/books.json'\n    }).then(vnode.state.books);\n  },\n  view: function(vnode) {\n    return (\n      m('div',\n        m('h3', 'Books'),\n        m('ul',\n          vnode.state.books().map(function(book) {\n            return m('li', { key: book.id }, book.name);\n          })\n        )\n      )\n    );\n  }\n};");

var es6$16 = codeString(
"import stream from 'mithril/stream';\n\nconst BookView = {\n  oninit({ state }) {\n    state.books = stream([]);\n    m.request({\n      method: 'GET',\n      url: 'https://mithril-examples.firebaseio.com/books.json'\n    }).then(state.books);\n  },\n  view({ state }) {\n    return (\n      m('div',\n        m('h3', 'Books'),\n        m('ul',\n          state.books().map((book) =>\n            m('li', { key: book.id }, book.name)\n          )\n        )\n      )\n    );\n  }\n};");

var jsx$16 = codeString(
"import stream from 'mithril/stream';\n\nconst BookView = {\n  oninit({ state }) {\n    state.books = stream([]);\n    m.request({\n      method: 'GET',\n      url: 'https://mithril-examples.firebaseio.com/books.json'\n    }).then(state.books);\n  },\n  view({ state }) {\n    return (\n      <div>\n        <h3>Books</h3>\n        <ul>\n          {\n            state.books().map((book) =>\n              <li key={book.id}>{book.name}</li>\n            )\n          }\n        </ul>\n      </div>\n    );\n  }\n};");

var code$16 = [
  { id: 'es5', code: es5$16 },
  { id: 'es6', code: es6$16 },
  { id: 'jsx', code: jsx$16 }
];

// Fetches an array of books objects of the form:
// { name: String, price: Number, id: Number }
var Component$16 = {
  oninit: function oninit(ref) {
    var state = ref.state;

    state.books = stream([]);
    mithril.request({
      method: 'GET',
      url: 'https://mithril-examples.firebaseio.com/books.json'
    }).then(state.books);
  },
  view: function view(ref) {
    var state = ref.state;

    return (
      mithril('div',
        mithril('h3', 'Books'),
        mithril('ul',
          state.books().map(function (book) { return mithril('li', { key: book.id }, book.name); }
          )
        )
      )
    );
  }
};

var es5$17 = codeString(
"var stream = require('mithril/stream');\n\nvar BookView = {\n  oninit: function(vnode) {\n    vnode.state.books = stream([]);\n    fetch('https://mithril-examples.firebaseio.com/books.json')\n      .then(function(response) {\n        return response.json();\n      })\n      .then(vnode.state.books)\n      .then(function() {\n        m.redraw();\n      });\n  },\n  view: function(vnode) {\n    return (\n      m('div',\n        m('h3', 'Books'),\n        m('ul',\n          vnode.state.books().map(function(book) {\n            return m('li', { key: book.id }, book.name);\n          })\n        )\n      )\n    );\n  }\n};");

var es6$17 = codeString(
"import stream from 'mithril/stream';\n\nconst BookView = {\n  oninit({ state }) {\n    state.books = stream([]);\n    fetch('https://mithril-examples.firebaseio.com/books.json')\n      .then((response) => response.json())\n      .then(state.books)\n      .then(() => m.redraw());\n  },\n  view({ state }) {\n    return (\n      m('div',\n        m('h3', 'Books'),\n        m('ul',\n          state.books().map((book) =>\n            m('li', { key: book.id }, book.name)\n          )\n        )\n      )\n    );\n  }\n};");

var jsx$17 = codeString(
"import stream from 'mithril/stream';\n\nconst BookView = {\n  oninit({ state }) {\n    state.books = stream([]);\n    fetch('https://mithril-examples.firebaseio.com/books.json')\n      .then((response) => response.json())\n      .then(state.books)\n      .then(() => m.redraw());\n  },\n  view({ state }) {\n    return (\n      <div>\n        <h3>Books</h3>\n        <ul>\n          {\n            state.books().map((book) =>\n              <li key={book.id}>{book.name}</li>\n            )\n          }\n        </ul>\n      </div>\n    );\n  }\n};");

var code$17 = [
  { id: 'es5', code: es5$17 },
  { id: 'es6', code: es6$17 },
  { id: 'jsx', code: jsx$17 }
];

var Component$17 = {
  oninit: function oninit(ref) {
    var state = ref.state;

    state.books = stream([]);
    fetch('https://mithril-examples.firebaseio.com/books.json')
      .then(function (response) { return response.json(); })
      .then(state.books)
      .then(function () { return mithril.redraw(); });
  },
  view: function view(ref) {
    var state = ref.state;

    return (
      mithril('div',
        mithril('h3', 'Books'),
        mithril('ul',
          state.books().map(function (book) { return mithril('li', { key: book.id }, book.name); }
          )
        )
      )
    );
  }
};

function view$7() {
	return (
		mithril(Page, { id: 'Requests' },
			mithril('.Section',
				mithril('h2', 'Render fetched list'),
				mithril('p',
					mithril('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/request.md]',
						mithril('code.inline', 'm.request')
					),
					' performs an AJAX request against a specified url and returns a ',
					mithril('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/stream.md]', 'stream'),
					' whose value becomes the data fetched from the server.'
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$16, fiddle: 'rd54g0f4' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$16))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'Equivalent using fetch api'),
				mithril('p',
					mithril('code.inline', 'm.request'),
					' is similar to the native fetch api, but adds automatic redrawing upon completion, ',
					'converts the response to JSON, and resolves to a stream. For comparison, the following ',
					'code is the equivalent of the first example, using the native fetch api instead.'
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$17, fiddle: '5b1wn90n' })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$17))
					)
				)
			)
		)
	);
}

var Requests = {
	view: view$7
};

var es5$18 = codeString(
"var RouteView = {\n  view: function() {\n    return m('div', 'Current route: ', m.route.get());\n  }\n};");

var es6$18 = codeString(
"const RouteView = {\n  view() {\n    return m('div', 'Current route: ', m.route.get());\n  }\n};");

var jsx$18 = codeString(
"const RouteView = {\n  view() {\n    return <div>Current route: {m.route.get()}</div>;\n  }\n};");

var code$18 = [
  { id: 'es5', code: es5$18 },
  { id: 'es6', code: es6$18 },
  { id: 'jsx', code: jsx$18 }
];

var Component$18 = {
  view: function view() {
    return mithril('div', 'Current route: ', mithril.route.get());
  }
};

var es5$19 = codeString(
"var LinkView = {\n  view: function() {\n    return (\n      m('ul',\n        m('li',\n          m('a[href=/routing]', {\n            oncreate: m.route.link\n          }, 'Routing page (root)')\n        ),\n        m('li',\n          m('a[href=/routing/foo]', {\n            oncreate: m.route.link\n          }, '/routing/foo')\n        ),\n        m('li',\n          m('a[href=/routing/bar]', {\n            oncreate: m.route.link\n          }, '/routing/bar')\n        )\n      )\n    );\n  }\n};");

var es6$19 = codeString(
"const LinkView = {\n  view() {\n    return (\n      m('ul',\n        m('li',\n          m('a[href=/routing]', {\n            oncreate: m.route.link\n          }, 'Routing page (root)')\n        ),\n        m('li',\n          m('a[href=/routing/foo]', {\n            oncreate: m.route.link\n          }, '/routing/foo')\n        ),\n        m('li',\n          m('a[href=/routing/bar]', {\n            oncreate: m.route.link\n          }, '/routing/bar')\n        )\n      )\n    );\n  }\n};");

var jsx$19 = codeString(
"const LinkView = {\n  view() {\n    return (\n      <ul>\n        <li>\n          <a href='/routing' oncreate={m.route.link}>\n            Routing page (root)\n          </a>\n        </li>\n        <li>\n          <a href='/routing/foo' oncreate={m.route.link}>\n            /routing/foo\n          </a>\n        </li>\n        <li>\n          <a href='/routing/bar' oncreate={m.route.link}>\n            /routing/bar\n          </a>\n        </li>\n      </ul>\n    );\n  }\n};");

var code$19 = [
  { id: 'es5', code: es5$19 },
  { id: 'es6', code: es6$19 },
  { id: 'jsx', code: jsx$19 }
];

var Component$19 = {
  view: function view() {
    return (
      mithril('ul',
        mithril('li',
          mithril('a[href=/routing]', {
            oncreate: mithril.route.link
          }, 'Routing page (root)')
        ),
        mithril('li',
          mithril('a[href=/routing/foo]', {
            oncreate: mithril.route.link
          }, '/routing/foo')
        ),
        mithril('li',
          mithril('a[href=/routing/bar]', {
            oncreate: mithril.route.link
          }, '/routing/bar')
        )
      )
    );
  }
};

var es5$20 = codeString(
"var ButtonView = {\n  view: function() {\n    return (\n      m('ul',\n        m('li',\n          m('button', {\n            onclick: function() { m.route.set('/routing') }\n          }, 'Routing page (root)')\n        ),\n        m('li',\n          m('button', {\n            onclick: function() { m.route.set('/routing/foo') }\n          }, '/routing/foo')\n        ),\n        m('li',\n          m('button', {\n            onclick: function() { m.route.set('/routing/bar') }\n          }, '/routing/bar')\n        )\n      )\n    );\n  }\n};");

var es6$20 = codeString(
"const ButtonView = {\n  view() {\n    return (\n      m('ul',\n        m('li',\n          m('button', {\n            onclick: () => m.route.set('/routing')\n          }, 'Routing page (root)')\n        ),\n        m('li',\n          m('button', {\n            onclick: () => m.route.set('/routing/foo')\n          }, '/routing/foo')\n        ),\n        m('li',\n          m('button', {\n            onclick: () => m.route.set('/routing/bar')\n          }, '/routing/bar')\n        )\n      )\n    );\n  }\n};");

var jsx$20 = codeString(
"const ButtonView = {\n  view() {\n    return (\n      <ul>\n        <li>\n          <button onclick={() => m.route.set('/routing')}>\n            Routing page (root)\n          </button>\n        </li>\n        <li>\n          <button onclick={() => m.route.set('/routing/foo')}>\n            /routing/foo\n          </button>\n        </li>\n        <li>\n          <button onclick={() => m.route.set('/routing/bar')}>\n            /routing/bar\n          </button>\n        </li>\n      </ul>\n    );\n  }\n};");

var code$20 = [
  { id: 'es5', code: es5$20 },
  { id: 'es6', code: es6$20 },
  { id: 'jsx', code: jsx$20 }
];

var Component$20 = {
  view: function view() {
    return (
      mithril('ul',
        mithril('li',
          mithril('button', {
            onclick: function () { return mithril.route.set('/routing'); }
          }, 'Routing page (root)')
        ),
        mithril('li',
          mithril('button', {
            onclick: function () { return mithril.route.set('/routing/foo'); }
          }, '/routing/foo')
        ),
        mithril('li',
          mithril('button', {
            onclick: function () { return mithril.route.set('/routing/bar'); }
          }, '/routing/bar')
        )
      )
    );
  }
};

function view$8() {
	return (
		mithril(Page, { id: 'Routing' },
			mithril('.Section',
				mithril('h2', 'Getting the current route'),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$18 })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$18))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'Setting the current route (with links)'),
				mithril('p',
					'When using links (',
					mithril('code.inline', 'a'),
					' elements), Mithril provides a method that prevents the default behavior of links ',
					'(which would refresh the page unnecessarily) and ensures that those links adhere to the ',
					'current routing mode, whether it\'s hash based, query string based, or pathname based. ',
					'For any links that do not route away from the current site, use ',
					mithril('code.inline', 'm.route.link'),
					' in that link\'s ',
					mithril('code.inline', 'oncreate'),
					' lifecycle method.'
				),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$19 })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$19))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'Setting the current route programmatically'),
				mithril('.Demo',
					mithril('.Demo-left',
						mithril(Tabs, { tabs: code$20 })
					),
					mithril('.Demo-right',
						mithril('.Demo-result', mithril(Component$20))
					)
				)
			),
			mithril('.Section',
				mithril('h2', 'Further reading'),
				mithril('p',
					'Take a look at the ',
					mithril('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/route.md]', 'official router documentation'),
					' for more information on how routing works in Mithril. ',
					'The implementation of the router used for this website can be found ',
					mithril('a[href=https://github.com/sebastiansandqvist/mithril-examples/blob/master/src/index.js?ts=2]', 'on github'),
					'.'
				),
				mithril('p',
					markup('See also: interactive [mithril router usage on JSFiddle](https://jsfiddle.net/qproodwf/).')
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
		mithril(Page, { id: 'Streams' },
			mithril('.Section',
				mithril('h2', '...')
			)
		)
	);
}

var Prop = {
	view: view$9
};

window.__DEV__ = window.location.hostname === 'localhost';

var routes = {
	'/': GettingStarted,
	'/gettingstarted': GettingStarted,
	'/components': Components,
	'/applications': Applications,
	'/requests': Requests,
	'/routing': Routing,
	'/routing/:param': Routing,
	'/streams': Prop
};

mithril.route.prefix('');
mithril.route(document.getElementById('app'), '/', routes);

}());
