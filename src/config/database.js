const mongoose = require("mongoose")

const connectDB = async()=>{
  await mongoose.connect(
    "mongodb+srv://puneetvishnoi:01hT8jUhT5epV9Ee@cluster0.5vihgoz.mongodb.net/devtinder?retryWrites=true&w=majority&appName=Cluster0"
  )
}

module.exports = connectDB