// this route opens when valid json token is used
const router = require("express").Router();
const postsController = require("../controllers/postsController");
const requireUser = require("../middlewares/tokenValidator");   // middleware to check validity of token

router.get("/all", requireUser, postsController.getAllPostsController);

module.exports = router;