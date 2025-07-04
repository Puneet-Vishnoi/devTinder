const express = require('express')
const connectDB = require('./config/database')
const app = express()
const User = require('./models/user')

// Register the JSON body parser middleware for "/" -> all route
app.use("/", express.json());

app.post('/signup', async (req, res) => {
  // creating a new instance of the user model and passing userObj
  const user = new User(req.body)

  try {
    // data is saved on to the database
    await user.save();
    res.send("User added succesfully")
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message)
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
app.patch("/user", async (req, res) => {
  const id = req.body.id;

  const data = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate({ _id: id }, data, { new: true })
    // Returns the updated document if new: true is specified, or the original document if new: false (default).
    // If no document is found with the specified id, it returns null.
    if (updatedUser === null){
        res.status(404).send("user not updated")
    }
    res.send(updatedUser)
  }
  catch (err) {
    res.status(500).send("Something went wrong");
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


