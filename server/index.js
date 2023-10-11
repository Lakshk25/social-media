
const express = require('express');
const app = express();
const dotenv = require('dotenv')
const apiRoutes = require('./routes/authRouter');   // authentication routes
const postsRouter = require("./routes/postsRouter");  //posts routes
require('./dbConnect');   // function to connect database
dotenv.config('./.env');  // to hide secret keys
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());    // this middleware is used to parse only JSON data format

// Routes
app.use('/api', apiRoutes); // to handle authentication routes
app.use('/posts', postsRouter); // to handle posts routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});