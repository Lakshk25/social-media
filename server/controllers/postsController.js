const getAllPostsController = async (req, res) => {
    // console.log(req._id);   // here we take id which is inserted by middleware route
    console.log('id print -> ', req._id);
    return res.send("These are all the posts");
};

module.exports = {
    getAllPostsController,
};