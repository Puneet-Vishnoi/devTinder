const JsonWebToken= require('jsonwebtoken');
const mongoose = require('mongoose')
const validator = require('validator'); 
const bcrypt = require('bcrypt')

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
    trim: true,
    // validate(value){
    //   if(!validator.isEmail(value)){
    //     throw new Error("Invalid email address:" + value);
    //   }
    // },
  },
  password:{
    type: String,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Enter a Strong Password:"+value);
      }
    }
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
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("Invalid photoUrl address:" + value);
      }
    },
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
});

userSchema.methods.validatePassword = async function(myPlaintextPassword){
  const user = this;

  const { password: hash} = user

 // Load hash from your password DB.
 const isValidPassword = await bcrypt.compare(myPlaintextPassword, hash);

 return isValidPassword
}

userSchema.methods.getJWT = async function(){
  const user = this;

  const token = await JsonWebToken.sign({ _id: user._id }, "DEV@Tinder007$SecretKey", { expiresIn: '3d' });

  return token;
}

const User =  mongoose.model("User", userSchema)

module.exports = User; 