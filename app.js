if (process.env.NODE_ENV !== 'production') { // if I am in development mode, the contents of the env file are added to my node environment and accesssible across all files under 'process.env'
    require('dotenv').config()
}


const express = require('express')
const app = express();
const port = 3000;
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const catchAsync = require('./utils/catchasync')
const { campgroundSchema, reviewSchema } = require('./Joischemas.js')
const Review = require('./models/review')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const dbUrl = process.env.DB_URL




const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')


const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')




mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
//mongoose.connect(dbUrl)
    .then(() => {
        console.log('MONGO Connection Open');
    })
    .catch((error) => {
        console.error('MONGO Error!!!:', error);
    });


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(mongoSanitize())


const store = MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/yelp-camp',
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeasecret'
    }
});

store.on("error", function (e) {
    console.log("Session store error", e.name)
})

const sessionConfig = {
    store,
    name: 'congratsyoufoundme',
    secret: 'thisshouldbeasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //this makes the session not accessibe through javascript and only through http.
        //secure : true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
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
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
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
                "https://res.cloudinary.com/dtczgrboc/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser()) //tells passport how to store a user in a session
passport.deserializeUser(User.deserializeUser())// tells passport how to unstore a user in a session


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use(express.static(path.join(__dirname, 'public')))



app.get('/', (req, res) => {
    res.render('home')
})





app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: "My Backyard", description: "best campground in the world" })
    await camp.save()
    res.send(camp)
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
    //res.send('404!!!')
})



app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no something went wrong"
    res.status(statusCode).render('error', { err })

})


app.listen(port, () => {
    console.log("Listening on port 3000")
})