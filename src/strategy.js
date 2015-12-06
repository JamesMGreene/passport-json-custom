// Node.js core modules
var util = require('util');

// Userland modules
var passport = require('passport-strategy');


/**
 * `Strategy` constructor.
 *
 * The JSON custom authentication strategy authenticates requests based on the
 * credentials submitted through a JSON-based login form or REST call.
 *
 * Applications must supply a `verify` callback which accepts a `credentials`
 * custom object, and then calls the `done` callback supplying a `user`, which
 * should be set to `false` if the credentials are not valid. If an exception
 * occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new JsonCustomStrategy(
 *       function(credentials, done) {
 *         User.findOne(
 *           { username: credentials.username, password: credentials.password },
 *           function (err, user) {
 *             done(err, user);
 *           }
 *         );
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @constructor
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }

  if (typeof verify !== 'function') {
    throw new TypeError('JsonCustomStrategy requires a verify callback');
  }

  passport.Strategy.call(this);
  this.name = 'json-custom';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};

  var self = this;

  // NOTE: MIME types must be handled in a case-insensitive manner!
  var jsonContentTypeRegex = /^application\/json(;\s*charset=utf-[\d]+)?\s*$/i;

  var contentType = typeof req.get === 'function' ? req.get('Content-Type') : req.headers['content-type'];

  if (!contentType || !jsonContentTypeRegex.test(contentType)) {
    return self.fail({
      message: options.badRequestMessage || 'Unacceptable content type'
    }, 415);
  }

  var creds = req.body;

  if (
    !creds || typeof creds !== 'object' ||
    (
      creds instanceof Array ?
        creds.length === 0 :
        Object.keys(creds).length === 0
    )
  ) {
    return self.fail({
      message: options.badRequestMessage || 'Missing credentials'
    }, 400);
  }

  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    self.success(user, info);
  }

  try {
    if (self._passReqToCallback) {
      self._verify(req, creds, verified);
    }
    else {
      self._verify(creds, verified);
    }
  }
  catch (ex) {
    return self.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
