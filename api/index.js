const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const config = require('../config/index');
const db = require('../lib/db');

const {
  logErrors,
  errorHandler,
} = require('../utils/middleware/errorsHandler');


//Routes Call
const userRoutes = require('./components/user/routes');
const artistRoutes = require('./components/artist/routes');
const genderRoutes = require('./components/gender/routes');
const albumRoutes = require('./components/album/routes');

//Models
const User = require('../models/users');
const Artist = require('../models/artists');
const Gender = require('../models/gender');
const Album = require('../models/albums');


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
albumRoutes(app, Album);

app.use(logErrors);
app.use(errorHandler);


//Server
app.listen(config.port, () => {
    console.log(`Server listening at http://localhost:${config.port}`);
})