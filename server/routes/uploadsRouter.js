import {Router} from "express";
import {checkAuth} from "../utils/index.js";
import multer from "multer";
import fs from "fs";


const router = new Router();


const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		const avatarsPath = 'uploads/avatars';
		if (!fs.existsSync(avatarsPath)) {
			fs.mkdirSync(avatarsPath, { recursive: true });
		}
		cb(null, avatarsPath);
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const avatar = multer({ storage });

const storage2 = multer.diskStorage({
	destination: (_, __, cb) => {
		const uploadsPath = 'uploads';
		if (!fs.existsSync(uploadsPath)) {
			fs.mkdirSync(uploadsPath, { recursive: true });
		}
		cb(null, uploadsPath);
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage2 });


router.post('/', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});
router.post('/avatars', avatar.single('image'), (req, res) => {
	res.json({
		url: `/uploads/avatars/${req.file.originalname}`,
	});
});

export default router