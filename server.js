const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', (req, res) => {
	//res.send("I guess it's wrorking then");
	rs.render('index');
});
