import React, {useEffect, useState} from "react";

import {Post} from "../components/Post";
import {AddComment} from "../components/AddComment";
import {CommentsBlock} from "../components/CommentsBlock";
import {useParams} from "react-router-dom";
import axios from "../axios";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import {useDispatch } from "react-redux";
import { getPostComments} from "../redux/slices/comment";
import {fetchComments} from "../utils";

export const FullPost = () => {
	const params = useParams()
	const dispatch = useDispatch()
	const [deleteCommentFlag, setDeleteCommentFlag] = useState(false)
	const [commentsData, setCommentsData] = useState([])
	const [data, setData] = useState()
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {
		axios.get(`/posts/${params.id}`).then(({data}) => {
			setIsLoading(false)
			setData(data)
		}).catch(err => {
			setIsLoading(false)
			console.warn(err)
			alert('Ошибка при получении статьи')
		})
	}, [params.id]);

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const response = await dispatch(getPostComments(params.id))
				setCommentsData(response.payload)
			} catch (e) {
				console.log(e)
			}
		}
		fetchComments()
	}, [dispatch, params.id, deleteCommentFlag]);


	if (isLoading) {
		return <Post isLoading={isLoading} isFullPost/>
	}
	return (
		<>
			<Post
				id={data._id}
				title={data.title}
				imageUrl={data.imageUrl ? data.imageUrl : ''}
				user={data.user}
				createdAt={moment(data.createdAt).format('D MMMM YYYY, HH:mm')}
				viewsCount={data.viewsCount}
				commentsCount={commentsData.length}
				tags={data.tags}
				isFullPost
			>
				<ReactMarkdown children={data.text}/>
			</Post>
				<CommentsBlock
				deleteCommentFlag={deleteCommentFlag}
				setDeleteCommentFlag={setDeleteCommentFlag}
				items={
					commentsData.map((obj, i) => {
						return {
							user: {
								postId: params.id,
								commentId: obj._id,
								fullName: obj.author,
								avatarUrl: obj.avatarUrl,
							},
							text: obj.comment,
						}
					})

				}
				isLoading={false}
			>

				<AddComment setCommentsData={setCommentsData}/>
			</CommentsBlock>

		</>
	);
};
