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

var newArtist = {
  "followers": 0,
  "listenersCounter": 0,
  "songs": 0,
  "spotifyId": "7hQmAXAzWI6D350VTgkKTG",
  "name": "Arash",
  "cover_img": "https://i.scdn.co/image/31d4eda35d8b2066ede3beae086f43ac8d6cf15c"
}


const username = config.default_admin_user_email;
const password = config.default_admin_user_password;

const authorizedApiKeyTokenAdmin = config.test_admin_api_key;

const request = testServer();

describe('Artists Routes Test -> With [ADMIN] Scope /api/artist', function () {
  
  it('get Artists, should be require authorization return Error 401', function (done) {
    request
      .get('/api/artist')
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  var authAdmin = {};

  before(loginUser(authAdmin, authorizedApiKeyTokenAdmin));
  beforeEach(flush);

  // Get All Artists

  it('get Artists should be respond after Bearer Authentication with JSON array', function (done) {
    request
      .get('/api/artist')
      .auth(authAdmin.token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });
  // Get Artist with Specific ID

  // Create an new Artist

  it('create an new Artist should respond with JSON', function (done) {
    request
      .post(`/api/artist`)
      .auth(authAdmin.token, { type: 'bearer' })
      .send(newArtist)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        newArtist = res.body.body;
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });

  it('get Specific Artist respond with JSON [Require Bearer Authentication] ', function (done) {
    request
      .get(`/api/artist/${newArtist._id}`)
      .auth(authAdmin.token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });

  // // Update an Artist

  it('Update an Artist should respond with JSON', function (done) {
    request
      .put(`/api/artist/${newArtist._id}`)
      .auth(authAdmin.token, { type: 'bearer' })
      .send(newArtist)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });

  it('Delete Artist, should respond with JSON [Require Bearer Authentication ]', function (done) {
    request
      .delete(`/api/artist/${newArtist._id}`)
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
