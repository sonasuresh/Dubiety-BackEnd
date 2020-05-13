const router = require('express').Router()

const postController = require('../controller/postController.js')
const middleware = require('../middleware/tokenValidation')


router.post('/replypost', middleware.isTokenPresent, postController.replyPost)
router.get('/details/:id', middleware.isTokenPresent, postController.getPostDetails)
router.post('/', middleware.isTokenPresent, postController.addPost);
router.get('/replypost/:quesId', middleware.isTokenPresent, postController.getReplyPostForQuestions);
router.get('/:name', middleware.isTokenPresent, postController.getPostBasedOnUser);
router.get('/', middleware.isTokenPresent, postController.getAllPost);
router.get('/basedontags/:tag', middleware.isTokenPresent, postController.getAllPostBasedOnTags);
router.delete('/:id', middleware.isTokenPresent, postController.deletePost);
router.put('/', middleware.isTokenPresent, postController.vote);

router.post('/comment', middleware.isTokenPresent, postController.addComment);
//router.post('/comment', middleware.isTokenPresent, postController.addComment);
// router.delete('/comment', postController.deleteComment);
// router.put('/comment', middleware.isTokenPresent, postController.updateComment);
// router.post('/replycomment', middleware.isTokenPresent, postController.replyComment);

// router.get('/viewlikes/:id', middleware.isTokenPresent, postController.viewLikes);
// router.post('/', middleware.isTokenPresent, postController.postupload, postController.addPost);
// router.get('/download/:file', postController.postImageDownload)
// router.get('/:name', middleware.isTokenPresent, postController.getPostsBasedOnUser);
// router.get('/', middleware.isTokenPresent, postController.getPosts);
// router.delete('/:id', middleware.isTokenPresent, postController.deletePosts);
// router.put('/like', middleware.isTokenPresent, postController.likePost);
// router.put('/', middleware.isTokenPresent, postController.updatePosts);



module.exports = router