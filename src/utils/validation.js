const validator = require('validator')

const validateSignUpData = (req, res, next) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
      throw new Error("Name is not valid!")
    }
    else if (firstName.length < 4 || firstName.length > 50) {
      throw new Error("First Name should be 4 to 50 characters")
    }
    if (!validator.isEmail(emailId)) {
      throw new Error("please enter a valid email")
    }
    next();
    // data is saved on to the database
  } catch (err) {
    res.status(400).send("Error in request body of the user:" + err.message)
  }

}

module.exports = validateSignUpData