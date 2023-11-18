const { DataTypes } = require('sequelize');
// const { sequelize } = require('./db');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

dbUrl = process.env.DB_URL;
const sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    define: {
        underscored: true, // Use underscores instead of camelCase for column names
    },
});

const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
testDbConnection();

const User = sequelize.define(
    'User',
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notNull: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
    },
    {
        hooks: {
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSaltSync(10);
                user.password = await bcrypt.hashSync(user.password, salt);
            },
        },
    }
);
// User.sync({ force: true }).then(() => {
//     console.log('User Model synced');
// });

User.sync().then(() => {
    console.log('User Model synced');
});

module.exports = User;
// export default User;
