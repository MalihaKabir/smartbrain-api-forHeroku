const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profileID');
const imgEntry = require('./controllers/imgEntry');

const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true
	}
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// basic/root route:
app.get('/', (req, res) => {
	res.send('this is working!');
});

// signin route: (with advanced function)
app.post('/signin', signin.handleSignin(db, bcrypt));

// register/new user route:
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));

// id of users:
app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db));

// image entry count:
app.put('/image', (req, res) => imgEntry.handleImgEntries(req, res, db));
app.post('/imageurl', (req, res) => imgEntry.handleApiCall(req, res));

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
});
