const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const port = 3001
const local_db = require('./controller/controller_local')
const prod_db = require('./controller/controller_prod')
const serverless = require("serverless-http")

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

app.use(express.json());

// app.use(verifyJwt);

const db = process.env.ENV == 'DEV' ? local_db : prod_db

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

if (process.env.ENV == 'DEV') {
  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })
} else {
    module.exports.handler = serverless(app);
}
