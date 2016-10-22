import m from 'mithril';

export const combine = function(...args: Array<Function>): Function {
	const streams = args.slice(0, -1);
	const callback = args[args.length - 1];
	return m.prop.combine(function(...streamsAndChanged) {
		const justStreams = streamsAndChanged.slice(0, -1);
		const values = justStreams.map((stream) => stream());
		return callback.apply(callback, values);
	}, streams);
};

// onceNotNull(...streams, callback) => stream
export const onceNotNull = function(...args: Array<Function>): Function {
	let hasFired = false;
	const streams = args.slice(0, -1);
	const callback = args[args.length - 1];
	const handler = combine.apply(combine, streams.concat(function(...values) {
		if (hasFired) { handler.end(true); return m.prop.HALT; }
		const isValid = values.reduce(function(wasValid, next) {
			return wasValid && (next !== null) && (next !== undefined);
		}, true);
		if (isValid) {
			const computed = callback.apply(callback, values);
			hasFired = true;
			return computed;
		}
		return m.prop.HALT;
	}));
	return handler;
};

export const dropRepeats = function(stream: Function): Function {
	let prev;
	return stream.map(function(value) {
		if (prev !== value) {
			prev = value;
			return value;
		}
		return m.prop.HALT;
	});
};