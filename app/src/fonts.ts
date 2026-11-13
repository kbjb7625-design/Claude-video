import {continueRender, delayRender, staticFile} from 'remotion';

const faces: [string, string, string][] = [
	['Anton', 'fonts/anton-latin-400-normal.woff2', '400'],
	['Montserrat', 'fonts/montserrat-latin-600-normal.woff2', '600'],
	['Montserrat', 'fonts/montserrat-latin-800-normal.woff2', '800'],
	['Montserrat', 'fonts/montserrat-latin-900-normal.woff2', '900'],
];

if (typeof document !== 'undefined') {
	const handle = delayRender('fonts');
	Promise.all(
		faces.map(([family, file, weight]) => {
			const f = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {
				weight,
			});
			return f.load().then((loaded) => document.fonts.add(loaded));
		}),
	)
		.then(() => continueRender(handle))
		.catch((e) => {
			console.error(e);
			continueRender(handle);
		});
}
