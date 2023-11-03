const User = require('../models/User');
const Post = require('../models/Post');
const { success, failure } = require('../utils/responseWrapper');
const cloudinary = require('cloudinary').v2;
const { mapPostOutput } = require('../utils/Utils')

const followOrUnfollowUserController = async (req, res) => {
    try {
        const { personId } = req.body;
        const currUserId = req._id;
        if (personId === currUserId)
            return res.send(failure(409, "Users cannot follow themselves"))

        const person = await User.findById(personId);
        const currUser = await User.findById(currUserId);

        if (!person)
            return res.send(failure(404, 'User not found'));

        // if already followed
        if (person.followers.includes(currUserId)) {
            const personFollowers = person.followers.indexOf(currUser);
            const currUserFollowing = person.following.indexOf(personId);

            person.followers.splice(personFollowers, 1);
            currUser.following.splice(currUserFollowing, 1);
        }
        else {
            person.followers.push(currUser);
            currUser.following.push(personId);
        }
        await person.save();
        await currUser.save();

        return res.send(success(200, { user: person }));
    } catch (error) {
        return res.send(failure(500, { error }));
    }
}

const getPostsOfFollowing = async (req, res) => {
    try {
        const currUserId = req._id;
        const currUser = await User.findById(currUserId).populate('following');
        // console.log(currUser);

        const fullPosts = await Post.find({
            owner: {
                '$in': currUser.following
            }
        }).populate('owner', '-password'); // Exclude 'password' field
        // console.log(fullPosts);

        const posts = await Promise.all(fullPosts.map(async (item) => await mapPostOutput(item, req._id)).reverse());
        // console.log(posts);

        const followingIds = currUser.following.map((item) => item._id);
        followingIds.push(req._id);

        const suggestions = await User.find({
            _id: {
                $nin: followingIds,
            }
        }).select('-password');
        return res.send(success(200, {...currUser._doc, suggestions, posts}));
    } catch (error) {
        return res.send(failure(501, error.message));
    }
};

const getMyPostsController = async (req, res) => {
    try {
        const user = req._id;
        const posts = await Post.find({
            owner: user
        }).populate('likes');
        return res.send(success(200, { posts }));
    } catch (error) {
        return res.send(failure(501, { error }));
    }
}

const getUserPostsController = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user)
            return res.send(failure(404, 'No user found'));

        const posts = await Post.find({
            owner: userId
        }).populate({
            path: 'likes',
            model: 'user', // Replace 'user' with the actual model name for users
            options: { // This will handle empty 'likes' array gracefully
                errorHandling: 'null', // Return null if 'likes' is empty
            },
        });
        return res.send(success(200, { posts }));
    } catch (error) {
        return res.send(failure(500, error.message));
    }
}
const deleteMyProfileController = async (req, res) => {
    try {
        const currUserId = req._id;
        const currUser = await User.findById(currUserId);

        if (!currUser)
            return res.send(failure(404, 'No user found'))

        // delete all posts
        await Post.deleteMany({
            owner: currUserId,
        })

        // remove curr user from user followers lists 
        currUser.followers.forEach(async (followerId) => {
            const follower = await User.findById(followerId);
            const index = follower.following.indexOf(currUser);
            follower.following.splice(index, 1);
            await follower.save();
        })

        // remove users from curr user following
        currUser.following.forEach(async (followingId) => {
            const following = await User.findById(followingId);
            const index = following.followers.indexOf(currUser);
            following.followers.splice(index, 1);
            await following.save();
        })

        // remove all liked posts of currUser
        const allPosts = await Post.find();
        allPosts.forEach(async (post) => {
            const index = post.likes.indexOf(currUserId);
            post.likes.splice(index, 1);
            await post.save();
        })

        // delete user
        await currUser.deleteOne();

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
        });

        return res.send(success(201, "Your account deleted successfully"));
    } catch (error) {
        console.log(error);
        return res.send(failure(500, error.message));
    }
}

const getMyInfoController = async (req, res) => {
    try {
        const user = await User.findById(req._id);
        return res.send(success(200, { user }))
    } catch (error) {
        return res.send(failure(500, error.message ));
    }
}

const updateUserProfileController = async (req, res) => {
    try {
        const { name, bio, userImg } = req.body;
        const user = await User.findById(req._id);

        if (name) {
            user.name = name;
        }

        if (bio) {
            user.bio = bio;
        }

        if (userImg) {
            const cloudImg = await cloudinary.uploader.upload(userImg, {
                folder: 'profileImg'
            });
            user.avatar = {
                url: cloudImg.secure_url,
                publicId: cloudImg.public_id
            }
        }
        await user.save();
        return res.send(success(200, { user }));
    } catch (error) {
        return res.send(failure(500, error.message))
    }
}

const getUserProfileController = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).populate({
            path: 'posts',
            populate: {
                path: 'owner'
            }
        })
        const fullPosts = user.posts;
        // Use Promise.all to await the resolution of mapPostOutput for each post
        const posts = await Promise.all(fullPosts.map(async (item) => {
            return await mapPostOutput(item, req._id);
        }));
        // console.log(posts);
        return res.send(success(200, { ...user._doc, posts }))
    } catch (error) {
        return res.send(failure(500, error.message ));
    }
}
module.exports = {
    followOrUnfollowUserController,
    getPostsOfFollowing,
    getMyPostsController,
    getUserPostsController,
    deleteMyProfileController,
    getMyInfoController,
    updateUserProfileController,
    getUserProfileController,
}

