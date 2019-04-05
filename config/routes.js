const axios = require('axios');
const bcrypt = require('bcryptjs');



const { authenticate, generateToken } = require('../auth/authenticate');

const db = require('../database/dbConfig')

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login, generateToken);
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
  let { username, password } = req.body;
  console.log(username)
  db('users')
  .where({username})
  .first()
  .then(user => {
    console.log(user)
   if (user && bcrypt.compareSync(password, user.password)) {
     const token = generateToken(user)
 
     res.status(200).json({
       message: `Hi ${user.username}!`,
       token,
       
     });
     
   } else {
     res.status(401).json({ message: 'Invalid Credentials' });
   }
 })
  .catch(error => {
    res.status(500).json(error)
  })
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
