const mongoose = require('mongoose');
const SALT_ROUNDS = 6;
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	username: {
    type: String, 
    required: true,
    unique: true,
    trim: true,
  },
	password: {
    type: String,
    trim: true,
    minLength: 3,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret){
      delete ret.password;
      return ret
    }
  }
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  return next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;