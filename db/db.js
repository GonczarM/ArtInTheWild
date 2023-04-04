const mongoose = require('mongoose');

const connectionString = process.env.MONGO_URI

mongoose.connect(connectionString);

const db = mongoose.connection;

db.on('connected', () => {
  console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`);
});

db.on('disconnected', () => {
  console.log('mongoose disconnected to ', connectionString);
});

db.on('error', (error) => {
  console.log('mongoose error ', error);
});
