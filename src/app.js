const express = require('express')
const connectDB = require('./config/database')
const validateSignUpData = require('./utils/validation')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const JsonWebToken = require('jsonwebtoken');
const authMiddleware = require('./utils/authMiddleware');

const app = express()
const User = require('./models/user');


// Register the JSON body parser middleware for "/" -> all route
app.use("/", express.json());
app.use("/", cookieParser())

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
    res.status(400).send("Error saving the user:" + err?.message)
  }
})

// Post login
app.post("/login", async (req, res) => {

  const { emailId: email, password: myPlaintextPassword } = req.body
  try {
    const user = await User.findOne({ emailId: email })

    if (!user) {
      res.status(404).send("Invalid Credentials")
      return
    }
    const { firstName, lastName, password: hash, emailId } = user

    // Load hash from your password DB.
    const isValidPassword = user.validatePassword(myPlaintextPassword)
    if (!isValidPassword) {
      return res.status(400).send("Invalid Credentials");
    }

    // offloads to user schema as helper function
    const token = await user.getJWT();
    
    res.cookie("token", token, {expires: new Date(Date.now()+ 3*3600000)})// expires in 3 hr
    res.send({ firstName, lastName, emailId })
  }
  catch (err) {
    res.status(400).send("Error login the user: " + err?.message)
  }
})

app.get("/profile", async (req, res) => {
  cookie = req.cookies

  try {
    const { token } = cookie
    if (!token) {
      throw new Error("invalid token")
    }
    const decodedMessage = await JsonWebToken.verify(token, "DEV@Tinder007$SecretKey");

    const user = await User.findOne({ _id: decodedMessage._id });

    if (!user) {
      throw new Error("user doesn't exist")
    }
    res.send(user)
  }
  catch (err) {
    res.status(401).send("Authorization Error: " + err?.message)
  }

})

// Post search another user by email
app.post("/searchUser", authMiddleware, async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });

    if (users.length === 0) {
      res.status(404).send("user not found")
    }

    res.send(users);
  }
  catch (err) {
    res.status(400).send("Something went wrong"+ err?.message);
  }
})

// Patch user by userId
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
    res.status(500).send("update failed: " + err?.message);
  }

})

// Feed API - GET /feed - get all the users from the database
app.get("/feed",  async (req, res) => {
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


