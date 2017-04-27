import m from 'mithril';

function generateCode(fullString) {
	const output = [];
	const codeRegex = /(`(.*?)`)/gm;
	const split = fullString.split(codeRegex);
	let isCodeRaw = false;
	let isCode = false;
	for (let i = 0; i < split.length; i++) {
		isCodeRaw = codeRegex.test(split[i]);
		isCode = codeRegex.test(split[i - 1] || '');
		if (isCode) {
			output.push(m('code.inline', split[i]));
		}
		else if (!isCodeRaw) {
			output.push(m('span', split[i]));
		}
	}
	return output;
}

function generateLink(title, fullString) {
	const parenRegex = /\(([^)]+)\)/;
	const url = fullString.match(parenRegex)[1];
	if (url[0] === '/') {
		return m('a', { href: url, oncreate: m.route.link }, title);
	}
	return m('a', { href: url }, title);
}

export default function markup(...args) {
	const codeRegex = /`(.*?)`/gm;
	const linkRegex = /(\[(.*?)\]\(.*?\))/gm;
	const output = [];
	for (let a = 0; a < args.length; a++) {
		const str = args[a].concat(' ');
		const rawContents = str.split(linkRegex);
		let hasCode = false;
		let isLinkRaw = false;
		let isLink = false;
		for (let i = 0; i < rawContents.length; i++) {
			hasCode = codeRegex.test(rawContents[i]);
			isLinkRaw = linkRegex.test(rawContents[i]);
			isLink = linkRegex.test(rawContents[i - 1] || '');
			if (hasCode) {
				output.push(generateCode(rawContents[i]));
			}
			else if (isLink) {
				output.push(generateLink(rawContents[i], rawContents[i - 1])); // previous item is context with url
			}
			else if (rawContents[i][0] === '\n') {
				output.push(m('br'));
				output.push(m('br'));
			}
			else if (!isLinkRaw) {
				output.push(rawContents[i]);
			}
		}
	}
	return output;
}