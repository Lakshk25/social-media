const jwt = require('jsonwebtoken')
const {failure} = require('../utils/responseWrapper')

module.exports = async (req, res, next) => {
    // we check all three for more flexibility and to catch specific error otherwise we can only use req.headers.authorization
    // this check that authorization is present it contains bearer and token and autorization starts with Bearer
    const token = req.headers || req.headers.authorization || req.headers.authorization.startsWith("Bearer")
    // console.log(req.headers.authorization);
    if(!token)
        return res.send(failure(401 ,"Access Denied"));

    try{
    // authorization is a HTTP header file which is an String in which first (0) word specifies type of authentication scheme in our case it is (bearer) but other also can be use like (Basic) and more for more security and Oauth bearer scheme is used and second (1) specifies token
    const accessToken = req.headers.authorization.split(" ")[1];    // extracting token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY); 
    // id is send as response to router
    req._id = decoded._id;  // here we insert id taken from jwt and we insert this in our route response
    next();
    }catch(error){
        console.log(error);
        return res.send(failure(401 ,"Invalid access key"));
    }
}