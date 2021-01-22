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

/*https://www.youtube.com/watch?v=PLzF5Ooot9g https://fireship.io https://www.thenetninja.co.uk/*/

app.post('/', (req, res) => {
	console.log(req.body);
	const data = req.body;

	fetch(data.URL)
		.then(res => res.text())
		.then(data => {
			const $ = cheerio.load(data);
			const title = $('title').first().text();
			const icon = $("link[rel='shortcut icon']").attr('href');
			const description = $("meta[name='description']").attr('content');

			res.render('index', {
				objj: {
					title: title,
					icon: icon,
					des: description,
				},
			});
		})
		.catch(err => console.log(err));
});
