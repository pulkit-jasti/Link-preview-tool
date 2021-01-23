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

app.get('/', (req, res) => {
	res.render('index', {
		objj: [],
	});
});

/* https://hacksrm.tech/https://www.youtube.com/watch?v=PLzF5Ooot9g https://fireship.io https://www.thenetninja.co.uk/*/

app.post('/', (req, res) => {
	console.log(req.body);
	const data = req.body;

	const URLs = Array.from(getURLs(data.URLs));

	async function getMeta(URL) {
		let response = await fetch(URL);
		let data = await response.text();

		const $ = cheerio.load(data);

		const getTagData = propName =>
			$(`meta[name='${propName}']`).attr('content') ||
			$(`meta[property='twitter:${propName}']`).attr('content') ||
			$(`meta[property='og:${propName}']`).attr('content');

		return {
			URL: URL,
			title: $('title').first().text(),
			icon: URL + '/' + ($("link[rel='shortcut icon']").attr('href') || $("link[rel='icon']").attr('href')),
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
