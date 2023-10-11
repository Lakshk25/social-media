const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signupController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: 'All fields are required' });

        // find if email already present in database
        const oldUser = await User.findOne({ email });
        if (oldUser)
            return res.status(409).json({ message: 'User with this email already exists' });

        // hash password add salts in password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create method is used to create entry in database we can also use save method if entry already present in DB save method updats it otherwise it creates new entry
        const user = await User.create({
            email,
            password: hashedPassword,
        });
        return res.status(201).json({ user });
    } catch (error) {
        console.log(error);
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "All fields are required" })

        const user = await User.findOne({ email });
        // check is no user found
        if (!user)
            return res.status(404).json({ message: "No user found with this email address" });

        // decrypt password
        // check entered password with DB password
        const matched = await bcrypt.compare(password, user.password);
        if (!matched)
            return res.status(403).json({ message: "invalid Password" });

        // generate access token for login with payload as _id
        // we use token for security purpose when user login first time we provide access token to user so after it user dont need to authenticate every time 
        // we can check if user is authorized by access token
        const accessToken = generateAccessToken({
            _id: user._id,
        });
        // generate refresh token 
        const refreshToken = generateRefreshToken({
            _id: user._id,
        });
        return res.json({ accessToken, refreshToken });
    } catch (error) {
        console.log(error);
    }
};

// this api will check the refreshToken validity and generate a new access token
// we call this route from client side to genreate refresh token which after it genrerate access token
const refreshAccessTokenController = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required" });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_PRIVATE_KEY
        );

        const _id = decoded._id;
        const accessToken = generateAccessToken({ _id });

        return res.json(201).json({ accessToken });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid refresh token" })
    }
}

const generateAccessToken = (data) => {
    try {
        // access token expires in 10 min for security we genreate access token by refresh token before it expires
        // so if someone get access token it only works for 10 min and then it expires
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "10m",
        });
        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
    }
};

const generateRefreshToken = (data) => {
    try {
        // we genreate refresh token for long time because we can only use refresh token to genreate access token 
        // after token expires user need to login again
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
            expiresIn: "1y"
        });
        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    loginController,
    signupController,
    refreshAccessTokenController
}