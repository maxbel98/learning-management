const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
  groupName: {
    type: String,
    required: false,
  },
  photo: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
    default: false,
  },
  status: {
    type: String,
    required: false,
  },
  accessToken: {
    type: String,
    required: false,
  },
  refreshToken: {
    type: String,
    required: false,
  },
  regDate: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

UserSchema.statics.getByEmail = async function(email) {
  return this.find({ email });
};

UserSchema.statics.getByUserName = async function(nickname) {
  return this.find({ nickname });
};

module.exports = model('User', UserSchema);
