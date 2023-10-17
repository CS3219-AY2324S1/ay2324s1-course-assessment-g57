const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const axios = require('axios');
const port = 3001
const db = require('../services/user_api/queries')
// const serverless = require("serverless-http")

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


const verifyJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,  
    jwksUri: 'https://dev-r67hrnstb5x4ekjv.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'user-service-api',
  issuer: 'https://dev-r67hrnstb5x4ekjv.us.auth0.com/',
  algorithms: ['RS256']
}).unless({ path: ['/users'] });

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.use(verifyJwt);

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

// module.exports.handler = serverless(app);
