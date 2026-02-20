const express =  require('express')
const app = express()
const cookieParser = require('cookie-parser')
const authrouter = require('./routes/auth.routes')
const accountrouter = require('./routes/account.routes')


app.use(express.json())
app.use(cookieParser())
app.use('/api/auth',authrouter)
app.use('/api/accounts',accountrouter)

module.exports = app