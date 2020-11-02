// /* -------------------------------------------------------------------------- */
// /*                            Test with an Live connecting to DB                           */
// /* -------------------------------------------------------------------------- */
const flush = require('flush-cache');
const testServer = require('../utils/testServer');
const should = require('should');
const config = require('../config/index');

// Vars for testing

/* -------------------------------------------------------------------------- */
/*                 Alert: This Vars Should be Exist in Test DB                */
/* -------------------------------------------------------------------------- */

var newTrack = {
    "duration_ms": 178533,
    "likes": 0,
    "plays": 0,
    "genres": [
      "persian pop",
      "romanian pop"
    ],
    "title": "She Example Song Makes Me Go (feat. Sean Paul) - Radio Edit",
    "url": "https://p.scdn.co/mp3-preview/5d25761c4dd4976a4109bf091bb7fc53bf874c57?cid=82f8b011b4fb41a3a841ede2dd73edf0",
    "spotifyId": "3E3S5LUXcNnTw26mZ8SVp1",
    "album_Id": "5f9f140eecfdd5dfcae61e8e",
    "artist_Id": "5f9f140eecfdd5dfcae61e8a"
  }

const username = config.default_admin_user_email;
const password = config.default_admin_user_password;

const authorizedApiKeyTokenAdmin = config.test_admin_api_key;

const request = testServer();

describe('Tracks Routes Test -> With [ADMIN] Scope /api/track', function () {
  
  it('get Tracks, should be require authorization return Error 401', function (done) {
    request
      .get('/api/track')
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  var authAdmin = {};

  before(loginUser(authAdmin, authorizedApiKeyTokenAdmin));
  beforeEach(flush);

  // Get All Tracks

  it('get Tracks should be respond after Bearer Authentication with JSON array', function (done) {
    request
      .get('/api/track')
      .auth(authAdmin.token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });
  // Get Track with Specific ID

  // Create an new Track

  it('create an new Track should respond with JSON', function (done) {
    request
      .post(`/api/track`)
      .auth(authAdmin.token, { type: 'bearer' })
      .send(newTrack)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        newTrack = res.body.body;
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });

  // Search Tracks 
  
  it('create an new Track should respond with JSON', function (done) {
    request
      .post(`/api/track`)
      .auth(authAdmin.token, { type: 'bearer' })
      .send(newTrack)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        newTrack = res.body.body;
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });

  it('get Specific Track respond with JSON [Require Bearer Authentication] ', function (done) {
    request
      .get(`/api/track/${newTrack._id}`)
      .auth(authAdmin.token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });

  // // Update an Track

  it('Update an Track should respond with JSON', function (done) {
    request
      .put(`/api/track/${newTrack._id}`)
      .auth(authAdmin.token, { type: 'bearer' })
      .send(newTrack)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });

  it('Delete Track, should respond with JSON [Require Bearer Authentication ]', function (done) {
    request
      .delete(`/api/track/${newTrack._id}`)
      .auth(authAdmin.token, { type: 'bearer' })
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });
});

//  Login User with Basic Authentication

function loginUser(auth, apiKeyToken) {
  return function (done) {
    request
      .post('/api/auth/sign-in')
      .send({
        apiKeyToken: `${apiKeyToken}`,
      })
      .set('Accept', 'application/json')
      .auth(username, password)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(async function (err, res) {
        const data = res.body.body;
        auth.token = data.token;
        if (err) return done(err);
        done();
      });
  };
}
