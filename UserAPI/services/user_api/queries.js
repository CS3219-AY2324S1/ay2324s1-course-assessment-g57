const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();

var bcrypt = require('bcryptjs');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

const getUsers = (request, response) => {
  pool.query('SELECT userID, username, email, createdDateTime FROM users ORDER BY userId ASC', (error, results) => {
    if (error) {
      console.error(error); // Log the error for debugging
      response.status(500).json({ error: 'Internal server error' }); // Send a 500 Internal Server Error response
    } else {
      response.status(200).json(results.rows);
    }
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT userID, username, email, createdDateTime FROM users WHERE userId = $1', [id], (error, results) => {
    if (error) {
      console.error(error); // Log the error for debugging
      response.status(500).json({ error: 'Internal server error' }); // Send a 500 Internal Server Error response
    } else {
      if (results.rows.length === 0) {
        response.status(404).json({ error: 'User not found' }); // Send a 404 Not Found response if no user is found
      } else {
        response.status(200).json(results.rows);
      }
    }
  });
};


const createUser = (request, response) => {
  const { username, password, email} = request.body;

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);

  pool.query(
    'INSERT INTO users (username, password, email, createdDateTime) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, hash, email, getDateTime()],
    (error, results) => {
      if (error) {
        console.error(error); // Log the error for debugging
        response.status(500).json({ error: 'Internal server error' }); // Send a 500 Internal Server Error response
      } else {
        response.status(201).send(`User added!`);
      }
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { username, email } = request.body;

  pool.query(
    'UPDATE users SET username = $1, email = $2 WHERE userId = $3',
    [username, email, id],
    (error, results) => {
      if (error) {
        console.error(error); // Log the error for debugging
        response.status(500).json({ error: 'Internal server error' }); // Send a 500 Internal Server Error response
      } else {
        if (results.rowCount === 0) {
          response.status(404).json({ error: 'User not found' }); // Send a 404 Not Found response if no user is found to update
        } else {
          response.status(200).send(`User modified with ID: ${id}`);
        }
      }
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE userId = $1', [id], (error, results) => {
    if (error) {
      console.error(error); // Log the error for debugging
      response.status(500).json({ error: 'Internal server error' }); // Send a 500 Internal Server Error response
    } else {
      if (results.rowCount === 0) {
        response.status(404).json({ error: 'User not found' }); // Send a 404 Not Found response if no user is found to delete
      } else {
        response.status(200).send(`User deleted with ID: ${id}`);
      }
    }
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};


function getDateTime() {
  var now     = new Date(); 
  var year    = now.getFullYear();
  var month   = now.getMonth()+1; 
  var day     = now.getDate();
  var hour    = now.getHours();
  var minute  = now.getMinutes();
  var second  = now.getSeconds(); 
  if(month.toString().length == 1) {
       month = '0'+month;
  }
  if(day.toString().length == 1) {
       day = '0'+day;
  }   
  if(hour.toString().length == 1) {
       hour = '0'+hour;
  }
  if(minute.toString().length == 1) {
       minute = '0'+minute;
  }
  if(second.toString().length == 1) {
       second = '0'+second;
  }   
  var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
   return dateTime;
}