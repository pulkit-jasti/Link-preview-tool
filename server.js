const cheerio = require('cheerio');
const fetch = require('node-fetch');
const getURLs = require('get-urls');

const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

/*app.get('/', (req, res) => {
	res.render('index', {
		objj: [],
	});
});*/

//Test URLs
// https://www.investopedia.com/articles/wealth-management/121415/economics-owning-small-plane.asp https://theblondeabroad.com/best-places-to-travel-in-the-united-states-right-now/    https://www.investopedia.com/guide-to-the-joe-biden-presidency-5095912 h/beebom.com/sony-sold-twice-playstation-5-units-than-xbox-series-x-2020/  https://fireship.io/courses/vue/ https://fireship.io/courses/angular/

app.get('/', (req, res) => {
	//console.log(req.body);
	//const data = req.body;

	//const URLs = Array.from(getURLs(data.URLs));
	const URLs = Array.from(
		getURLs(
			'https://www.theverge.com/22158504/best-games-2020-ps5-xbox-nintendo-tlou2-animal-crossing-miles-morales https://www.androidpolice.com/2021/01/22/microsoft-edges-latest-update-adds-new-themes-sleeping-tabs-and-more/   https://theblondeabroad.com/the-ultimate-guide-to-solo-female-travel/ '
		)
	);

	async function getMeta(URL) {
		let response = await fetch(URL);
		let data = await response.text();

		const $ = cheerio.load(data);

		function getIcon() {
			const iconFetch = $("link[rel='shortcut icon']").attr('href') || $("link[rel='icon']").attr('href');

			//if (iconFetch.slice(0, 8) == 'https://' || iconFetch.slice(0, 3) == 'www') {
			if (iconFetch.includes('https') || iconFetch.includes('www')) {
				return iconFetch;
			} else {
				var domain = 'https://' + URL.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
				return domain + '/' + iconFetch;
			}
			//return iconFetch.slice(0, 3);
		}

		const getTagData = propName =>
			$(`meta[name='${propName}']`).attr('content') ||
			$(`meta[property='twitter:${propName}']`).attr('content') ||
			$(`meta[property='og:${propName}']`).attr('content');

		return {
			URL: URL,
			title: $('title').first().text(),
			icon: getIcon(),
			img: getTagData('image'),
			des: getTagData('description'),
		};
	}

	Promise.all(URLs.map(el => getMeta(el)))
		.then(data => {
			console.log(data);
			res.render('index', {
				objj: data,
			});
		})
		.catch(console.log);
});
