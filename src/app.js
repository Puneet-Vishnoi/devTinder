const express = require('express')
const connectDB = require('./config/database')
const validateSignUpData = require('./utils/validation')
const bcrypt = require('bcrypt');
const app = express()
const User = require('./models/user')


// Register the JSON body parser middleware for "/" -> all route
app.use("/", express.json());

const saltRounds = 10;

app.post('/signup', validateSignUpData, async (req, res) => {

  const { firstName, lastName, emailId, password } = req.body
  const hashPassword = await bcrypt.hash(password, saltRounds)

  console.log(hashPassword)

  // creating a new instance of the user model and passing userObj
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: hashPassword,
  })

  try {
    // data is saved on to the database
    await user.save();
    res.send("User added succesfully")
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message)
  }
})

// Post login
app.post("/login", async (req, res) => {

  const { emailId: email, password: myPlaintextPassword } = req.body
  console.log(email, myPlaintextPassword)
  try {
    const user = await User.findOne({emailId: email})
    
    if(!user){
      res.status(404).send("email is not found")
      return
    }
    const {firstName, lastName, password: hash, emailId, skills, age, gender, photourl, about} = user
    
    // Load hash from your password DB.
    bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
   
      if (err) {
        console.error("Error comparing password hash:", err);
        return res.status(500).send("Something went wrong during login");
      }

      if (!result) {
        return res.status(400).send("Incorrect password");
      }

      return res.send({firstName, lastName, emailId, skills, about, photourl, age, gender})
    });
  }
  catch (err) {
    res.status(400).send("Error login the user: ", err?.message)
  }
})

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });

    if (users.length === 0) {
      res.status(404).send("user not found")
    }

    res.send(users);
  }
  catch (err) {
    res.status(400).send("Something went wrong");
  }
})

// Patch user by id
app.patch("/user/:userId", async (req, res) => {
  const id = req.params.userId;

  const data = req.body;

  const ALLOWED_UPDATES = [
    "photourl", "about", "gender", "age", "skills"
  ]

  const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))


  try {

    if (!isUpdateAllowed) {
      res.status(404).send("update query is not allowed")
      return
    }
    if (req.body.skills.length > 10) {
      res.status(404).send("atmost 10 skills is allowed")
      return
    }
    const updatedUser = await User.findByIdAndUpdate({ _id: id }, data, { new: true, runValidators: true })
    // Returns the updated document if new: true is specified, or the original document if new: false (default).
    // If no document is found with the specified id, it returns null.
    if (updatedUser === null) {
      res.status(404).send("user not updated")
    }
    res.send(updatedUser)
  }
  catch (err) {
    res.status(500).send("update failed: " + err.message);
  }

})

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({})
    // empty filter will get us all the documents from user collection

    return res.send(users)
  }
  catch (err) {
    res.status(400).send("Something went wrong");
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


