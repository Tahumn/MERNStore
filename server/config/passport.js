const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const keys = require('./keys');
const { EMAIL_PROVIDER } = require('../constants');

const User = require('../models/user');
const { google = {}, facebook = {} } = keys;
const secret = keys.jwt.secret;

// JWT STRATEGY
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

passport.use(
  new JwtStrategy(opts, (payload, done) => {
    User.findById(payload.id)
      .then((user) => (user ? done(null, user) : done(null, false)))
      .catch((err) => done(err, false));
  })
);

module.exports = (app) => {
  app.use(passport.initialize());
  googleAuth();
  facebookAuth();
};

// GOOGLE AUTH
const googleAuth = () => {
  const hasKeys =
    Boolean(google.clientID && google.clientSecret && google.callbackURL);

  if (!hasKeys) {
    console.info('Google OAuth keys are missing. Google login is disabled.');
    return;
  }

  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: google.clientID,
          clientSecret: google.clientSecret,
          callbackURL: google.callbackURL,
        },
        (accessToken, refreshToken, profile, done) => {
          User.findOne({ email: profile.email })
            .then((user) => {
              if (user) return done(null, user);

              const name = profile.displayName?.split(' ') || [''];

              const newUser = new User({
                provider: EMAIL_PROVIDER.Google,
                googleId: profile.id,
                email: profile.email,
                firstName: name[0],
                lastName: name[1] || '',
                avatar: profile.picture,
                password: null,
              });

              newUser.save((err, user) =>
                err ? done(err, false) : done(null, user)
              );
            })
            .catch((err) => done(err, false));
        }
      )
    );
  } catch (error) {
    console.log('Failed to initialise Google OAuth strategy:', error);
  }
};

// FACEBOOK AUTH
const facebookAuth = () => {
  const hasKeys =
    Boolean(
      facebook.clientID && facebook.clientSecret && facebook.callbackURL
    );

  if (!hasKeys) {
    console.info('Facebook OAuth keys are missing. Facebook login is disabled.');
    return;
  }

  try {
    passport.use(
      new FacebookStrategy(
        {
          clientID: facebook.clientID,
          clientSecret: facebook.clientSecret,
          callbackURL: facebook.callbackURL,
          profileFields: [
            'id',
            'displayName',
            'name',
            'emails',
            'picture.type(large)',
          ],
        },
        (accessToken, refreshToken, profile, done) => {
          User.findOne({ facebookId: profile.id })
            .then((user) => {
              if (user) return done(null, user);

              const newUser = new User({
                provider: EMAIL_PROVIDER.Facebook,
                facebookId: profile.id,
                email: profile.emails ? profile.emails[0].value : null,
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
                avatar: profile.photos?.[0]?.value || null,
                password: null,
              });

              newUser.save((err, user) =>
                err ? done(err, false) : done(null, user)
              );
            })
            .catch((err) => done(err, false));
        }
      )
    );
  } catch (error) {
    console.log('Failed to initialise Facebook OAuth strategy:', error);
  }
};
