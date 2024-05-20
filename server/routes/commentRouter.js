import {Router} from "express";
import {checkAuth} from "../utils/index.js";
import {CommentController} from "../controllers/index.js";


const router = new Router();

router.post('/:id', checkAuth, CommentController.createComment);
// router.get('/posts/comments/:id',  CommentController.getPostComments);
// router.delete('/posts/comments/:id', checkAuth, CommentController.removeComment);
router.get('/', CommentController.getAllComments);
router.delete('/:id', CommentController.removePostComments);

export default router