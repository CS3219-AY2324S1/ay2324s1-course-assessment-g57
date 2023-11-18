// require('dotenv').config();
const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const serverless = require('serverless-http');

const app = express();
app.use(cors());
app.use(express.json());
// const port = 3002;

const verifyJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:
            'https://dev-r67hrnstb5x4ekjv.us.auth0.com/.well-known/jwks.json',
    }),
    audience: 'user-service-api',
    issuer: 'https://dev-r67hrnstb5x4ekjv.us.auth0.com/',
    algorithms: ['RS256'],
}).unless({ path: ['/questions'] });

// app.use(verifyJwt);

// if (process.env.ENV == 'DEV') {
//     const questionRouter = require('./controller/controller-local.js');
//     const api = process.env.LOCAL_DB_URL;
//     mongoose.connect(api, { useNewUrlParser: true, useUnifiedTopology: true });
//     const db = mongoose.connection;
//     db.on('error', console.error.bind(console, 'connection error:'));
//     db.once('open', () => console.log('Connected to MongoDB!'));

//     app.use(express.json());

//     app.use('/questions', questionRouter);
//     app.listen(port, () => {
//         console.log(`Server started on port ${port}.`);
//     });
// } else {
const prod_db = require('./controller/controller-prod.js');
app.get('/questions', prod_db.getQuestions);
app.get('/questions/:title', prod_db.getQuestionById);
app.post('/questions', prod_db.createQuestion);
app.put('/questions/:title', prod_db.updateQuestion);
app.delete('/questions/:title', prod_db.deleteQuestion);
app.get('/questions/complexity/:complexity', prod_db.getQuestionByComplexity);

module.exports.handler = serverless(app);
// }
