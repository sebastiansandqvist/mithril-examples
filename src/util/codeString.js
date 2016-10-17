import prism from 'prismjs';

export default function codeString(str) {
	return prism.highlight(str, prism.languages.javascript);
}