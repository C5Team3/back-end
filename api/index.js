const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const config = require('../config/index');
const db = require('../lib/db');

//Routes Call
const userRoutes = require('./components/user/routes');
const artistRoutes = require('./components/artist/routes');
const genderRoutes = require('./components/gender/routes');

//Models
const User = require('../models/users');
const Artist = require('../models/artists');
const Gender = require('../models/gender');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.get('/api', (req, res) => { res.send('Hello World') });

//Connect Database
db.connect();

//Routes
userRoutes(app, User);
artistRoutes(app, Artist);
genderRoutes(app, Gender);


//Server
app.listen(config.port, () => {
    console.log(`Server listening at http://localhost:${config.port}`);
})