//variables
const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
require('dotenv').config()
require('./db/db')
const PORT = process.env.PORT

//middleware
app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, 
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'dist')));

//controllers
const usersController = require('./controllers/users')
app.use('/api/users', usersController)
const muralsController = require('./controllers/murals')
app.use('/api/murals', muralsController)
const cityOfChicagoController = require('./controllers/cityOfChicago')
app.use('/api/cityOfChicago', cityOfChicagoController)
//catch all route
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//listener
app.listen(PORT, () => {
  console.log('listening on port: ', PORT);
});