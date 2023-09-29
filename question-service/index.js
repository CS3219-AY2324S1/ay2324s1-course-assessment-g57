require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// Changed port to 3000, somehow using 5000 doesn't work?
const port = 3000

var api = process.env.ENV == 'DEV' ? process.env.LOCAL_DB_URL : process.env.PROD_DB_URL
mongoose.connect(api, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('Connected to MongoDB!'))

app.use(express.json())

const questionRouter = require('./routes/questions')
app.use('/api/v1/questions', questionRouter)

app.listen(port, () => {
  console.log(`Server started on port ${port}.`)
})

