const mongoose = require('mongoose');
const playlist = require('./playlist');

const options = {
  timestamps: true,
  id: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, userDocToReturn) => {
      delete userDocToReturn.password;
      return userDocToReturn;
    }
  }
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // playlist: {
  //   type: [playlistSchema]
  // }
}, options);

module.exports = mongoose.model('User', userSchema);
