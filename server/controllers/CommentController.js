import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";


export const createComment = async (req, res) => {

	try {
		const { postId, comment } = req.body;
		if (!comment) {
			return res
				.status(500)
				.json({ message: "Комментарий не может быть пустым" });
		}
		const user = await User.findById(req.userId);

		const newComment = new Comment({
			comment,
			author: user.fullName,
			avatarUrl: user.avatarUrl,
		});
		await newComment.save();
		try {
			await Post.findByIdAndUpdate(postId, {
				$push: { comments: newComment._id },
			});
		} catch (e) {
			return res.status(500).json({
				message: "Не получилось добавить комментарий для поста",
			});
		}
		return res.status(200).json(newComment);
	} catch (e) {
		return res.status(500).json({ message: "Ошибка при создании комментария" });
	}
};

export const removeComment = async (req, res) => {
	try {
		const queryParams = req.params.id;
		const [postId, commentId] = queryParams.split("&");
		if (!commentId) {
			return res.status(404).json({
				message: `Комментарий не найден `,
			});
		}
		await Post.findByIdAndUpdate(postId, {
			$pull: { comments: commentId },
		});
		await Comment.findByIdAndDelete(commentId);
		return res.status(200).json({ message: "Комментарий был удален" });
	} catch (err) {
		return res
			.status(500)
			.json({ message: `Не получилось удалить комментарий` });
	}
};

export const getPostComments = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({message: "Пост не найден"});
		}
		const list = await Promise.all(
			post.comments.map((comment) => {
				return Comment.findById(comment._id);
			}),
		);
		return res.status(200).json(list);
	} catch (err) {
		return res
			.status(500)
			.json({message: "Не получилось получить комментарии поста"});
	}
};

export const getAllComments = async (req, res) => {
	try {
		const list = await Comment.find();
		return res.status(200).json(list);
	} catch (err) {
		return res
			.status(500)
			.json({message: "Не получилось получить комментарии"});
	}
}

export const removePostComments = async (req, res) => {
	const postId = req.params.id;

	try {
		// Find the post by ID
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ message: `Пост не найден: ${postId}` });
		}

		// Get the list of comment IDs associated with the post
		const commentIds = post.comments.map((comment) => comment._id);

		// Delete all comments associated with the post
		await Comment.deleteMany({ _id: { $in: commentIds } });

		return res.status(200).json({ message: "Все комментарии были удалены" });
	} catch (err) {
		return res.status(500).json({ message: "Не удалось удалить комментарии" });
	}
};

