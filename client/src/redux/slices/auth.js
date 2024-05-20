import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
	data: null,
	status: "loading"
}

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
	const {data} = await axios.post("/auth/login", params)
	return data
})
export const fetchRegister = createAsyncThunk("auth/fetchRegister", async (params) => {
	const {data} = await axios.post("/auth/register", params)
	return data
})

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
	const {data} = await axios.get("/auth/me")
	return data
})

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: (state) => {
			state.data = null
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAuth.pending, (state) => {
				state.data = null
				state.status = "loading"
			})
			.addCase(fetchAuth.fulfilled, (state, action) => {
				state.data = action.payload
				state.status = "loaded"
			})
			.addCase(fetchAuth.rejected, (state) => {
				state.data = null
				state.status = "error"
			})
			.addCase(fetchAuthMe.pending, (state) => {
				state.data = null
				state.status = "loading"
			})
			.addCase(fetchAuthMe.fulfilled, (state, action) => {
				state.data = action.payload
				state.status = "loaded"
			})
			.addCase(fetchAuthMe.rejected, (state) => {
				state.data = null
				state.status = "error"
			})
			.addCase(fetchRegister.pending, (state) => {
				state.data = null
				state.status = "loading"
			})
			.addCase(fetchRegister.fulfilled, (state, action) => {
				state.data = action.payload
				state.status = "loaded"
			})
			.addCase(fetchRegister.rejected, (state) => {
				state.data = null
				state.status = "error"
			})
	}
})


//Проверка на авторизацию
 export const selectIsAuth = (state) => {
 	return Boolean(state.auth.data)
 }

 export const {logout} = authSlice.actions
export default authSlice.reducer