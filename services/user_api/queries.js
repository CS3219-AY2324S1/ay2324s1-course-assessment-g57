const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'CS3219',
  password: 'password',
  port: 5432,
})


const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY userId ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

const getUserById = (request, response) => {
const id = parseInt(request.params.id)

pool.query('SELECT * FROM users WHERE userId = $1', [id], (error, results) => {
    if (error) {
    throw error
    }
    response.status(200).json(results.rows)
})
}


const createUser = (request, response) => {
const { username, password, email, createdDateTime} = request.body

pool.query(
    'INSERT INTO users (username, password, email, createdDateTime) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, password, email, createdDateTime],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added!`);
})
}


const updateUser = (request, response) => {
const id = parseInt(request.params.id)
const { username, email } = request.body

pool.query(
    'UPDATE users SET username = $1, email = $2 WHERE userId = $3',
    [username, email, id],
    (error, results) => {
    if (error) {
        throw error
    }
    response.status(200).send(`User modified with ID: ${id}`)
    }
)
}


const deleteUser = (request, response) => {
const id = parseInt(request.params.id)

pool.query('DELETE FROM users WHERE userId = $1', [id], (error, results) => {
    if (error) {
    throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
})
}

module.exports = {
getUsers,
getUserById,
createUser,
updateUser,
deleteUser,
}

