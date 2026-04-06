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


// ==========================================
// 1. LOAD MODELS
// ==========================================
require('./models/Users/Faculty');
require('./models/Users/Hod');
require('./models/Users/ManagerDB');
require('./models/AcademicYear');

require('./models/Part1');
require('./models/Part2');
require('./models/Part3');
require('./models/Part4');

const AcademicYear = mongoose.model('academic_year');


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
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


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

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;

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
    } else {
        res.render('index');
    }
});


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
        res.redirect('/');
    });
});


// ==========================================
// 12. SERVER
// ==========================================
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`PBAS Portal running on port ${port}`);
});