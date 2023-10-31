const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');

const port = 3001;
const serverless = require('serverless-http');
const axios = require('axios');
const localDb = require('./controller/controller_local');
const prodDb = require('./controller/controller_prod');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
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
}).unless({ path: ['/users'] });

app.use(express.json());

// app.use(verifyJwt);
async function isAdmin(req, res, next) {
    try {
        const userInfoResponse = axios.request({
            method: 'GET',
            url: 'https://dev-r67hrnstb5x4ekjv.us.auth0.com/userinfo',
            headers: {
                Authorization: req.headers.authorization,
            },
        });

        var tokenOptions = {
            method: 'POST',
            url: `https://${process.env.DOMAIN}/oauth/token`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                audience: `https://${process.env.DOMAIN}/api/v2/`,
            }),
        };

        const tokenResponse = axios.request(tokenOptions);

        console.log('client_id', process.env.CLIENT_ID);

        const userInfo = (await userInfoResponse).data;
        const MGMT_API_ACCESS_TOKEN = (await tokenResponse).data?.access_token;
        console.log('tokenResponse', tokenResponse);

        console.log('User Info:', userInfo);
        console.log('MGMT_TOKEN', MGMT_API_ACCESS_TOKEN);
        const options = {
            method: 'GET',
            url: `https://dev-r67hrnstb5x4ekjv.us.auth0.com/api/v2/users/${encodeURIComponent(
                userInfo.sub
            )}/roles`,
            headers: { authorization: `Bearer ${MGMT_API_ACCESS_TOKEN}` },
        };

        const response = await axios.request(options);

        // Check if the user has the "Admin" role
        const isAdminRole = response.data.some((role) => role.name === 'Admin');
        console.log('isAdmin', isAdminRole);
        if (isAdminRole) {
            // User is an admin, continue with the request handling
            next();
        } else {
            // User is not an admin, return a 403 Forbidden response
            res.status(403).json({
                message: 'Permission denied. You are not an admin.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function isUser(access_token, idToVerify) {
    const userInfoResponse = axios.request({
        method: 'GET',
        url: 'https://dev-r67hrnstb5x4ekjv.us.auth0.com/userinfo',
        headers: {
            Authorization: access_token,
        },
    });

    const userTokenId = await userInfoResponse.data.sub;
    return decodeURIComponent(idToVerify) === userTokenId;
}

const db = process.env.ENV === 'DEV' ? localDb : prodDb;

app.post('/users', db.createUser);
app.get('/users', db.getUsers);
// app.get('/users', isAdmin, db.getUsers);
app.get('/users/:id', db.getUserById);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);
// app.delete(
//     '/users/:id',
//     (req, res, next) => {
//         if (isUser(req.headers.authorization, req.params.id)) {
//             next();
//         } else {
//             isAdmin(req, res, next);
//         }
//     },
//     db.deleteUser
// );

if (process.env.ENV === 'DEV') {
    app.listen(port, () => {
        console.log(`App running on port ${port}.`);
    });
} else {
    module.exports.handler = serverless(app);
}
