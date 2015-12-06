/*global describe, it, expect */

var Strategy = require('..').Strategy;


describe('Strategy', function() {

  var strategy = new Strategy(function() {});

  it('should be named "json-custom"', function() {
    expect(strategy.name).to.equal('json-custom');
  });

  it('should throw if constructed without a verify callback', function() {
    expect(function() {
      /*jshint unused:false */
      var s = new Strategy();
    }).to.throw(TypeError, 'JsonCustomStrategy requires a verify callback');
  });

});
