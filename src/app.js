const express = require('express')
const connectDB = require('./config/database')
const app = express()
const User = require('./models/user')

app.post('/signup', async (req, res) => {
  const userObj = {
    firstName: "Puneet",
    lastName: "Vishnoi",
    emailId: "akshay@saini.com",
    password: "akshay@123"
  }

  // creating a new instance of the user model and passing userObj
  const user = new User(userObj)

  try {
    // data is saved on to the database
    await user.save();
    res.send("User added succesfully")
  }catch(err){
    res.status(400).send("Error saving the user:"+ err.message)
  }

})

connectDB()
  .then(() => {
    console.log("Database connection established...")
    app.listen(3000, () => {
      console.log("server is succesfully listening on port 3000...")
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!!")
  })


