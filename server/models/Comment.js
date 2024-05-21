import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
	{
		author: { type: "String", ref: "Post" },
		comment: { type: String, required: true },
		avatarUrl: { type: String },
	},

	{ timestamps: true },
);

CommentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 });
export default mongoose.model("Comment", CommentSchema);
