import {Router} from "express";
import {checkAuth, } from "../utils/index.js";
import {CommentController, } from "../controllers/index.js";

const router = new Router();

router.get('/:id',  CommentController.getPostComments);
router.delete('/:id', checkAuth, CommentController.removeComment);

export default router