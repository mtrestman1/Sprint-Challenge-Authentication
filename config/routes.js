const axios = require('axios');
const bcrypt = require('bcryptjs');


const { authenticate } = require('../auth/authenticate');

const db = require('../database/dbConfig')

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
 let user = req.body;
const hash = bcrypt.hashSync(user.password, 10)
user.password = hash;
db('users')
.insert(user)
.then(ids => {
  const id = ids[0]
  db('users')
  .where({id})
  .then(users => {
    res.status(201).json(users)
  })
})
.catch(error => {
  res.status(500).json(error)
})
}

function login(req, res) {
 
}



function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
