const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
const refresh = require('passport-oauth2-refresh');

const {strategy} = require('./strategy');
require('dotenv').config();

const PORT = process.env.PORT;

app.use(
  session({
    secret: 'my secret key you dont know',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// App middleware to check and refresh the Access Token if it is expired.
// Whenever you want to refresh the access token, call refresh.requestNewAccessToken with values as passed below.
app.use((req, res, next) => {
  if (
    req.user?.tokenset &&
    Date.now() / 1000 >= req.user?.tokenset.expires_at
  ) {
    refresh.requestNewAccessToken(
      strategy.name,
      req.user.tokenset.refresh_token,
      function (err, accessToken, refreshToken, newTokenSet) {
        req.user.tokenset.access_token = accessToken;
        req.user.tokenset.refresh_token = refreshToken;
        req.user.tokenset.expires_at =
          Date.now() / 1000 + newTokenSet.expires_in;
        req.session.save();
        next();
      }
    );
  } else {
    next();
  }
});

//A middleware to check user for protected routes.
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/easyauth/login');
};

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get('/', (req, res) => {
  res.send('EasyAuth Passport Home Page');
});

//Login Route
app.get(
  '/auth/easyauth/login',
  passport.authenticate('easyauth', {scope: 'openid'})
);

//Callback Route
app.get(
  '/auth/easyauth/callback',
  passport.authenticate('easyauth', {failureRedirect: '/failed'}),
  (req, res) => {
    res.redirect('/easyauthprofile');
  }
);

//Logout Route
app.get('/auth/easyauth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.send('Successfully Logged out.');
    }
  });
});

//Failed Route
app.get('/failed', (req, res) => {
  res.send('Login Failed');
});

//Success Route
app.get('/easyauthprofile', (req, res) => {
  res.send(`User: ${JSON.stringify(req.user)}`);
});

//Protected Route
app.get('/protectedroute', isAuthenticated, (req, res) => {
  res.send('You are an authenticated user.');
});

app.listen(PORT, () => {
  console.log(`Server started on http://127.0.0.1:${PORT}.`);
});
