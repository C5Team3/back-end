const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
// TODO: VERIFY DEBUG CONSOLE
const debug = require('debug') 
const chalk = require('chalk');

const config = require('../config/index');
const db = require('../lib/db');

const {
  logErrors,
  errorHandler,
} = require('../utils/middleware/errorsHandler');

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

//Routes Call
const userRoutes = require('./components/user/routes');
const artistRoutes = require('./components/artist/routes');
const genderRoutes = require('./components/gender/routes');
const albumRoutes = require('./components/album/routes');
const trackRoutes = require('./components/track/routes');



//Models
const User = require('../models/users');
const Artist = require('../models/artists');
const Gender = require('../models/gender');
const Album = require('../models/albums');
const Track = require('../models/tracks');



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.get('/api', (req, res) => { res.send('Hello World') });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

//Connect Database
db.connect();

//Routes
userRoutes(app, User);
artistRoutes(app, Artist);
genderRoutes(app, Gender);
albumRoutes(app, Album);
trackRoutes(app, Track);

app.use(logErrors);
app.use(errorHandler);


//Server
app.listen(config.port, () => {
    debug(chalk.red(`Server listening at http://localhost:${config.port}`));
})