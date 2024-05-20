import {Router} from "express";
import {postCreateValidation} from "../validations.js";
import {checkAuth, handleValidationErrors} from "../utils/index.js";
import {PostController} from "../controllers/index.js";

const router = new Router();

router.get('/tags', PostController.getLastTags);
router.get('/', PostController.getAll);
// router.get('/tags', PostController.getLastTags);
router.get('/:id', PostController.getOne);
router.post('/', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
router.delete('/:id', checkAuth, PostController.remove);
router.patch(
	'/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update,
);

export default router