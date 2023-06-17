const passport = require('passport');
const EasyAuthStrategy = require('@easyauth.io/passport-easyauth');
require('dotenv').config();

const PORT = process.env.PORT;
passport.use(
  new EasyAuthStrategy(
    {
      discoveryURL: process.env.DISCOVERY_URL,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: [`http://127.0.0.1:${PORT}/auth/easyauth/callback`],
    },
    function (tokenset, userinfo, done) {
      done(null, userinfo);
    }
  )
);
