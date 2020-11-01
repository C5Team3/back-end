// /* -------------------------------------------------------------------------- */
// /*                            Test with an Live connecting to DB                           */
// /* -------------------------------------------------------------------------- */

const testServer = require('../utils/testServer');
const should = require('should');
const config = require('../config/index');
const user = require('../utils/fixtures/Users');

// Vars for testing

/* -------------------------------------------------------------------------- */
/*                 Alert: This Vars Should be Exist in Test DB                */
/* -------------------------------------------------------------------------- */

const username = config.default_admin_user_email;
const password = config.default_admin_user_password;



//   Replace Your Api Key Tokens
const authorizedApiKeyTokenAdmin = config.test_admin_api_key;
const authorizedApiKeyTokenPublic =config.test_public_api_key;

let newUser = user[10];

newUser.email = "example@demo.com" // override Email for control duplicate Keys on into DB

const request = testServer();

describe('Users Routes Test -> With [ADMIN] Scope /api/users', function () {
  

  it('get Users, should be require authorization', function (done) {
    request
      .get('/api/user')
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  let authAdmin = {};
  

  before(loginUser(authAdmin, authorizedApiKeyTokenAdmin));

  // Get All Users

  it('get Users should be respond after Bearer Authentication with JSON array', function (done) {
    request
      .get('/api/user')
      .auth(authAdmin.token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.body.should.be.instanceof(Array);
        done();
      });
  });

  // Create an new User

  it('create an new User should respond with JSON', function (done) {
    request
      .post(`/api/auth/sign-up`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);    
        }    
        newUser= res.body.body; 
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });
  
  // Get User with Specific ID

  it('get Specific User respond with JSON [Require Bearer Authentication] ', function (done) {
    request
      .get(`/api/user/${newUser._id}`)
      .auth(authAdmin.token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.body.should.be.instanceof(Object);
        done();
      });
  });
  

  // Update an User

  it('Update an User should respond with JSON', function (done) {
    request
      .put(`/api/user/${newUser._id}`)
      .auth(authAdmin.token, { type: 'bearer' })
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        // newUser.id= res.body.body.id; 
        // res.body.body.should.be.instanceof(Object);
        done();
      });
  });

  it('Delete User, should respond with JSON [Require Bearer Authentication ]', function (done) {
    request
      .delete(`/api/user/${newUser._id}`)
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

/* -------------------------------------------------------------------------- */
/*                        Test /Users with Public Scope                       */
/* -------------------------------------------------------------------------- */

describe('Users Routes Test -> With [PUBLIC] Scope /api/users', function () {

  var authPublic = {};
  
  before(loginUser(authPublic, authorizedApiKeyTokenPublic));

  // Get All Users


  it('get Users, should be require ADMIN Api Key Token return 401', function (done) {
    request
      .get('/api/user')
      .auth(authPublic.token, { type: 'bearer' })
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        res.error.should.be.instanceof(Object);
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
