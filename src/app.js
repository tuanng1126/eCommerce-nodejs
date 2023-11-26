const express = require('express')
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
require('dotenv').config()

const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init db
require('./dbs/init.mongodb')

app.get('', (req, res) => {
    res.status(200).json({
        message: "hello"
    })
})

module.exports = app