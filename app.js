const path = require('path')
const express = require ('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')

// Load config file
dotenv.config({ path: './config/config.env' })

connectDB()

const app = express()

// I'm watching you!!

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// I can ride my bike with no...
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs'
}
    ))
app.set('view engine', '.hbs')

// Static Folder

app.use(express.static(path.join(__dirname, 'public')))

// Routes, no pouts!

app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 5500

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))