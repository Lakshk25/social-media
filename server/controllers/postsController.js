const User = require('../models/User')
const Post = require('../models/Post')
const { success, failure } = require('../utils/responseWrapper')
const cloudinary = require('cloudinary').v2
const { mapPostOutput } = require('../utils/Utils');

const createPostController = async (req, res) => {
    try {
        const { caption, postImg } = req.body;

        if (!postImg)
            return res.send(failure(400, 'Caption and postImg are required'));

        const cloudImg = await cloudinary.uploader.upload(postImg, {
            folder: 'postImg'
        })

        const owner = req._id;
        const user = await User.findById(owner);
        // console.log(user);
        const post = await Post.create({
            owner,
            image: {
                publicId: cloudImg.public_id,
                url: cloudImg.url
            },
        });

        if(caption)
            post.caption = caption;
        
        user.posts.push(post._id);
        await user.save();

        return res.send(success(201, { post }));
    } catch (error) {
        console.log(error);
        return res.send(failure(500, error.message));
    }
}

const likeAndUnlikePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const currUserId = req._id;
        // console.log(postId);
        const post = await Post.findById(postId);
        if (!post)
            return res.send(failure(404, "Post not found"));

        if (post.likes.includes(currUserId)) {
            const index = post.likes.indexOf(currUserId);
            post.likes.splice(index, 1);
        } else {
            post.likes.push(currUserId);
        }
        await post.save();

        return res.send(success(200, { post: await mapPostOutput(post, req._id) }));

    } catch (error) {
        return res.send(failure(500, error.message));
    }
}

const updatePostController = async (req, res) => {
    try {
        const { postId, caption } = req.body;
        const currUserId = req._id;

        const post = await Post.findById(postId);
        if (!post)
            return res.send(failure(404, "Post not found"));

        if (post.owner.toString() !== currUserId)
            return res.send(failure(403, "Only owner can update post"));

        if (caption)
            post.caption = caption;

        await post.save();
        return res.send(success(200, { post }));

    } catch (error) {
        return res.send(failure(500, error.message));
    }
};

const deletePostController = async (req, res) => {
    try {
        const { postId } = req.body;
        const currUserId = req._id;

        const currUser = await User.findById(currUserId);
        const post = await Post.findById(postId);

        if (!post) {
            return res.send(failure(404, "Post not found"));
        }

        if (post.owner.toString() !== currUserId) {
            return res.send(failure(403, "Only the owner can delete the post"));
        }

        const index = currUser.posts.indexOf(postId);
        currUser.posts.splice(index, 1);
        await post.deleteOne();
        await currUser.save();
        return res.send(success(202, "Post deleted successfully"));
    } catch (error) {
        return res.send(failure(500, error.message));
    }
}


module.exports = {
    createPostController,
    likeAndUnlikePost,
    updatePostController,
    deletePostController,
};
