const dynamoose = require('dynamoose');
const { UserModel } = require('../models/user-dynamo-model');

// Get all users
const getUsers = async (req, res) => {
  await UserModel.scan()
    .exec()
    .then((users) => {
      console.log('Users:', users);
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error('Unable to scan the User table', err);
      console.error('Request:', req);
      res.status(500).json({ error: 'Unable to get users' });
    });
};

// Get a user by ID
const getUserById = async (req, res) => {
  await UserModel.get(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
      return user.json();
    })
    .catch((err) => {
      console.error('Unable to read user', err);
      console.error('Request:', req);
      res.status(500).json({ error: 'Unable to get user' });
    });
};

// Create a new user
const createUser = async (req, res) => {
  const { user_id, email } = req.body;
  let { username } = req.body;
  if (username == null || username === '') {
    // Set a default username if it's not provided
    username = 'defaultUsername';
  }

  const newUser = new UserModel({
    user_id,
    email,
    username,
  });

  await newUser
    .save()
    .then((user) => {
      console.log('User created:', user);
      res.status(201).json({ message: 'User created successfully' });
    })
    .catch((err) => {
      console.error('Unable to add user', err);
      console.error('Request:', req);
      res.status(500).json({ error: 'Unable to create user' });
    });
};

// Update an existing user
const updateUser = async (req, res) => {
  const { email, username } = req.body;

  await UserModel.get(req.params.id)
    .then((existingUser) => {
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      return existingUser.json();
    })
    .then(async () => {
      await UserModel.update(
        { user_id: req.params.id },
        { email, username }
      ).then((updatedUser) => {
        console.log('Updated user:', updatedUser);
        res.status(200).json({ message: 'User updated successfully' });
      });
    })
    .catch((err) => {
      console.error('Unable to update user', err);
      console.error('Request:', req);
      res.status(500).json({ error: 'Unable to update user' });
    });
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  await UserModel.delete(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'User deleted successfully' });
    })
    .catch((err) => {
      console.error('Unable to delete user', err);
      console.error('Request:', req);
      res.status(500).json({ error: 'Unable to delete user' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
