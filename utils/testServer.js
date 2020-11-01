const express = require('express');
const supertest = require('supertest');
const bodyParser = require('body-parser')

const db = require('../lib/db');

//Routes Call

const artistRoutes = require('../api/components/artist/routes');
const genderRoutes = require('../api/components/gender/routes');
const albumRoutes = require('../api/components/album/routes');
const trackRoutes = require('../api/components/track/routes');
const authRoutes = require('../api/components/auth/routes');
const userRoutes = require('../api/components/user/routes');
const playlistRoutes = require('../api/components/playlist/routes');


//Models

const Artist = require('../models/artists');
const Gender = require('../models/gender');
const Album = require('../models/albums');
const Track = require('../models/tracks');
const Playlist = require('../models/playlists');
const User = require('../models/users');


function testServer() {
    const app = express();

  //Connect Database
  // const MONGO_URI_OVERRIDE =`mongodb://127.0.0.1:27017/music_app_test`;
  // db.connect(MONGO_URI_OVERRIDE);
  db.connect();
  
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

//Routes
    
    artistRoutes(app, Artist);
    genderRoutes(app, Gender);
    albumRoutes(app, Album);
    trackRoutes(app, Track);
    userRoutes(app, User);
    authRoutes(app, User);
    playlistRoutes(app, Playlist);

    return supertest(app);
}

module.exports = testServer;