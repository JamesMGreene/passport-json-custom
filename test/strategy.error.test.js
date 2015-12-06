/*global describe, it, expect, before */

var chai = require('chai'),
    Strategy = require('..').Strategy;


describe('Strategy', function() {

  describe('encountering an error during verification', function() {
    var strategy = new Strategy(function(creds, done) {
      done(new Error('something went wrong'));
    });

    var err;

    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
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

    it('should error', function() {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went wrong');
    });
  });


  describe('encountering an exception during verification', function() {
    var strategy = new Strategy(function(/* creds, done */) {
      throw new Error('something went horribly wrong');
    });

    var err;

    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
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

    it('should error', function() {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went horribly wrong');
    });
  });

});
