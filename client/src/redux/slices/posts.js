import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
	posts: {
		items: [],
		status: "loading"
	},
	tags: {
		items: [],
		status: "loading"
	}
}

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
	const {data} = await axios.get('/posts')
	return data
})
export const removePost = createAsyncThunk("posts/removePost", async (id) => {
	const {data} = await axios.delete(`/posts/${id}`)
	return data
})
export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
	const {data} = await axios.get('/tags')
	return data
})


const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPosts.pending, (state) => {
				state.posts.items = []
				state.posts.status = "loading"
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.posts.status = "loaded"
				state.posts.items = action.payload
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.posts.items = []
				state.posts.status = "error"
			})
			.addCase(fetchTags.pending, (state) => {
				state.tags.items = []
				state.tags.status = "loading"
			})
			.addCase(fetchTags.fulfilled, (state, action) => {
				const tags = action.payload.map((obj) => obj.trim())
				state.tags.status = "loaded"
				state.tags.items = tags
			})
			.addCase(fetchTags.rejected, (state, action) => {
				state.tags.items = []
				state.tags.status = "error"
			})
			.addCase(removePost.pending, (state, action) => {
				state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg)
			})
	}

})

export default postsSlice.reducer