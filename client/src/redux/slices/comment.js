import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
	comments: [],
	allComments:[],
	isLoading: false,
};

export const createComment = createAsyncThunk(
	"comment/createComment",
	async ({ postId, comment }) => {
		try {
			const { data } = await axios.post(`/comments/${postId}`, {
				postId,
				comment,
			});
			return data;
		} catch (e) {
			console.log(e);
		}
	},
);

export const getPostComments = createAsyncThunk(
	"comment/getPostComments",
	async (postId) => {
		try {
			const { data } = await axios.get(`/posts/comments/${postId}`);
			return data;
		} catch (e) {
			console.log(e);
		}
	},
);

export const removeComment = createAsyncThunk(
	"comment/removeComment",
	async ({ postId, commentId } ) => {
		try {
			const { data } = await axios.delete(
				`/posts/comments/${postId}&${commentId}`,
			);
			return data;
		} catch (e) {
			console.log(e);
		}
	},
);

export const getAllComments = createAsyncThunk(
	"comment/getAllComments",
	async () => {
		try {
			const { data } = await axios.get("/comments");
			return data;
		} catch (e) {
			console.log(e);
		}
	}
)
export const deletePostComments = createAsyncThunk(
	"comment/deletePostComments",
	async (postId) => {
		try {
			const { data } = await axios.delete(`/comments/${postId}`);
			return data;
		} catch (e) {
			console.log(e);
			throw e; // Rethrow the error to propagate it to the rejected action
		}
	}
);

export const commentSlice = createSlice({
	name: "comment",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(createComment.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createComment.fulfilled, (state, action) => {
				state.isLoading = false;
				state.comments.push(action.payload);
			})
			.addCase(createComment.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(getPostComments.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getPostComments.fulfilled, (state, action) => {
				state.isLoading = false;
				state.comments = action.payload;
			})
			.addCase(getPostComments.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(removeComment.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(removeComment.fulfilled, (state, action) => {
				state.isLoading = false;
				state.comments = state.comments.filter(
					(comment) => comment?._id !== action.payload?._id,
				);
			})
			.addCase(removeComment.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(getAllComments.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllComments.fulfilled, (state, action) => {
				state.isLoading = false;
				state.allComments = action.payload;
			})
			.addCase(getAllComments.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(deletePostComments.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deletePostComments.fulfilled, (state, action) => {
				state.isLoading = false;
				// Clear all comments since they are associated with the deleted post
				state.comments = [];
			})
			.addCase(deletePostComments.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export default commentSlice.reducer;
