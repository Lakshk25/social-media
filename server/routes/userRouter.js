const router = require('express').Router();
const requireUser = require('../middlewares/tokenValidator');
const UserController = require('../controllers/userController');

router.post('/follow', requireUser, UserController.followOrUnfollowUserController);
router.get('/getPostsOfFollowing', requireUser, UserController.getPostsOfFollowing);
router.get('/getMyPosts', requireUser, UserController.getMyPostsController);
router.get('/getUserPosts', requireUser, UserController.getUserPostsController);
router.delete('/', requireUser, UserController.deleteMyProfileController);
router.get('/getMyInfo', requireUser, UserController.getMyInfoController);

router.put('/', requireUser, UserController.updateUserProfileController);
router.post('/getUserProfile', requireUser, UserController.getUserProfileController);

module.exports = router;