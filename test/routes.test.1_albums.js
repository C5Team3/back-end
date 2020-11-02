// /* -------------------------------------------------------------------------- */
// /*                            Test with an Live connecting to DB                           */
// /* -------------------------------------------------------------------------- */

const testServer = require('../utils/testServer');
const should = require('should');
const config = require('../config/index');

// Vars for testing

/* -------------------------------------------------------------------------- */
/*                 Alert: This Vars Should be Exist in Test DB                */
/* -------------------------------------------------------------------------- */


const username = config.default_admin_user_email;
const password = config.default_admin_user_password;

const authorizedApiKeyTokenAdmin = config.test_admin_api_key;

const request = testServer();

describe('Albums Routes Test -> With [ADMIN] Scope /api/users', function () {
  
  it('get Albums, should be require authorization return Error 401', function (done) {
    request
      .get('/api/album')
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  var authAdmin = {};
  var newAlbum =     {
    "spotifyId": "6S2yoawbVJJtaxzupYNgDwdfdf",
    "title": "Album for Demo",
    "year": "2005-05-09",
    "cover_img": "https://i.scdn.co/image/ab67616d0000b273fe43ee18c408505d7a2c576b",
    "artist_Id": "5f9e22655e5203a843066f8a"
  };

  before(loginUser(authAdmin, authorizedApiKeyTokenAdmin));

  // Get All Users

  it('get Albums should be respond after Bearer Authentication with JSON array', function (done) {
    request
      .get('/api/album')
      .auth(authAdmin.token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });
  // Get Album with Specific ID

  // Create an new Album

  it('create an new Album should respond with JSON', function (done) {
    request
      .post(`/api/album`)
      .auth(authAdmin.token, { type: 'bearer' })
      .send(newAlbum)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        newAlbum.id = res.body.body._id;
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });

  it('get Specific Album respond with JSON [Require Bearer Authentication] ', function (done) {
    request
      .get(`/api/album/${newAlbum.id}`)
      .auth(authAdmin.token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });

  // Update an Album

  it('Update an Album should respond with JSON', function (done) {
    request
      .put(`/api/album/${newAlbum.id}`)
      .auth(authAdmin.token, { type: 'bearer' })
      .send(newAlbum)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        // newUser.id= res.body.body.id;
        // res.body.body.should.be.instanceof(Object);
        done();
      });
  });

  it('Delete Album, should respond with JSON [Require Bearer Authentication ]', function (done) {
    request
      .delete(`/api/album/${newAlbum.id}`)
      .auth(authAdmin.token, { type: 'bearer' })
      .expect(200)
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
