const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName : {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 15,
  },
  lastName:{
    type: String
  },
  emailId:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password:{
    type: String,
    required: true
  },
  age:{
    type: Number,
    min:18,
  },
  gender: {
    type: String,
    validate : (value)=>{
      if ( !["male", "female", "others"].includes(value)){
        throw new Error ("Gender Data is not valid");
      }
    }
    // validate function will run only when new document is created 
    // for updation we have to explicitly call this validation function
  },
  photourl:{
    type: String,
    default: "https://static.vecteezy.com/system/resources/previews/045/944/199/large_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg",
  },
  about :{
    type: String,
    default : "This is a default about of the user!"
  },
  skills: {
    type: [String],
  },
},{
  timestamps: true
})


const User =  mongoose.model("User", userSchema)

module.exports = User; 