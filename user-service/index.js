const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const dotenv = require('dotenv');
// const { Sequelize } = require('sequelize');
dotenv.config();

const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/', routes);

// Database connection
// const sequelize = new Sequelize(process.env.DB_URL);
// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connected to the database');
//     })
//     .catch((err) => {
//         console.error('Unable to connect to the database:', err);
//     });

app.listen(port, () => {
    console.log(`User service is running on port ${port}.`);
});
