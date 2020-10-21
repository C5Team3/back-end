const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const config = require('../config/index');
const db = require('../lib/db');

//Routes Call
const userRoutes = require('./components/user/routes');
const artistRoutes = require('./components/artist/routes');

//Models
const User = require('../models/users');
const Artist = require('../models/artists');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.get('/api', (req, res) => { res.send('Hello World') });

//Connect Database
db.connect();

//Routes
userRoutes(User);
artistRoutes(Artist);


//Server
app.listen(config.port, () => {
    console.log(`Server listening at http://localhost:${config.port}`);
})