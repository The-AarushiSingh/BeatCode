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

/*
module.exports = mongoose.model('User', userSchema);

does two things in a Node.js application using Mongoose:

Creates a Mongoose model

mongoose.model('User', userSchema)
'User' is the model name.
userSchema defines the structure of user documents.
Mongoose creates a model class that you can use to interact with the MongoDB collection.

Exports the model

module.exports = ...
Makes the model available to other files.
You can import it elsewhere using:
const User = require('./models/User');
Example
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String
});

module.exports = mongoose.model('User', userSchema);

Then in another file:

const User = require('./User');

const user = new User({
  name: 'John',
  email: 'john@example.com'
});

user.save();
Collection name

If the model name is 'User', Mongoose automatically looks for a collection named users (lowercase and pluralized) in MongoDB unless you explicitly specify a collection name in the schema options.

So this line effectively means:

"Create a Mongoose model called User based on userSchema and export it so other files can use it to read and write user documents in MongoDB."
*/