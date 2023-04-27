//variables
const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
require('dotenv').config()
require('./config/db')
const usersController = require('./controllers/users')
const muralsController = require('./controllers/murals')
const PORT = process.env.PORT

//middleware
app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(require('./config/checkToken'));

//controllers
app.use('/api/users', usersController)
app.use('/api/murals', muralsController)
//catch all route
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

//listener
app.listen(PORT, () => {
  console.log('listening on port: ', PORT);
});