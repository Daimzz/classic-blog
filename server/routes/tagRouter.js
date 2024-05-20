import {Router} from "express";

import {PostController} from "../controllers/index.js";

const router = new Router();

router.get('/', PostController.getLastTags);

export default router