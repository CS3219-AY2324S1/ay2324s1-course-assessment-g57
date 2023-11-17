const express = require('express');
const router = express.Router();
const User = require('./userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { secretKey } = require('./config'); // Replace with your secret key
secretKey = 'secretKey'; // replace with your secret key

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('username', username);
        console.log('email', email);
        console.log('password', password);

        console.log('User', User);
        const newUser = await User.create({ username, email, password });
        res.status(201).json({
            message: `User ${newUser.username} created successfully`,
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'User already exists' });
        } else {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
});

// Authenticate a user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        // Password is valid, perform authentication logic
        // ...
        const token = jwt.sign({ username: user.username }, secretKey, {
            expiresIn: '1h', // Set the expiration time of the token
        });
        const responseData = {
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email,
            },
            token,
        };
        res.status(200).json(responseData);
        // res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['username', 'email'] });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({
            where: { username },
            attributes: ['username', 'email'],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { email } = req.body;
        const user = await User.findOne({ where: { username: username } });
        // user.username = username;
        // user.email = email;
        user.set({
            email: email,
        });
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        await User.destroy({
            where: { username: username },
        });
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
