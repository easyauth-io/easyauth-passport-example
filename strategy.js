const passport = require('passport');
const EasyAuthStrategy = require('@easyauth.io/passport-easyauth');
require('dotenv').config();

const PORT = process.env.PORT;
passport.use(
  new EasyAuthStrategy(
    {
      discoveryURL: process.env.EASYAUTH_DISCOVERY_URL,
      clientID: process.env.EASYAUTH_CLIENT_ID,
      clientSecret: process.env.EASYAUTH_CLIENT_SECRET,
      callbackURL: [`http://127.0.0.1:${PORT}/auth/easyauth/callback`], //Enter respective redirect uri set to EasyAuth ClientID.
    },
    function (tokenset, userinfo, done) {
      done(null, userinfo);
    }
  )
);
