const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoute = require('./routes/auth')
require('dotenv/config')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/user', authRoute)

mongoose.connect(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log('connected to db'))
app.listen(3000, () => console.log('listening on port 3000'))