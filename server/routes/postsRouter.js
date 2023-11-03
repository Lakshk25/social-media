// this route opens when valid json token is used
const router = require("express").Router();
const postsController = require("../controllers/postsController");
const requireUser = require("../middlewares/tokenValidator");   // middleware to check validity of token

router.post("/", requireUser, postsController.createPostController);
router.post("/like", requireUser, postsController.likeAndUnlikePost);
router.put("/", requireUser, postsController.updatePostController);
router.delete("/", requireUser, postsController.deletePostController);

module.exports = router;