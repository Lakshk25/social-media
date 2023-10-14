const {success, failure} = require('../utils/responseWrapper')
const getAllPostsController = async (req, res) => {
    // console.log(req._id);   // here we take id which is inserted by middleware route
    try{
    console.log('id print -> ', req._id);
    return res.send(success(201,'this are all the posts'));
    }catch(error){
        res.send(failure(404,error));
        console.log(error);
    }
};

module.exports = {
    getAllPostsController,
};