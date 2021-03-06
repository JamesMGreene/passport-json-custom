/*global describe, it, expect, before */
/*jshint expr:true */

var chai = require('chai'),
    Strategy = require('..').Strategy;


describe('Strategy', function() {

  describe('failing authentication', function() {
    var strategy = new Strategy(function(creds, done) {
      return done(null, false);
    });

    var info;

    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i) {
          info = i;
          done();
        })
        .req(function(req) {
          req.headers['content-type'] = 'application/json';

          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
          req.body.mfaCode = '123456';
        })
        .authenticate();
    });

    it('should fail', function() {
      expect(info).to.be.undefined;
    });
  });

  describe('failing authentication with info', function() {
    var strategy = new Strategy(function(creds, done) {
      return done(null, false, { message: 'authentication failed' });
    });

    var info;

    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i) {
          info = i;
          done();
        })
        .req(function(req) {
          req.headers['content-type'] = 'application/json';

          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
          req.body.mfaCode = '123456';
        })
        .authenticate();
    });

    it('should fail', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('authentication failed');
    });
  });

});
