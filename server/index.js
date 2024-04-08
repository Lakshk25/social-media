
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const apiRoutes = require('./routes/authRouter');   // authentication routes
const postsRouter = require("./routes/postsRouter");  //posts routes
const UserRouter = require("./routes/userRouter");  //User routes
const cloudinary = require('cloudinary').v2;
// require('./dbConnect');   // function to connect database
dotenv.config('');  // to hide secret keys
const PORT = process.env.PORT || 3000;

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}))
// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(express.json({ limit: '10mb' }));    // this middleware is used to parse only JSON data format
app.use(cookieParser());


// Routes
app.use('/api', apiRoutes); // to handle authentication routes
app.use('/posts', postsRouter); // to handle posts routes
app.use('/user', UserRouter); // to handle posts routes

app.post('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
          