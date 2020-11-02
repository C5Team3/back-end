const express = require('express');
const helmet = require('helmet');
const cors = require('cors');


const debug = require('debug')('app:api:index') 
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
const albumRoutes = require('./components/album/routes');
const trackRoutes = require('./components/track/routes');
const authRoutes = require('./components/auth/routes');
const playlistRoutes = require('./components/playlist/routes');
const searchRoutes = require('./components/searchHistory/routes');

//Models
const User = require('../models/users'); // Disable for test
const Artist = require('../models/artists');
const Album = require('../models/albums');
const Track = require('../models/tracks');
const Playlist = require('../models/playlists');
const SearchHistory = require('../models/searchHistory');



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.get('/api', (req, res) => { res.send('Hello World') });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

//Connect Database

if(config.db_test_mode=="true"){
  const db_test = config.db_local_test_url;
  debug(chalk.blue("Changing DB Mode to Testing, Connected to Test DB"));
  db.connect(db_test);
}
else{
  debug(chalk.red("Connected to Production DB"));
  db.connect();
}

//Routes
userRoutes(app, User);
artistRoutes(app, Artist);
albumRoutes(app, Album);
trackRoutes(app, Track);
authRoutes(app, User);
playlistRoutes(app, Playlist);
searchRoutes(app, SearchHistory);


app.use(logErrors);
app.use(errorHandler);


//Server
app.listen(config.port, () => {
    debug(chalk.red(`Server listening at http://localhost:${config.port}`));
})