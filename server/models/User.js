const mongoose = require('mongoose');
const { format } = require('date-fns-tz'); // Import date-fns-tz for time zone formatting

// Function to get the current date and time in IST
const getCurrentISTDate = () => {
  const timeZone = 'Asia/Kolkata';
  const istDate = format(new Date(), 'dd-MM-yyyy HH:mm:ss', { timeZone });
  return istDate;
};

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    }
  ],
  date: {
    type: String, // Store the date as a string in IST format
    default: getCurrentISTDate(),
  },
});

module.exports = mongoose.model('data', userSchema);
