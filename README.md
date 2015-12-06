# passport-json-custom
[![GitHub Latest Release](https://badge.fury.io/gh/JamesMGreene%2Fpassport-json-custom.svg)](https://github.com/JamesMGreene/passport-json-custom) [![Build Status](https://secure.travis-ci.org/JamesMGreene/passport-json-custom.svg?branch=master)](https://travis-ci.org/JamesMGreene/passport-json-custom) [![Coverage Status](https://coveralls.io/repos/JamesMGreene/passport-json/badge.svg?branch=master&service=github)](https://coveralls.io/github/JamesMGreene/passport-json?branch=master) [![Dependency Status](https://david-dm.org/JamesMGreene/passport-json-custom.svg?theme=shields.io)](https://david-dm.org/JamesMGreene/passport-json-custom) [![Dev Dependency Status](https://david-dm.org/JamesMGreene/passport-json-custom/dev-status.svg?theme=shields.io)](https://david-dm.org/JamesMGreene/passport-json-custom#info=devDependencies)

A [Passport][] strategy for custom authentication via JSON from the request body.

This module lets you authenticate using any custom set of JSON-based credentials in your Node.js applications.  By plugging into Passport, JSON authentication can be easily and unobtrusively integrated into any application or framework that supports [Connect][]-based middleware, including [Express][].


## Install

```shell
$ npm install passport-json-custom
```


## Usage

### Prerequisites

Before you can use this strategy, you _MUST_ ensure that your request (`req`) object always has a `body` property that is populated appropriately with parsed JSON.

For example, if you are using Passport and this strategy within Express `4.x` or above, you would want to set up the [`'body-parser'` middleware](https://www.npmjs.com/package/body-parser) to parse the request body's JSON before setting up the Passport middleware:

```js
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
```


### Configure Strategy

The JSON Custom authentication strategy authenticates users using any custom set of JSON-based credentials.  The strategy requires a `verify` callback, which accepts these credentials and calls `done` providing a user.

```js
var JsonCustomStrategy = require('passport-json-custom').Strategy;

passport.use(new JsonCustomStrategy(
  function(credentials, done) {
    Users.findOne({ username: credentials.username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(credentials.password)) { return done(null, false); }
      if (!user.verifyMfaCode(credentials.mfaCode)) { return done(null, false); }
      return done(null, user);
    });
  }
));
```

#### Available Options

This strategy takes an optional options hash before the `verify` function, e.g. `new JsonCustomStrategy(/* { options }, */ callback)`.

The available options include:

 - `passReqToCallback` - Optional, defaults to `false`


##### Using Those Options

###### `passReqToCallback`

The `verify` callback can be supplied with the `request` object _as the first argument_ by setting the `passReqToCallback` option to `true`, and changing the expected callback parameters accordingly. This may be useful if you also need access to the request's HTTP headers. For example:

```js
passport.use(new JsonCustomStrategy(
  {
    passReqToCallback: true
  },
  function(req, credentials, done) {
    // request object is now first argument
    // ...
  }
));
```


### Authenticating Requests

Use `passport.authenticate('json-custom')` to specify that you want to employ the configured `'json-custom'` strategy to authenticate requests.

For example, as route middleware in an [Express][] application:

```js
app.post(
  '/login', 
  passport.authenticate('json-custom', { failWithError: true }),
  function(req, res) {
    res.status(200).json({
      authenticated: req.isAuthenticated()
    });
  },
  function(err, req, res, next) {
    res.status(400).json({
      authenticated: req.isAuthenticated(),
      err: err.message
    });
  }
);
```


## License

Copyright (c) 2015, James M. Greene (MIT License)



<!--- RESOURCE LINKS -->

[Passport]: http://passportjs.org/
[Connect]: http://www.senchalabs.org/connect/
[Express]: http://expressjs.com/
