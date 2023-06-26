const passport = require('passport');
const EasyAuthStrategy = require('@easyauth.io/passport-easyauth');
require('dotenv').config();
const refresh = require('passport-oauth2-refresh');

const PORT = process.env.PORT;

const strategy = new EasyAuthStrategy(
  {
    discoveryURL: process.env.EASYAUTH_DISCOVERY_URL,
    clientID: process.env.EASYAUTH_CLIENT_ID,
    clientSecret: process.env.EASYAUTH_CLIENT_SECRET,
    callbackURL: [`http://127.0.0.1:${PORT}/auth/easyauth/callback`], //Enter respective redirect uri set to EasyAuth ClientID.
  },
  function (tokenset, userinfo, done) {
    userinfo.tokenset = tokenset;
    done(null, userinfo);
  }
);

passport.use(strategy);

//required for Refresh Token implementation.
strategy.issuerPromise.then(() => {
  refresh.use(strategy);
});

module.exports = {strategy};
