const express = require('express');
const supertest = require('supertest');
const bodyParser = require('body-parser');
const config = require('../config/index');

const db = require('../lib/db');

//Routes Call

const artistRoutes = require('../api/components/artist/routes');
const albumRoutes = require('../api/components/album/routes');
const trackRoutes = require('../api/components/track/routes');
const authRoutes = require('../api/components/auth/routes');
const userRoutes = require('../api/components/user/routes');
const playlistRoutes = require('../api/components/playlist/routes');


//Models

const Artist = require('../models/artists');
const Album = require('../models/albums');
const Track = require('../models/tracks');
const Playlist = require('../models/playlists');
const User = require('../models/users');


function testServer() {
    const app = express();

    if(config.db_test_mode=="true"){
      const db_test = config.db_local_test_url;
      db.connect(db_test);
    }
    else{

      db.connect();
    }
    

  
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

//Routes
    
    artistRoutes(app, Artist);
    albumRoutes(app, Album);
    trackRoutes(app, Track);
    userRoutes(app, User);
    authRoutes(app, User);
    playlistRoutes(app, Playlist);

    return supertest(app);
}

module.exports = testServer;