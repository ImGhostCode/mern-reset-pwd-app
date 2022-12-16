const express = require('express');
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//init database
require('./v1/databases/init.mongodb')
// require('./v1/databases/init.redis').connect()

//use middleware
app.use(helmet())
app.use(compression())
app.use(morgan('combined'))
app.use(cookieParser())
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Router
app.use(require('./v1/routes/index.router'))


// Handle error
app.use((req, res, next) => {
    const error = new Error("Not found")
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        error: {
            status: err.status || 500,
            message: err.message || 'Internal Server Error'
        }
    })
})



module.exports = app;