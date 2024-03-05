if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');

const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

const passport = require('passport')
const localStrategy = require('passport-local')

const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');

const stays = require('./routes/stays')
const reviews = require('./routes/reviews')
const users = require('./routes/users')

const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const dbUrl = process.env.db_url
// console.log(dbUrl)
//const dbUrl = 'mongodb://127.0.0.1:27017/yelpCamp';

// mongoose.connect(dbUrl, {
//     //useNewUrlParser: true,
//     //useCreateIndex: true,
//     //useUnifiedTopology: true,
//     //useFindAndModify: false
// });

mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
//     .then(() => {
//         console.log('conectado a la bd');
//     })
//     .catch((err) => {
//         console.log('error ocurred', err)
//     })

const app = express();

app.engine('ejs', ejsmate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/diztlyb0g/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const store = new MongoStore({
    mongoUrl: dbUrl,
    crypto: {
        secret: 'topsecret'
    },
    touchAfter: 24 * 60 * 60

});

store.on('error', function (e) {
    console.log('Session store error');
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'topsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig)) // tiene que estar antes de passport
app.use(flash())

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    console.log(req.query, req.body)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/stays', stays)

app.use('/stays/:id/reviews', reviews)
app.use('/', users)





app.get('/', (req, res) => {
    res.render('index');
})

app.get('/hola', (req, res) => {
    chicken.fly();
})


app.all('*', (req, res, next) => {
    next(ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Ocurrio un Error' } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(status).render('error', { err });

})


app.listen(3000, () => {
    console.log('conectado a puerto 3000');
});