const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

//exporting passportConfig file
const initializePassport = require('./passportConfig');
//calling passport function from passportConfig
initializePassport(passport);

//bringing pool object from dbConfig file
const { pool } = require('./dbConfig');

const port = process.env.PORT || 3000;

/*importing ejs middleware to tell app to render 
ejs files according to the routes defined below*/
app.set('view engine', 'ejs');

//middleware for sending details from frontend to the server {body-parser}
app.use(express.urlencoded({ extended: false }));

//middleware to use session
app.use(session({
    //secret key to encrypt user data stored in session
    secret: 'secret',
    //if no data is changed then not save it again n again
    resave: false,
    //to save session details
    saveUninitialized: false,
}));

//using passport lib sessions and function
app.use(passport.initialize());
app.use(passport.session());

//to use flash msgs
app.use(flash());

//route for not logged user
app.get('/', async (req, res) => {
    res.render('index');
});

//route for login user
app.get('/users/login', checkAuthentication, (req, res) => {
    res.render('login');
});

//route for register user
app.get('/users/register', checkAuthentication, (req, res) => {
    res.render('register');
});

//route for login user
app.get('/users/dashboard', checkNotAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user.name });
});

//logout route
app.get('/users/logout', (req, res) => {
    req.logOut();
    req.flash({ success_message: 'You have logged out' });
    res.redirect('login');
});

//register post request
app.post('/users/register', async (req, res) => {
    let { name, email, password, password2 } = req.body;
    let errors = [];
    console.log({ name, email, password, password2 });

    //input validation checks
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please enter all fields" });
    }
    if (password.length < 6) {
        errors.push({ msg: "Password is too short" });
    }
    if (password != password2) {
        errors.push({ msg: "Passowrds donot match" });
    }

    if (errors.length > 0) {
        res.render('register', { errors });
    } else {
        //validation has passed
        let hashedPass = await bcrypt.hash(password, 10);
        console.log(hashedPass);

        pool.query(`select * from users where email = $1`,
            [email], (err, results) => {
                if (err) {
                    throw err;
                }
                console.log(results.rows);

                if (results.rows.length > 0) {
                    errors.push({ msg: "User already exists" });
                    res.render('register', { errors });
                } else {
                    //means no user is registered by the email so register a new user
                    pool.query(`insert into users (name, email, password)
                                values ($1, $2, $3) returning id, password`,
                        [name, email, hashedPass], (err, results) => {
                            if (err) {
                                throw err;
                            } else {
                                console.log(results.rows);
                                req.flash({ success_message: "Your are registered" });
                                res.redirect('login');
                            }
                        });
                }
            });
    }
});

// post request for loging in for registered user
app.post('/users/login', passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
}));

//facebook OAuth routes
app.get('/auth/facebook',
    passport.authenticate('facebook', {scope: ['email']}));
    
app.get('/auth/facebook/callback',
    passport.authenticate('facebook',
        {
            failureRedirect: '/users/login',
            successRedirect: '/users/dashboard',
        }));


//checking user aunthentication
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/dashboard');
    }
    next();
}
//if user is not authenticated
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}

app.listen(port, console.log(`Listening on port ${port}`));
