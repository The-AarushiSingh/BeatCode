const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    age: {
      type: Number,
      min: 0,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    problemsSolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    password:{
      type:String,
      required:true,
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);