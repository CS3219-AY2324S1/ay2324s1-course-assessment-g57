const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand  } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

// Get all users
const getUsers = async (req, res) => {
  const params = {
    TableName: process.env.USERS_TABLE,
  };

  try {
    const data = await docClient.send(new ScanCommand(params));
    res.status(200).json(data.Items);
  } catch (err) {
    console.error('Unable to scan the table', err);
    res.status(500).json({ error: 'Unable to get users' });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      user_id: req.params.id,
    },
  };
  console.log("Get user by id: " + req.params.id);
  console.log("TableName: " + process.env.USERS_TABLE);

  try {
    const data = await docClient.send(new GetCommand(params));
    res.status(200).json(data.Item);
  } catch (err) {
    console.error('Unable to read item', err);
    res.status(500).json({ error: 'Unable to get user' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { user_id, email, username } = req.body;

  const params = {
    TableName: process.env.USERS_TABLE,
    Item: {
      user_id: user_id,
      email: email,
      username: username,
    },
  };

  try {
    await docClient.send(new PutCommand(params));
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Unable to add item', err);
    res.status(500).json({ error: 'Unable to create user' });
  }
};

// Update an existing user
const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { email, username } = req.body;

  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      user_id: user_id,
    },
    UpdateExpression: 'SET email = :email, username = :username',
    ExpressionAttributeValues: {
      ':email': email ,
      ':username': username,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const data = await docClient.send(new UpdateCommand(params));
    res.status(200).json(data.Attributes);
  } catch (err) {
    console.error('Unable to update item', err);
    res.status(500).json({ error: 'Unable to update user' });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      user_id: { S: req.params.id },
    },
  };

  try {
    await docClient.send(new DeleteCommand(params));
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Unable to delete item', err);
    res.status(500).json({ error: 'Unable to delete user' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
