const path = require('path')
const express = require ('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require ('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

// Load config file
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method Override
app.use(methodOverride(function (req, res) {
    if(req.body && typeof req.body === 'object' && '_method' in req.body) {
        //look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

// I'm watching you!!

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Hamburger Helpers
const { formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')

// I can ride my bike with no...
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout: 'main',
    extname: '.hbs'
}
    ))
app.set('view engine', '.hbs')

// Session middleware
app.use(
    session({
        secret:'dingle dongle',
        saveUninitialized: false,
        resave: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        })
    })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

// Static Folder

app.use(express.static(path.join(__dirname, 'public')))

// Routes, no pouts!

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 5500

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))