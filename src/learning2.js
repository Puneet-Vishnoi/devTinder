const express = require('express')
const connectDB = require('./config/database')
const app = express()
const User = require('./models/user')


// express.json() returns the JSON body parser a middleware function. which reads the json from req and convert it to javascript object and attach it to request


// Register the JSON body parser middleware for "/post" signup route
app.post("/signup",express.json());


app.post('/signup', async (req, res) => {
  console.log(req)

  // await express.json() This does not parse the request body. Why?


  console.log(req.body)
  // const userObj = {
  //   firstName: "Puneet",
  //   lastName: "Vishnoi",
  //   emailId: "akshay@saini.com",
  //   password: "akshay@123"
  // }

  // creating a new instance of the user model and passing userObj
  const user = new User(req.body)

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


