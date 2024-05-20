import React, {useEffect, useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import moment from "moment";

import {Post} from '../components/Post';
import {TagsBlock} from '../components/TagsBlock';
import {CommentsBlock} from '../components/CommentsBlock';
import {useDispatch, useSelector} from "react-redux";
import {fetchPosts, fetchTags} from "../redux/slices/posts";
import {getAllComments} from "../redux/slices/comment";
import postImg from '../images/post.jpg'

export const Home = () => {
	const dispatch = useDispatch();
	const userData = useSelector(state => state.auth.data)
	const {posts, tags} = useSelector(state => state.posts)
	const [allComments, setAllComments] = useState([])
	const [sortedPosts, setSortedPosts] = useState(posts.items)
	const [currentTab, setCurrentTab] = useState(0);
	const isPostsLoading = posts.status === "loading"
	const isTagsLoading = tags.status === "loading"

	//Сортировка постов
	const popularPostSort = () => {
		const popularPost = [...posts.items].sort((a, b) => b.viewsCount - a.viewsCount)
		setSortedPosts(popularPost);
	}
	const newPostsSort = () => {
		const newPosts = [...posts.items].sort((a, b) => {
			return new Date(b.createdAt) - new Date(a.createdAt)
		})
		setSortedPosts(newPosts);
	}

	useEffect(() => {
		dispatch(fetchPosts())
		dispatch(fetchTags())
	}, []);

	useEffect(() => {
		if (currentTab === 0) {
			newPostsSort();
		} else {
			popularPostSort();
		}
	}, [posts, currentTab]);

	useEffect(() => {
		dispatch(getAllComments()).then(data => setAllComments(data.payload))
	}, []);

	if (posts.items.length === 0 && !isPostsLoading) {
		return <>
			<img style={{height: '500px'}} src={postImg} alt="image"/>
		</>

	}

	return (
		<>
			<Tabs
				style={{marginBottom: 15}} value={currentTab} aria-label="basic tabs example">
				<Tab style={{fontWeight:'bold', fontSize:18}} onClick={() => setCurrentTab(0)} label="Новые"/>
				<Tab style={{fontWeight:'bold', fontSize:18}} onClick={() => setCurrentTab(1)} label="Популярные"/>
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostsLoading ? [...Array(5)] : sortedPosts).map((obj, i) => {
						return isPostsLoading ? <Post key={i} isLoading={true}/> : <Post
							id={obj._id}
							key={i}
							title={obj.title}
							imageUrl={obj.imageUrl ? obj.imageUrl : ""}
							user={obj.user}
							createdAt={moment(obj.createdAt).format('D MMMM YYYY, HH:mm')}
							viewsCount={obj.viewsCount}
							commentsCount={obj.comments.length}
							tags={obj.tags}
							isEditable={obj.user?._id === userData?._id}
						/>
					})}
				</Grid>
				<Grid xs={4} item>
					<CommentsBlock
						isHomePage={true}
						items={
							allComments.slice(0, 5).map((obj, i) => {
								return {
									user: {
										commentId: obj._id,
										fullName: obj.author,
										avatarUrl: obj.avatarUrl,
									},
									text: obj.comment,
								}
							})
						}
						isLoading={false}
					/>
					<TagsBlock items={tags.items} isLoading={isTagsLoading}/>
				</Grid>
			</Grid>
		</>
	);
};
