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


// passport.use('provider', new OAuthStrategy({
//     requestTokenURL: 'https://www.provider.com/oauth/request_token',
//     accessTokenURL: 'https://www.provider.com/oauth/access_token',
//     userAuthorizationURL: 'https://www.provider.com/oauth/authorize',
//     consumerKey: '123-456-789',
//     consumerSecret: 'shhh-its-a-secret',
//     callbackURL: 'https://www.example.com/auth/provider/callback'
//   },
//   function(token, tokenSecret, profile, done) {
//     User.findOrCreate(..., function(err, user) {
//       done(err, user);
//     });
//   }
// ));

// app.post('/users', (req, res) => {
//   const authHeader = req.header('Authorization');

//   if (!authHeader) {
//     return res.status(401).json({ error: 'Access token not provided' });
//   }

//   // Extract the access token (remove 'Bearer ' prefix if present)
//   const accessToken = authHeader.split(' ')[1];

//   // Now you have the access token and can use it for further processing
//   console.log('Access Token:', accessToken);

//   // Continue handling the request here
//   // res.redirect('http://localhost:3000');
// });

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
