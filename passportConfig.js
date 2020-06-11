const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const FacebookStrategy = require('passport-facebook');
const fbOAuth = require("./oAuth");

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              //password is incorrect
              return done(null, false, { message: "Password is incorrect" });
            }
          });
        } else {
          // No user
          return done(null, false, {
            message: "No user with that email address"
          });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );

  //serialize function stores the user data into the session
  //in the variable "user" that is passed using the done() function
  passport.serializeUser((user, done) =>
    done(null, user)
  );


  //deserialize function is used to fetch data stored in session
  //that was stored with searialize function. This fetching is 
  //done by a key (in this case user.id) 
  passport.deserializeUser((user, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [user.id], (err, results) => {
      if (err) {
        return done(err);
      }
      return done(err, results.rows[0]);
    });
  });

  //facebook login
  passport.use(new FacebookStrategy({
    clientID: fbOAuth.facebookAuth.clientID,
    clientSecret: fbOAuth.facebookAuth.clientSecret,
    callbackURL: fbOAuth.facebookAuth.callbackURL
  },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        // console.log(profile);
        pool.query(`select * from users where id=$1`, [profile.id],
          (err, results) => {
            if (err) {
              // console.log('here1');
              throw err;
            }
            console.log(results.rows);
            if (results && results.rows.length === 0) {
              //i have put null values in place of email and password
              //because in my database these are set not null, 
              //you can create a table without these restrictions and then
              //you woun't have to put null
              pool.query('insert into users (id, name, email, password) values ($1, $2, $3, $4)',
                [profile.id, profile.displayName, 'null', 'null']);
              console.log("User added successfully");
            } else {
              console.log('User already exists');
            }
            return done(null, profile);
          });
      });
    }
  ));
}
module.exports = initialize;