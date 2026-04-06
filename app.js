const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
require('dotenv').config();

const { ensureAuthenticated } = require('./helpers/auth');

const app = express();

<<<<<<< HEAD

=======
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
// ==========================================
// 1. LOAD MODELS
// ==========================================
require('./models/Users/Faculty');
require('./models/Users/Hod');
require('./models/Users/ManagerDB');
require('./models/AcademicYear');
<<<<<<< HEAD

=======
require('./models/Leave');

// Load Part Models
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
require('./models/Part1');
require('./models/Part2');
require('./models/Part3');
require('./models/Part4');

const AcademicYear = mongoose.model('academic_year');

<<<<<<< HEAD

// ==========================================
// 2. MIDDLEWARE
// ==========================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));


// ==========================================
// 3. PASSPORT CONFIG
// ==========================================
require('./config/passport')(passport);


// ==========================================
// 4. DATABASE
// ==========================================
const db = require('./config/database');

mongoose.connect(db.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


// ==========================================
// 5. HANDLEBARS
// ==========================================
const hbs = exphbs.create({
    helpers: {
        if_eq: function (a, b, opts) {
            return (a == b) ? opts.fn(this) : opts.inverse(this);
        }
    },
    defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// ==========================================
// 6. SESSION & FLASH
// ==========================================
app.use(session({
    secret: 'pbas_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
=======
// ==========================================
// 2. MIDDLEWARE & CONFIG
// ==========================================

// Body Parser Middleware
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/database');

// Connect to MongoDB
mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('Connected to MongoDB...') })
    .catch(err => console.log(err));

// Handlebars Setup with Helpers
app.engine('handlebars', exphbs({
    helpers: { 
        // Helper used for selecting semesters and status checks
        if_eq: function (a, b, opts) {
            if (a == b) return opts.fn(this);
            return opts.inverse(this);
        }
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Session & Flash
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

<<<<<<< HEAD

// ==========================================
// 7. HELPER: CURRENT YEAR
// ==========================================
function getCurrentAcademicYear() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    return month >= 6
        ? `${year}-${(year + 1).toString().slice(-2)}`
        : `${year - 1}-${year.toString().slice(-2)}`;
}


// ==========================================
// 8. GLOBAL VARIABLES (FIXED)
// ==========================================
app.use(async (req, res, next) => {

=======
// Helper for dynamic year generation
function getCurrentAcademicYear() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const month = now.getMonth() + 1;
    // Academic year usually starts from June (6)
    return month >= 6 
        ? `${currentYear}-${(currentYear + 1).toString().slice(-2)}` 
        : `${currentYear - 1}-${currentYear.toString().slice(-2)}`;
}

// ==========================================
// 3. GLOBAL VARIABLES (CRITICAL FOR NAVBAR)
// ==========================================
app.use(async (req, res, next) => {
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;

<<<<<<< HEAD
    try {
        if (req.user) {

            // ✅ PRIORITY: SESSION YEAR
            if (req.session.academicYear) {
                res.locals.year = req.session.academicYear;
            } else {
                const activeDoc = await AcademicYear.findOne({
                    user: req.user.id
                }).sort({ date: -1 });

                const year = activeDoc
                    ? activeDoc.academic_year
                    : getCurrentAcademicYear();

                // ✅ SAVE IN SESSION
                req.session.academicYear = year;

                res.locals.year = year;
            }

        } else {
            res.locals.year = getCurrentAcademicYear();
        }

    } catch (err) {
        res.locals.year = getCurrentAcademicYear();
    }

    next();
});


// ==========================================
// 9. ROUTES
// ==========================================
app.use('/part1', require('./routes/part1'));
app.use('/part2', require('./routes/part2'));
app.use('/part3', require('./routes/part3'));
app.use('/part4', require('./routes/part4'));

app.use('/summary', require('./routes/summary'));
app.use('/academicPerformance', require('./routes/academicPerformance'));

app.use('/profile', require('./routes/profile'));
app.use('/users', require('./routes/users'));
app.use('/forgot', require('./routes/reset'));


// ==========================================
// 10. HOME ROUTE
// ==========================================
app.get('/', (req, res) => {

    const currentYear = getCurrentAcademicYear();

    if (req.user) {
        AcademicYear.findOne({
            user: req.user.id,
            academic_year: currentYear
        })
        .then(doc => {
            res.render('index', {
                result: doc ? [doc] : null,
                defaultYear: currentYear
            });
        })
        .catch(() => {
            res.render('index', { result: null, defaultYear: currentYear });
        });
=======
    // This block ensures the Navbar links like /part1/view/{{year}} always work
    if (req.user) {
        try {
            const activeDoc = await AcademicYear.findOne({ user: req.user.id.toString() }).sort({ date: -1 });
            // If user has an active year session, use it; otherwise use the calculated current year
            res.locals.year = activeDoc ? activeDoc.academic_year : getCurrentAcademicYear();
            res.locals.status = activeDoc ? activeDoc.status : 'Not Started';
        } catch (err) {
            res.locals.year = getCurrentAcademicYear();
        }
    } else {
        res.locals.year = getCurrentAcademicYear();
    }
    next();
});

// ==========================================
// 4. LOAD ROUTE FILES
// ==========================================
const part1 = require('./routes/part1');
const part2 = require('./routes/part2');
const part3 = require('./routes/part3');
const part4 = require('./routes/part4');
const summary = require('./routes/summary');
const academicPerformance = require('./routes/academicPerformance');
const leave = require('./routes/leave');
const profile = require('./routes/profile');
const users = require('./routes/users');
const reset = require('./routes/reset');

// ==========================================
// 5. CORE LANDING & INITIALIZATION
// ==========================================

app.get('/', (req, res) => {
    const currentYear = getCurrentAcademicYear();
    if (req.user) {
        AcademicYear.findOne({ 
            user: req.user.id.toString(), 
            academic_year: currentYear 
        })
        .then(doc => {
            res.render('index', { 
                result: doc ? [doc] : null, 
                defaultYear: currentYear 
            });
        })
        .catch(() => res.render('index', { result: null, defaultYear: currentYear }));
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
    } else {
        res.render('index');
    }
});

<<<<<<< HEAD

// ==========================================
// 11. INITIALIZE YEAR (VERY IMPORTANT FIX)
// ==========================================
app.post('/', ensureAuthenticated, (req, res) => {

    const selectedYear = req.body.academic_year;

    AcademicYear.findOneAndUpdate(
        {
            user: req.user.id,
            academic_year: selectedYear
        },
        {
            user: req.user.id,
            academic_year: selectedYear,
            status: 'Draft'
        },
        { upsert: true }
    )
    .then(() => {

        // ✅ SAVE YEAR IN SESSION
        req.session.academicYear = selectedYear;

        req.flash('success_msg', 'Academic Year Initialized!');

        // ✅ REDIRECT TO PART 1 (START FLOW)
        res.redirect('/part1/view/' + selectedYear);

    })
    .catch(() => {
        req.flash('error_msg', 'Error initializing year');
=======
// INITIALIZE APPRAISAL (Create/Set the Year for the user)
app.post('/', ensureAuthenticated, (req, res) => {
    const selectedYear = req.body.academic_year;
    const userId = req.user.id.toString();

    AcademicYear.findOneAndUpdate(
        { user: userId, academic_year: selectedYear },
        { 
            user: userId, 
            academic_year: selectedYear,
            status: 'Draft' 
        },
        { upsert: true, new: true }
    )
    .then(() => {
        req.flash('success_msg', 'Year ' + selectedYear + ' initialized.');
        res.redirect('/users/faculty/facultyOverview');
    })
    .catch(err => {
        req.flash('error_msg', 'Could not initialize year.');
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
        res.redirect('/');
    });
});

<<<<<<< HEAD

// ==========================================
// 12. SERVER
// ==========================================
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`PBAS Portal running on port ${port}`);
});
=======
// ==========================================
// 6. USE ACTIVE ROUTES
// ==========================================
app.use('/part1', part1);
app.use('/part2', part2);
app.use('/part3', part3);
app.use('/part4', part4);
app.use('/summary', summary);
app.use('/academicPerformance', academicPerformance);
app.use('/leave', leave);
app.use('/profile', profile);
app.use('/users', users);
app.use('/forgot', reset);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`WIT PBAS Portal running on port ${port}`));
>>>>>>> ae83c00fa38fdd9afd9db53d0bd2167ce0e02c63
