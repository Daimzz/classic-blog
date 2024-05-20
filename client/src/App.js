import Container from "@mui/material/Container";
import {Routes, Route} from "react-router-dom";
import {Header} from "./components";
import {Home, FullPost, Registration, AddPost, Login} from "./pages";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {fetchAuthMe } from "./redux/slices/auth";
import {TagPage} from "./pages/TagPage";

function App() {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(fetchAuthMe())
	}, []);

	return (
		<>
			<Header/>
			<Container maxWidth="lg">
				<Routes>
					<Route path="/" element={<Home/>}/>
					<Route path="/posts/:id" element={<FullPost/>}/>
					<Route path="/posts/:id/edit" element={<AddPost/>}/>
					<Route path="/add-post" element={<AddPost/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/register" element={<Registration/>}/>
					<Route path="/tags/:tag" element={<TagPage/>}/>
				</Routes>
			</Container>
		</>
	);
}

export default App;
