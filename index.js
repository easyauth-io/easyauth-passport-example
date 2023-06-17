const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();

require('./strategy');
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

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get('/', (req, res) => {
  res.send('EasyAuth Passport Home Page');
});

//LOGIN ROUTE
app.get(
  '/auth/easyauth/login',
  passport.authenticate('easyauth', {scope: 'openid'})
);

//CALLBACK ROUTE
app.get(
  '/auth/easyauth/callback',
  passport.authenticate('easyauth', {failureRedirect: '/failed'}),
  (req, res) => {
    res.redirect('/easyauthprofile');
  }
);

//LOGOUT ROUTE
app.get('/auth/easyauth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.send('Successfully Logged out.');
    }
  });
});

//FAILED ROUTE
app.get('/failed', (req, res) => {
  res.send('Login Failed');
});

//SUCCESS ROUTE
app.get('/easyauthprofile', (req, res) => {
  res.send(`User: ${JSON.stringify(req.user)}`);
});

app.listen(PORT, () => {
  console.log(`Server started on http://127.0.0.1:${PORT}.`);
});
